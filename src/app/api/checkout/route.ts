import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, customer_name, customer_email, shipping_address, items, subtotal, gst, discount, total, payment_method } = body;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id,
        customer_name,
        customer_email,
        shipping_address,
        items,
        subtotal,
        gst,
        discount,
        total,
        payment_method,
        payment_status: "Pending", // Mock initial status
        fulfillment_status: "Unfulfilled",
      })
      .select()
      .single();

    if (error) {
      console.error("Order insertion error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
  }
}
