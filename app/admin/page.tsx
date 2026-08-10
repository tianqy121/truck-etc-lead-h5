import { requireChatGPTUser } from "../chatgpt-auth";
import AdminClient from "./admin-client";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  return <AdminClient displayName={user.displayName} />;
}
