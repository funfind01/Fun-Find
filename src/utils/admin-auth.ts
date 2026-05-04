import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "kinetic_admin_session";

export async function hasValidAdminSession() {
  const expectedToken = process.env.ADMIN_PANEL_SESSION_TOKEN;

  if (!expectedToken) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === expectedToken;
}

export function adminUnauthorizedResponse() {
  return NextResponse.json({ error: "Admin authorization required" }, { status: 401 });
}

export function isMissingProductsTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");

  return (
    message.includes("public.products") ||
    message.includes("schema cache") ||
    message.includes("relation") && message.includes("products")
  );
}
