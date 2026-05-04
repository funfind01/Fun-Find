import { NextResponse } from "next/server";
import { getShiprocketToken } from "@/lib/shiprocket";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_PANEL_SESSION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const srToken = await getShiprocketToken();
    
    if (srToken) {
      return NextResponse.json({
        status: "Connected",
        message: "API Auth Configured",
      });
    } else {
      return NextResponse.json({
        status: "Disconnected",
        message: "Invalid email and password combination",
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: "Disconnected",
      message: error instanceof Error ? error.message : "Connection Failed",
    });
  }
}
