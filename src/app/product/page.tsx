import { getProducts } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function ProductEntryPage() {
  const products = await getProducts();

  if (products.length > 0) {
    redirect(`/product/${products[0].id}`);
  }

  redirect("/collection");
}
