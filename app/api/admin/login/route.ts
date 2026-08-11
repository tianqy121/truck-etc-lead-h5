import { NextResponse } from "next/server";
import { createAdminCookie, verifyAdminPassword } from "../../../chatgpt-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: "管理员密码不正确" }, { status: 401 });
  }
  const returnTo = typeof body.returnTo === "string" && body.returnTo.startsWith("/") && !body.returnTo.startsWith("//") ? body.returnTo : "/admin";
  const response = NextResponse.json({ returnTo });
  response.cookies.set("truck_etc_admin", createAdminCookie(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}
