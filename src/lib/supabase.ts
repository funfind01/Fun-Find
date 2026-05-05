import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  metadata: Record<string, unknown>;
  stock: number;
  created_at: string;
}

const demoProducts: Product[] = [
  {
    id: "demo-test",
    name: "0 Rs Checkout Tester",
    price: 0,
    description: "A free test product specifically designed to evaluate the checkout, payment, and shiprocket systems without incurring costs.",
    category: "Drops",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW9AQFxIPyy49vxLdTz2x9iQdF3VHsBEztrKTPaI3ByyjkRSpyRl_dyEI0ojZjk9au2Jl6IAYBU2SyUn58TTY7VjAlr-sf2LSXoAUTvwAx4MhAYsdGwIZJJ8oy1Q194hhDp7DeR8fSkWp9wuOON-CN-OmH_A3ctpMLw2FFNysksqni8CV3CGRxWPuv8EkW5GJacNxLdVSoPt7xH4YIXgfruxf5FsduZD7nlb0LizYyvP7qo12TCZIEZOT2hZH6Xb4xpp-iegdlW0E5",
    metadata: { material: "Virtual Data" },
    stock: 999,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-1",
    name: "Vector-01 Titanium",
    price: 185,
    description: "A high-end matte black kinetic piece engineered from aerospace-grade titanium.",
    category: "Keychains",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB41GYsTE-GuylqlU7LH0VJPzArHrFbfWzV89bbqIWjAi_r4v1UhJHkgw5AXLUZve7KQH-C9gnYjLBupTeYg91-hCKk42YtF88P3Ivx8QbM_uTAS9AFvcaOSEIaEqbjFcayc8iC7AwkGrnfguXtqDALERiZF9DsqY-DPftFowgm_gWgh4mVNIHmu36o3Iv7l4xuNJKqf21myGOVujiPF75ukZNOCGw6PJVTTS4_ogWmyMZrdSAY7iHu1TjVQV7iyLCw3jj3hVb4Vk77",
    metadata: {},
    stock: 10,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "demo-2",
    name: "Apex Fun Find Frame",
    price: 320,
    description: "Intricately engineered mechanical frame with precision gear geometry.",
    category: "Frames",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANKN2fKcQIYjH7baNTqJadG0D717lZ5XHwpRvne6BeDMP9GzAEIxnyi4zY8pw5gclrQ8TgjfbsV9MOobiJEQqOMNzyNqx9I4PTMwdF05ve4d9r4ynXPeOokh5nKTpDh3j6FFWh3rzEUfDdEQVKcZ3DsLMSAeIwwMTgoHQnso-kggeS22CuKBV0rjoR2fq-krdou5LzWkwFaCgZVeS_7nYJxEFPFbjrl49ckmi8uBJjI2RXQOsYL_SwPPatfG__Yp-R32u1uBVPnNEM",
    metadata: {},
    stock: 8,
    created_at: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "demo-3",
    name: "Carbon Stealth Grip",
    price: 145,
    description: "Carbon-fiber inspired tactile tool with sharp industrial profile.",
    category: "Fidgets",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBcm4uNiX-mqPu6gxnlt9EuUiqsDRKzgH6khauEs0mbq_fbEcgliQPIbvaw1KTlt8TkL1zJG_8BJ50ehOdRVi8mnWImZBQ9laf27Aq4OEovtv3A68xazhB9djgcAmvjJXZRwveSVifDE6_wMqmbyWHggxzx63EBBIagIXPBYkv0zDLWC6O4cTcsJBWZHQQzjmwp6xkk9GcoP9Hz_bjBnl_QAJmkqZXHCulEoecEdyd5k_csSK83MnVxXymnnURxJoroUR8_c5oyBvzD",
    metadata: {},
    stock: 12,
    created_at: "2026-01-03T00:00:00.000Z",
  },
];

const getFallbackProduct = (id: string): Product => {
  const numericIndex = Number(id);

  if (Number.isInteger(numericIndex) && numericIndex > 0) {
    return demoProducts[numericIndex - 1] ?? demoProducts[0];
  }

  return demoProducts.find((p) => p.id === id) ?? demoProducts[0];
};

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return demoProducts;
  }

  if (!data || data.length === 0) {
    return demoProducts;
  }

  // Prepend the test product to ensure it's always available for checkout testing
  const testProduct = demoProducts.find(p => p.id === "demo-test");
  if (testProduct && !data.some(p => p.id === "demo-test")) {
    return [testProduct, ...data] as Product[];
  }

  return data as Product[];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return getFallbackProduct(id);
  }

  return (data as Product) ?? getFallbackProduct(id);
};
