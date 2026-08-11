import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const returnTo = new URL(request.url).searchParams.get("return_to") || "/";
  const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
  const response = NextResponse.redirect(new URL(safeReturnTo, request.url));
  response.cookies.set("truck_etc_admin", "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
