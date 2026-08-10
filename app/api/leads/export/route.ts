import { databaseErrorMessage, getDb, toLead, type LeadRow } from "../../../../db";
import { getChatGPTUser } from "../../../chatgpt-auth";

const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export async function GET(request: Request) {
  if (!(await getChatGPTUser())) return Response.json({ error: "请先登录管理后台。" }, { status: 401 });
  try {
    const url = new URL(request.url), status = url.searchParams.get("status")?.trim() || "", industry = url.searchParams.get("industry")?.trim() || "", keyword = url.searchParams.get("q")?.trim().toLowerCase() || "";
    const { data, error } = await getDb().from("truck_etc_leads").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const rows = (data as LeadRow[]).map(toLead).filter((lead) => (!status || status === "全部" || lead.status === status) && (!industry || industry === "全部" || lead.industry === industry) && (!keyword || [lead.leadNo, lead.contactName, lead.phone].some((value) => value.toLowerCase().includes(keyword))));
    const header = ["线索编号", "提交时间", "企业行业", "车辆数量", "联系人", "联系电话", "来源", "跟进状态"];
    const body = rows.map((lead) => [lead.leadNo, lead.createdAt, lead.industry, lead.vehicleCount, lead.contactName, lead.phone, lead.source, lead.status].map(csvCell).join(","));
    const csv = "\uFEFF" + [header.map(csvCell).join(","), ...body].join("\r\n");
    return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="truck-etc-leads-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: databaseErrorMessage(error) }, { status: 500 });
  }
}
