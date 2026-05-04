import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/utils/admin-auth";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  const expectedPassword = process.env.ADMIN_PANEL_PASSWORD;
  const sessionToken = process.env.ADMIN_PANEL_SESSION_TOKEN;

  if (!expectedPassword || !sessionToken) {
    return NextResponse.json({ error: "Admin credentials are not configured" }, { status: 500 });
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ error: "Access denied" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
