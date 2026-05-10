import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/shiprocket/collections
// Shiprocket calls this to fetch your store's collections
export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("category");

    if (error) throw error;

    // Derive unique collections from product categories
    const categories = [...new Set((products ?? []).map((p) => p.category as string))];

    const collections = categories.map((cat, i) => ({
      id: String(i + 1),
      title: cat,
      handle: cat.toLowerCase().replace(/\s+/g, "-"),
      products_count: (products ?? []).filter((p) => p.category === cat).length,
    }));

    return NextResponse.json({ collections });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch collections";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
