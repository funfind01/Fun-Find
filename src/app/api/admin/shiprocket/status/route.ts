import { NextResponse } from "next/server";
import { getShiprocketToken } from "@/lib/shiprocket";
import { adminUnauthorizedResponse, hasValidAdminSession } from "@/utils/admin-auth";

export async function GET() {
  if (!(await hasValidAdminSession())) {
    return adminUnauthorizedResponse();
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
