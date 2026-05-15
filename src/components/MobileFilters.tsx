"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  categories: string[];
  currentCategory: string;
  inStockOnly: boolean;
}

export default function MobileFilters({ categories, currentCategory, inStockOnly }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory || "All");
  const [onlyStock, setOnlyStock] = useState<boolean>(!!inStockOnly);

  const apply = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (selectedCategory && selectedCategory !== "All") {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    if (onlyStock) {
      params.set("instock", "true");
    } else {
      params.delete("instock");
    }
    const base = "/collection";
    router.push(`${base}?${params.toString()}`);
    setOpen(false);
  };

  const clearAll = () => {
    setSelectedCategory("All");
    setOnlyStock(false);
    router.push("/collection");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="block bg-white text-zinc-900 border border-zinc-200 rounded-md px-3 py-2 font-semibold shadow-sm"
        aria-label="Open filters"
      >
        Filters
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Slide-over panel from left */}
      <aside className={`fixed top-0 left-0 h-full w-4/5 max-w-xs md:w-80 md:max-w-none bg-white z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-lg">Filters</h3>
          <button onClick={() => setOpen(false)} className="text-zinc-500">Close</button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Category</h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`text-left px-3 py-2 rounded-md ${selectedCategory === 'All' ? 'bg-zinc-100 font-bold' : 'hover:bg-zinc-50'}`}>
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`text-left px-3 py-2 rounded-md ${selectedCategory === c ? 'bg-zinc-100 font-bold' : 'hover:bg-zinc-50'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Availability</h4>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} />
              <span className="text-sm">In stock only</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={apply} className="flex-1 bg-[#29fe57] text-[#00711f] font-bold px-4 py-2 rounded-md">Apply</button>
            <button onClick={clearAll} className="flex-1 border border-zinc-200 px-4 py-2 rounded-md">Clear</button>
          </div>
        </div>
      </aside>
    </>
  );
}
