import { getDb } from "../../../db";
import { getChatGPTUser } from "../../chatgpt-auth";

const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
const unauthorized = () => Response.json({ error: "请先登录管理后台。" }, { status: 401 });

export async function GET() {
  if (!(await getChatGPTUser())) return unauthorized();
  const { data, error } = await getDb().from("truck_etc_managers").select("id, manager_name, manager_code, active").order("created_at", { ascending: false });
  if (error) return Response.json({ error: "客户经理列表暂时无法加载。" }, { status: 500 });
  return Response.json({ managers: (data ?? []).map((item) => ({ id:item.id, managerName:item.manager_name, managerCode:item.manager_code, active:item.active })) });
}

export async function POST(request: Request) {
  if (!(await getChatGPTUser())) return unauthorized();
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const managerName = clean(body.managerName);
  if (!managerName || managerName.length > 30) return Response.json({ error: "请输入不超过30个字的客户经理姓名。" }, { status: 400 });
  const managerCode = `cm-${crypto.randomUUID().replaceAll("-", "").slice(0, 18)}`;
  const { data, error } = await getDb().from("truck_etc_managers").insert({ manager_name:managerName, manager_code:managerCode }).select("id, manager_name, manager_code, active").single();
  if (error) return Response.json({ error: "创建失败，请确认已执行最新数据库迁移。" }, { status: 500 });
  return Response.json({ manager: { id:data.id, managerName:data.manager_name, managerCode:data.manager_code, active:data.active } }, { status: 201 });
}
