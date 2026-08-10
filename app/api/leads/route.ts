import { databaseErrorMessage, getDb, toLead, type LeadRow } from "../../../db";
import { getChatGPTUser } from "../../chatgpt-auth";

const industries = new Set(["物流/货运", "冷链运输", "制造业配送", "危化品运输", "其他"]);
const vehicleCounts = new Set(["1—5辆", "6—20辆", "21—50辆", "50辆以上"]);
const statuses = new Set(["待联系", "已联系", "意向明确", "已签约", "暂不办理"]);
const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
const adminResponse = () => Response.json({ error: "请先登录管理后台。" }, { status: 401 });

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const industry = clean(body.industry), vehicleCount = clean(body.vehicleCount), contactName = clean(body.contactName), phone = clean(body.phone);
    if (!industries.has(industry) || !vehicleCounts.has(vehicleCount) || !contactName) return Response.json({ error: "请完整填写需求信息。" }, { status: 400 });
    if (!/^1\d{10}$/.test(phone)) return Response.json({ error: "请输入正确的手机号码。" }, { status: 400 });
    const leadNo = `HC-${new Date().toISOString().slice(0, 7).replace("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { data, error } = await getDb().from("truck_etc_leads").insert({ lead_no: leadNo, industry, vehicle_count: vehicleCount, contact_name: contactName, phone }).select("lead_no").single();
    if (error) throw error;
    return Response.json({ success: true, leadNo: data.lead_no }, { status: 201 });
  } catch (error) {
    return Response.json({ error: databaseErrorMessage(error) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!(await getChatGPTUser())) return adminResponse();
  try {
    const url = new URL(request.url), status = url.searchParams.get("status")?.trim() || "", industry = url.searchParams.get("industry")?.trim() || "", keyword = url.searchParams.get("q")?.trim().toLowerCase() || "";
    let query = getDb().from("truck_etc_leads").select("*").order("created_at", { ascending: false });
    if (status && status !== "全部") query = query.eq("status", status);
    if (industry && industry !== "全部") query = query.eq("industry", industry);
    const { data, error } = await query;
    if (error) throw error;
    const leads = (data as LeadRow[]).filter((row) => !keyword || [row.lead_no, row.contact_name, row.phone].some((value) => value.toLowerCase().includes(keyword))).map(toLead);
    return Response.json({ leads });
  } catch (error) {
    return Response.json({ error: databaseErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await getChatGPTUser())) return adminResponse();
  try {
    const body = (await request.json()) as Record<string, unknown>, leadNo = clean(body.leadNo), status = clean(body.status);
    if (!leadNo || !statuses.has(status)) return Response.json({ error: "状态信息不完整。" }, { status: 400 });
    const { error } = await getDb().from("truck_etc_leads").update({ status }).eq("lead_no", leadNo);
    if (error) throw error;
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: databaseErrorMessage(error) }, { status: 500 });
  }
}
