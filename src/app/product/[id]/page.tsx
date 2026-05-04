import { getProductById, getProducts } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButtons from "./AddToCartButtons";
import Navbar from "@/components/Navbar";
import ProductGallery from "./ProductGallery";
import Logo from "@/components/Logo";
import ProductRating from "@/components/ProductRating";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Get other products for "Customers Also Bought"
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .sort(() => 0.5 - Math.random()) // Randomize
    .slice(0, 4);

  const fallbackSpecs: Array<[string, string]> = [
    ["MATERIAL", "CNC Machined Grade 5 Titanium"],
    ["WEIGHT", "42 Grams (Case Only)"],
    ["FINISH", "Radial Brushed / DLC Coated"],
    ["COMPATIBILITY", "Universal (Key Ring Included)"],
    ["MECHANISM", "Si3N4 Ceramic Hybrid Bearings"],
  ];

  const metadata = product.metadata as Record<string, unknown> | null;
  const dynamicSpecs =
    metadata && typeof metadata === "object"
      ? Object.entries(metadata)
          .filter(([k, value]) => k !== "images" && ["string", "number", "boolean"].includes(typeof value))
          .slice(0, 6)
          .map(([key, value]) => [key.replace(/_/g, " ").toUpperCase(), String(value)] as [string, string])
      : [];

  const extraImages = metadata && Array.isArray(metadata.images)
    ? metadata.images.filter(img => typeof img === "string")
    : [];
  const allImages = [product.image_url, ...extraImages].filter(Boolean) as string[];

  const specs = dynamicSpecs.length > 0 ? dynamicSpecs : fallbackSpecs;

  return (
    <div className="bg-[#f9f9fa] text-[#1a1c1d] min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24 max-w-[1440px] mx-auto px-6 lg:px-12">
        <nav className="mb-6 flex gap-2 text-[12px] text-[#46464a] uppercase tracking-widest">
          <Link href="/collection">Products</Link>
          <span>/</span>
          <Link href="/collection">{product.category}</Link>
          <span>/</span>
          <span className="text-black font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24 lg:min-h-[calc(100vh-7rem)] lg:items-start">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <ProductGallery images={allImages} productName={product.name} />
          </div>

          <div className="lg:col-span-5 flex flex-col min-h-[calc(100vh-11rem)]">
            <div className="mb-2">
              <span className="bg-[#29fe57] text-[#00711f] px-3 py-1 rounded-full text-xs font-bold">LIMITED DROP</span>
            </div>

            <h1 className="text-[42px] leading-[1.1] font-extrabold text-black mb-2">{product.name}</h1>

            <div className="mb-6">
              <ProductRating productId={product.id} />
            </div>

            <div className="text-[36px] font-bold text-black mb-6">₹{product.price.toFixed(2)}</div>

            <div className="space-y-5 mb-8">
              <p className="text-[16px] leading-relaxed text-[#46464a]">
                {product.description ||
                  "Engineered from a solid block of Grade 5 Titanium, this isn't just a key fob—it's a kinetic sculpture for your pocket. Designed for those who appreciate mechanical perfection and a high fidget factor."}
              </p>
              <div className="flex flex-wrap gap-2">
                {specs.slice(0, 4).map(([k, v]) => (
                  <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3f3f4] text-[#1a1c1d] text-[10px] font-bold uppercase tracking-widest border border-[#e2e2e3]">
                    <span className="text-[#46464a]">{k}:</span> {v}
                  </span>
                ))}
              </div>
            </div>

            <AddToCartButtons product={product} />
          </div>
        </div>

        <div className="border-t border-[#c7c6ca] pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-[32px] font-bold mb-8 uppercase">Technical Specs</h2>
              <div className="flex flex-col">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex justify-between py-4 border-b border-[#e2e2e3]">
                    <span className="text-[#46464a] font-bold">{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#f3f3f4] rounded-xl p-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-[32px] font-bold mb-4 uppercase">The Story</h2>
                <p className="text-[#46464a] leading-relaxed">
                  Born from a desire to combine high-performance material science with everyday tactile satisfaction. We spent 14 months iterating on the click and spin physics to ensure the most satisfying fidget experience ever integrated into a car accessory.
                </p>
              </div>
              <div className="w-full md:w-64 aspect-square bg-white rounded-lg shadow-sm overflow-hidden p-4">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChxSeQ9jbKBuYnij9pVRxrJmykFAySljjLJU1U0xNMtARxTOflxbObw_CyTWgX-ZwbeXFnhS0V04XgwV33Fnon39xqFj-oHmdIf7eYeq3oaqAJjsg5q3zpICHS-JXbmg-NnzehILAiaPR23L6bo9vgpYE0961jgVR_MtsudhB7rfj7N-paZRwqCIP_z_VHlVUo5n6kpk6GWt-3LZtUTtrNJJRnp45hVb7hyB5LA3jgYMG5jdTgPfKKzONcHvZdQ0QVBP2nFejNZHuL"
                  alt="Product story visual"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 border-t border-[#e2e2e3] pt-20">
          <h2 className="text-[32px] font-bold mb-12 text-center uppercase">Customers Also Bought</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id} className="group cursor-pointer flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-xl hover:border-zinc-300 transition-all duration-300">
                <div className="aspect-[4/5] bg-[#f3f3f4] overflow-hidden relative">
                  {p.image_url ? (
                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={p.image_url} alt={p.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-1 bg-white">
                  <h3 className="font-bold text-sm uppercase truncate text-zinc-900 group-hover:text-black transition-colors">{p.name}</h3>
                  <div className="text-[#006e1e] font-bold mt-1">₹{p.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-zinc-900 text-zinc-50 text-[10px] uppercase tracking-[0.2em] border-t border-zinc-800 flex flex-col items-center py-16 px-6 text-center">
        <div className="mb-4">
          <Logo className="text-3xl" inverted />
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <Link className="text-zinc-500 hover:text-zinc-50 transition-opacity" href="/legal/terms">Terms</Link>
          <Link className="text-zinc-500 hover:text-zinc-50 transition-opacity" href="/legal/shipping">Shipping</Link>
          <Link className="text-zinc-500 hover:text-zinc-50 transition-opacity" href="/legal/returns">Returns</Link>
          <Link className="text-zinc-500 hover:text-zinc-50 transition-opacity" href="/legal/privacy">Privacy</Link>
        </div>
        <div className="text-zinc-500">© 2024 Fun Find © 2024</div>
      </footer>
    </div>
  );
}
