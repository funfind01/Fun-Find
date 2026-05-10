import Link from "next/link";
import { getProducts } from "@/lib/supabase";
import QuickAddButton from "./QuickAddButton";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import ProductRating from "@/components/ProductRating";

export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ category?: string, q?: string, sort?: string, instock?: string }> }) {
  const params = await searchParams;
  const currentCategory = params.category || "All";
  const currentSearch = params.q || "";
  const currentSort = params.sort || "featured";
  const inStockOnly = params.instock === "true";

  const allProducts = await getProducts();
  
  const availableCategories = Array.from(new Set(allProducts.map(p => p.category)));
  const navCategories = ["All", ...availableCategories];
  if (!navCategories.includes("Drops")) navCategories.push("Drops");

  const availableMaterials = Array.from(
    new Set(allProducts.map(p => p.metadata?.material).filter(Boolean))
  ) as string[];

  let products = [...allProducts];
  
  if (currentCategory !== "All") {
    products = products.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
  }
  
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
    <div className="bg-[#f9f9fa] text-[#1a1c1d] min-h-screen">
      <Navbar />

      <div className="max-w-[1440px] mx-auto mt-20 flex">
        <aside className="h-screen w-64 sticky top-20 border-r border-zinc-100 hidden lg:flex flex-col gap-4 p-8 bg-white">
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">FILTERS</h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Refine Selection</p>
          </div>

          <nav className="flex flex-col gap-2">
            <Link 
              href={`/collection?category=${currentCategory}${currentSearch ? `&q=${currentSearch}` : ''}`}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-bold uppercase tracking-wider transition-all ${!currentSort || currentSort === 'featured' && !inStockOnly ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-100'}`}
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
              All Products
            </Link>
            <Link 
              href={`/collection?category=${currentCategory}${currentSearch ? `&q=${currentSearch}` : ''}&sort=newest`}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-bold uppercase tracking-wider transition-all ${currentSort === 'newest' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-100'}`}
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              New Arrivals
            </Link>
            <Link 
              href={`/collection?category=${currentCategory}${currentSearch ? `&q=${currentSearch}` : ''}&sort=price_asc`}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-bold uppercase tracking-wider transition-all ${currentSort === 'price_asc' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-100'}`}
            >
              <span className="material-symbols-outlined text-lg">payments</span>
              Price Range
            </Link>
            <Link 
              href={`/collection?category=${currentCategory}${currentSearch ? `&q=${currentSearch}` : ''}&instock=${inStockOnly ? 'false' : 'true'}`}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-bold uppercase tracking-wider transition-all ${inStockOnly ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-100'}`}
            >
              <span className="material-symbols-outlined text-lg">event_available</span>
              In Stock Only
            </Link>
          </nav>

          <div className="mt-8 border-t border-zinc-100 pt-8">
            <p className="text-[10px] font-bold text-zinc-900 mb-4 tracking-widest uppercase">Materials</p>
            <div className="space-y-3">
              {availableMaterials.length > 0 ? availableMaterials.map((m) => (
                <Link key={m} href={`/collection?category=${currentCategory}&q=${m}`} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border ${currentSearch === m ? 'bg-black border-black' : 'border-zinc-300'} flex items-center justify-center transition-colors`}>
                    {currentSearch === m && <span className="material-symbols-outlined text-white text-[10px]">check</span>}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${currentSearch === m ? 'text-black' : 'text-zinc-600 group-hover:text-black'}`}>{m}</span>
                </Link>
              )) : (
                <p className="text-xs text-zinc-400">No specific materials found.</p>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-12 min-h-screen">
          <header className="mb-12">
            <nav className="mb-4 flex items-center gap-2 text-[12px] text-zinc-400 uppercase tracking-widest">
              <Link className="hover:text-black transition-colors" href="/">Shop</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-zinc-900">Collections</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-[48px] leading-[1.1] tracking-[-0.04em] font-extrabold text-black mb-2">{currentCategory === "All" ? "All Products" : currentCategory}</h1>
                <p className="text-[12px] text-zinc-500 tracking-widest uppercase">
                  Showing {products.length} {currentSearch ? `results for "${currentSearch}"` : 'objects'}
                </p>
              </div>
              <Link 
                href={`/collection?category=${currentCategory}${currentSearch ? `&q=${currentSearch}` : ''}&sort=${currentSort === 'price_desc' ? 'featured' : currentSort === 'price_asc' ? 'price_desc' : 'price_asc'}`}
                className="flex items-center gap-4 border-b border-zinc-200 py-2 px-1 hover:border-black transition-colors text-sm font-bold uppercase"
              >
                Sort By: {currentSort === 'newest' ? 'Newest' : currentSort === 'price_asc' ? 'Price (Low)' : currentSort === 'price_desc' ? 'Price (High)' : 'Featured'}
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </Link>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-12">
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
                <div className="flex flex-col gap-1 p-6 bg-white">
                  <h3 className="text-xl md:text-2xl leading-[1.2] tracking-[-0.02em] font-bold text-zinc-900 group-hover:text-black transition-colors truncate">{product.name}</h3>
                  <p className="text-[12px] text-zinc-500 uppercase tracking-widest mb-1">{product.category} / Niche</p>
                  <ProductRating productId={product.id} />
                  <p className="mt-2 text-2xl leading-[1.2] font-bold text-[#006e1e]">₹{product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-24 flex items-center justify-center gap-8">
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
        <div className="flex flex-wrap justify-center gap-8 mb-12">
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
