import Link from "next/link";
import { getProducts } from "@/lib/supabase";
import QuickAddButton from "./QuickAddButton";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import ProductRating from "@/components/ProductRating";
import SortDropdown from "@/components/SortDropdown";
import MobileFilters from "@/components/MobileFilters";

export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ category?: string, q?: string, sort?: string, instock?: string }> }) {
  const params = await searchParams;
  const currentCategory = params.category || "All";
  const currentSearch = params.q || "";
  const currentSort = params.sort || "featured";
  const inStockOnly = params.instock === "true";

  const allProducts = await getProducts();

  let products = [...allProducts];
  
  if (currentCategory !== "All") {
    products = products.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
  }

  const categories = Array.from(new Set(allProducts.map((p: any) => p.category || "Other"))).sort();
  
  if (currentSearch) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(currentSearch.toLowerCase()))
    );
  }

  if (inStockOnly) {
    products = products.filter(p => p.stock > 0);
  }

  if (currentSort === "newest") {
    products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (currentSort === "price_asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price_desc") {
    products.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-[#f9f9fa] text-[#1a1c1d] min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="max-w-[1440px] mx-auto pt-24 sm:pt-20">

        <main className="flex-1 p-4 sm:p-6 lg:p-12 min-h-screen">
          <header className="mb-8 sm:mb-12">
            <nav className="mb-4 flex items-center gap-2 text-[12px] text-zinc-400 uppercase tracking-widest">
              <Link className="hover:text-black transition-colors" href="/">Shop</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-zinc-900">Collections</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
              <div>
                <h1 className="text-[32px] sm:text-[48px] leading-[1.05] tracking-[-0.04em] font-extrabold text-black mb-2">{currentCategory === "All" ? "All Products" : currentCategory}</h1>
                <p className="text-[11px] sm:text-[12px] text-zinc-500 tracking-widest uppercase">
                  Showing {products.length} {currentSearch ? `results for "${currentSearch}"` : 'objects'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <SortDropdown currentSort={currentSort} currentCategory={currentCategory} currentSearch={currentSearch} />
              </div>
            </div>

          {/* Mobile action row: Filters + Sort */}
          <div className="mt-6 mb-6 flex items-center justify-between gap-4 px-1">
            <MobileFilters categories={categories} currentCategory={currentCategory} inStockOnly={inStockOnly} />
          </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
            {products.map((product, idx) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-xl hover:border-zinc-300 transition-all duration-300 cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#eeeeef]">
                  {product.image_url ? (
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={product.image_url} alt={product.name} />
                  ) : (
                    <div className="w-full h-full bg-zinc-200" />
                  )}

                  {idx === 0 && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#29fe57] text-[#00711f] px-3 py-1 text-[10px] uppercase tracking-widest rounded-full font-bold shadow-sm">New Drop</span>
                    </div>
                  )}

                  <QuickAddButton product={product} />
                </div>
                <div className="flex flex-col gap-1 p-4 sm:p-6 bg-white">
                  <h3 className="text-lg sm:text-xl md:text-2xl leading-[1.2] tracking-[-0.02em] font-bold text-zinc-900 group-hover:text-black transition-colors truncate">{product.name}</h3>
                  <p className="text-[11px] sm:text-[12px] text-zinc-500 uppercase tracking-widest mb-1">{product.category} / Niche</p>
                  <ProductRating productId={product.id} />
                  <p className="mt-2 text-xl sm:text-2xl leading-[1.2] font-bold text-[#006e1e]">₹{product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 sm:mt-24 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <button className="flex items-center gap-2 text-sm font-bold uppercase opacity-30 cursor-not-allowed">
              <span className="material-symbols-outlined">arrow_back</span>
              Prev
            </button>
            <div className="flex gap-4">
              <span className="text-sm font-bold border-b-2 border-black pb-1">01</span>
              <span className="text-sm font-bold text-zinc-300 pb-1">02</span>
              <span className="text-sm font-bold text-zinc-300 pb-1">03</span>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold uppercase hover:text-[#006e1e] transition-colors group">
              Next
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
        </main>
      </div>

      <footer className="w-full bg-zinc-900 border-t border-zinc-800 flex flex-col items-center py-16 px-6 text-center">
        <div className="mb-4">
          <Logo className="text-3xl" inverted />
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12">
          <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50" href="/legal/terms">Terms</Link>
          <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50" href="/legal/shipping">Shipping</Link>
          <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50" href="/legal/returns">Returns</Link>
          <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50" href="/legal/privacy">Privacy</Link>
        </div>
        <div className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">© 2024 Fun Find © 2024</div>
      </footer>
    </div>
  );
}
