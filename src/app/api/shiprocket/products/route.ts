import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/shiprocket/products
// Shiprocket calls this to fetch your product catalog
export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Format response in Shiprocket's expected catalog structure
    const formatted = (products ?? []).map((p) => ({
      id: String(p.id),
      title: p.name,
      handle: p.name.toLowerCase().replace(/\s+/g, "-"),
      vendor: "Fun Find",
      product_type: p.category,
      tags: [p.category],
      images: [
        { src: p.image_url, position: 1 },
        ...(Array.isArray(p.metadata?.images)
          ? (p.metadata.images as string[]).filter(Boolean).map((src: string, i: number) => ({ src, position: i + 2 }))
          : []),
      ],
      variants: [
        {
          id: String(p.id),
          title: "Default",
          price: String(p.price),
          sku: String(p.id).slice(0, 8).toUpperCase(),
          inventory_quantity: p.stock,
          requires_shipping: true,
          weight: 200,
          weight_unit: "g",
        },
      ],
    }));

    return NextResponse.json({ products: formatted });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
