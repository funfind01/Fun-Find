import { NextResponse } from "next/server";
import { hasValidAdminSession } from "@/utils/admin-auth";

export async function GET() {
  return NextResponse.json({ authenticated: await hasValidAdminSession() });
}
