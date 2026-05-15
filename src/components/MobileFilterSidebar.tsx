"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function MobileFilterSidebar({
  currentCategory,
  currentSearch,
  currentSort,
  inStockOnly,
  availableMaterials,
}: {
  currentCategory: string;
  currentSearch: string;
  currentSort: string;
  inStockOnly: boolean;
  availableMaterials: string[];
}) {
  const [open, setOpen] = useState(false);

  // Listen for a global event to open filters from other UI (e.g., Sort button)
  React.useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("openMobileFilters", handler);
    return () => window.removeEventListener("openMobileFilters", handler);
  }, []);

  return (
    <>
      <button
        aria-label="Open filters"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed left-4 top-28 z-50 bg-white/90 text-zinc-900 rounded-full p-3 shadow-lg border border-zinc-200"
      >
        <span className="material-symbols-outlined">filter_list</span>
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-[86%] max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-bold">Filters</h3>
          <button onClick={() => setOpen(false)} aria-label="Close filters" className="p-2 rounded-md">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 overflow-auto h-full">
          <nav className="flex flex-col gap-2">
            <Link
              href={`/collection?category=All${currentSearch ? `&q=${currentSearch}` : ''}`}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-bold uppercase tracking-wider transition-all ${currentSort === 'featured' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
              onClick={() => setOpen(false)}
            >
              All Products
            </Link>

            <Link
              href={`/collection?category=${currentCategory}${currentSearch ? `&q=${currentSearch}` : ''}&sort=newest`}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-bold uppercase tracking-wider transition-all ${currentSort === 'newest' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
              onClick={() => setOpen(false)}
            >
              New Arrivals
            </Link>

            <Link
              href={`/collection?category=${currentCategory}${currentSearch ? `&q=${currentSearch}` : ''}&sort=price_asc`}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-bold uppercase tracking-wider transition-all ${currentSort === 'price_asc' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
              onClick={() => setOpen(false)}
            >
              Price Range
            </Link>

            <Link
              href={`/collection?category=${currentCategory}${currentSearch ? `&q=${currentSearch}` : ''}&instock=${inStockOnly ? 'false' : 'true'}`}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-bold uppercase tracking-wider transition-all ${inStockOnly ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
              onClick={() => setOpen(false)}
            >
              In Stock Only
            </Link>
          </nav>

          {availableMaterials.length > 0 && (
            <div className="mt-6 border-t border-zinc-100 pt-4">
              <p className="text-[10px] font-bold text-zinc-900 mb-3 tracking-widest uppercase">Materials</p>
              <div className="flex flex-wrap gap-2">
                {availableMaterials.map((m) => (
                  <Link
                    key={m}
                    href={`/collection?category=${currentCategory}&q=${m}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-zinc-200 text-xs font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {m}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
    </>
  );
}
