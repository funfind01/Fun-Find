import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminUnauthorizedResponse, hasValidAdminSession } from "@/utils/admin-auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  if (!(await hasValidAdminSession())) {
    return adminUnauthorizedResponse();
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ orders: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
