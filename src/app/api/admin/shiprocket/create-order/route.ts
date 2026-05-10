import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminUnauthorizedResponse, hasValidAdminSession } from "@/utils/admin-auth";
import { createShiprocketOrder } from "@/lib/shiprocket";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  if (!(await hasValidAdminSession())) {
    return adminUnauthorizedResponse();
  }

  try {
    const { orderId } = await req.json();

    // 1. Fetch order details from Supabase
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (orderData.shiprocket_order_id) {
      return NextResponse.json({ error: "Already pushed to Shiprocket" }, { status: 400 });
    }

    // 2. Pre-flight Validation
    const address = orderData.shipping_address;

    if (!address || !address.address || !address.pin || !address.city) {
      return NextResponse.json({ error: "Incomplete shipping address. Cannot process." }, { status: 400 });
    }

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json({ error: "Order has no items. Cannot process." }, { status: 400 });
    }

    if (!orderData.customer_name || orderData.customer_name.trim() === "") {
      return NextResponse.json({ error: "Customer name is required." }, { status: 400 });
    }
    
    // Construct order items
    type OrderItemRow = {
      id: string;
      name: string;
      quantity: number;
      price: number;
    };

    const orderItems = (orderData.items as OrderItemRow[]).map((item) => ({
      name: item.name,
      sku: item.id.substring(0, 8), // Provide a dummy SKU if not exist
      units: item.quantity,
      selling_price: item.price,
    }));

    const shiprocketPayload = {
      order_id: `FF-${orderData.id.split('-')[0].toUpperCase()}`,
      order_date: new Date(orderData.created_at).toISOString().split('T')[0],
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
      billing_customer_name: orderData.customer_name,
      billing_last_name: "", // You could extract this from the name if needed
      billing_address: address.address,
      billing_city: address.city,
      billing_pincode: address.pin,
      billing_state: "Maharashtra", // Hardcoded fallback if not provided, Shiprocket requires state
      billing_country: "India",
      billing_email: orderData.customer_email,
      billing_phone: "9876543210", // Valid 10-digit format for Shiprocket (dummy fallback)
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: "Prepaid", // Based on your custom form checkout
      sub_total: orderData.total,
      length: process.env.SHIPROCKET_DEFAULT_LENGTH || 10,
      breadth: process.env.SHIPROCKET_DEFAULT_BREADTH || 10,
      height: process.env.SHIPROCKET_DEFAULT_HEIGHT || 10,
      weight: process.env.SHIPROCKET_DEFAULT_WEIGHT || 0.5,
    };

    // 3. Push to Shiprocket
    const shiprocketRes = await createShiprocketOrder(shiprocketPayload);

    if (shiprocketRes?.status_code === 400 || shiprocketRes?.status_code === 401 || !shiprocketRes.order_id) {
        console.error("Shiprocket API Error:", shiprocketRes);
        return NextResponse.json({ error: shiprocketRes.message || "Shiprocket API Error" }, { status: 400 });
    }

    // 4. Save Shiprocket details back to Supabase
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        shiprocket_order_id: String(shiprocketRes.order_id),
        shiprocket_shipment_id: String(shiprocketRes.shipment_id),
        fulfillment_status: "Processing"
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Failed to update order with Shiprocket data:", updateError);
    }

    return NextResponse.json({ success: true, shiprocketData: shiprocketRes });
  } catch (error) {
    console.error("Shiprocket integration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
