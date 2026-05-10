import { NextResponse } from "next/server";
import crypto from "crypto";

// Cache token in memory to avoid regenerating on every request (token valid ~24h on Shiprocket)
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getShiprocketAuthToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_API_EMAIL,
      password: process.env.SHIPROCKET_API_PASSWORD,
    }),
  });

  const data = await res.json() as { token?: string };
  if (!res.ok || !data.token) throw new Error("Shiprocket auth login failed");

  cachedToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23h
  return cachedToken;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart } = body;

    const apiKey = process.env.SHIPROCKET_CHECKOUT_API_KEY;
    const secretKey = process.env.SHIPROCKET_CHECKOUT_SECRET_KEY;

    // ─── Smart One-Click Checkout path ───────────────────────────────────────
    // This product uses HMAC + API key via checkout-api.shiprocket.com
    if (apiKey && secretKey) {
      const payload = {
        cart_data: {
          items: cart.map((item: { id: string | number; quantity: number; price: number; name: string }) => ({
            variant_id: String(item.id),
            quantity: item.quantity,
            price: item.price,
            title: item.name,
          })),
        },
        redirect_url: (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000") + "/checkout",
        timestamp: new Date().toISOString(),
      };

      const payloadString = JSON.stringify(payload);
      const hmac = crypto
        .createHmac("sha256", secretKey)
        .update(payloadString)
        .digest("base64");

      const response = await fetch("https://checkout-api.shiprocket.com/api/v1/access-token/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
          "X-Api-HMAC-SHA256": hmac,
        },
        body: payloadString,
      });

      const data = await response.json() as { data?: { token?: string }; token?: string; message?: string };

      if (response.ok) {
        const token = data?.data?.token ?? data?.token;
        if (token) return NextResponse.json({ success: true, token });
      }

      // Log actual error for debugging
      console.error("[Shiprocket Checkout] Token error:", JSON.stringify(data));
      // Fall through to standard auth token as a usable signal
    }

    // ─── Fallback: use standard Shiprocket auth token ─────────────────────────
    // This still lets us verify connectivity and show status
    const fallbackToken = await getShiprocketAuthToken();
    return NextResponse.json({ success: true, token: fallbackToken, isFallback: true });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Shiprocket Token] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
