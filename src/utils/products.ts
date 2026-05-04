import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const adminKey =
  serviceRoleKey && serviceRoleKey !== "your_service_role_key_here"
    ? serviceRoleKey
    : anonKey;

const adminSupabase = createClient(supabaseUrl, adminKey, {
  auth: {
    persistSession: false,
  },
});

export type ProductPayload = {
  id?: string;
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  image_url?: string;
  stock?: number;
  metadata?: Record<string, unknown>;
};

const normalizeProduct = (payload: ProductPayload) => ({
  name: payload.name?.trim() || "Untitled Product",
  price: Number(payload.price ?? 0),
  description: payload.description?.trim() || "",
  category: payload.category?.trim() || "General",
  image_url: payload.image_url?.trim() || "",
  stock: Number(payload.stock ?? 0),
  metadata: payload.metadata ?? {},
  updated_at: new Date().toISOString(),
});

export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await adminSupabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Product[];
}

export async function createAdminProduct(payload: ProductPayload): Promise<Product> {
  const { data, error } = await adminSupabase
    .from("products")
    .insert(normalizeProduct(payload))
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Product;
}

export async function updateAdminProduct(payload: ProductPayload): Promise<Product> {
  if (!payload.id) {
    throw new Error("Missing product id");
  }

  const { data, error } = await adminSupabase
    .from("products")
    .update(normalizeProduct(payload))
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Product;
}

export async function deleteAdminProduct(id?: string): Promise<void> {
  if (!id) {
    throw new Error("Missing product id");
  }

  const { error } = await adminSupabase.from("products").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
