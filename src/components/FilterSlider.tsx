"use client";

import React from "react";
import Link from "next/link";

export default function FilterSlider({ items, active }: { items: { label: string; href: string }[]; active?: string }) {
  return (
    <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
      <div className="flex gap-3 py-2">
        {items.map((it) => (
          <Link
            key={it.label}
            href={it.href}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors text-[11px] font-bold uppercase ${active === it.label ? "bg-black text-white border-black" : "bg-white text-zinc-700 border-zinc-200"}`}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
