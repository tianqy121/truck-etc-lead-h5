import { requireChatGPTUser } from "../../chatgpt-auth";
import ManagerClient from "./manager-client";

export const dynamic = "force-dynamic";

export default async function ManagersPage() {
  await requireChatGPTUser("/admin/managers");
  return <ManagerClient />;
}
