import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type LeadRow = {
  id: number;
  lead_no: string;
  industry: string;
  vehicle_count: string;
  contact_name: string;
  phone: string;
  source: string;
  manager_code: string | null;
  manager_name: string | null;
  status: string;
  created_at: string;
};

export type Lead = {
  id: number;
  leadNo: string;
  industry: string;
  vehicleCount: string;
  contactName: string;
  phone: string;
  source: string;
  managerCode: string | null;
  managerName: string | null;
  status: string;
  createdAt: string;
};

let client: SupabaseClient | undefined;

/** Server-only Supabase client. Never import this module from a client component. */
export function getDb(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Supabase 未配置。请设置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY。");
  client = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  return client;
}

export function toLead(row: LeadRow): Lead {
  return { id: row.id, leadNo: row.lead_no, industry: row.industry, vehicleCount: row.vehicle_count, contactName: row.contact_name, phone: row.phone, source: row.source, managerCode: row.manager_code, managerName: row.manager_name, status: row.status, createdAt: row.created_at };
}

export function databaseErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if ((message.includes("relation") && message.includes("does not exist")) || message.includes("truck_etc_leads")) return "线索台账尚未初始化，请先在 Supabase 执行数据库迁移。";
  if (message.includes("SUPABASE_URL") || message.includes("SUPABASE_SERVICE_ROLE_KEY")) return "Supabase 环境变量未配置，请联系管理员。";
  return "系统暂时无法访问线索台账，请稍后重试。";
}
