import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      cart, 
      user, 
      totals,
      shippingAddress 
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Create order in database
      const { data, error } = await supabase.from('orders').insert({
        user_id: user?.id,
        customer_name: shippingAddress.name || user?.user_metadata?.name || 'Guest',
        customer_email: user?.email || 'guest@example.com',
        shipping_address: shippingAddress,
        items: cart,
        subtotal: totals.totalPrice,
        gst: totals.gst,
        discount: totals.discount,
        total: totals.total,
        payment_method: 'Razorpay',
        payment_status: 'Paid',
        shiprocket_order_id: razorpay_payment_id,
        fulfillment_status: 'Unfulfilled'
      });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return NextResponse.json({ success: true, message: 'Payment verified and order created' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
