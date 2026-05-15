"use client";

import React from "react";

export default function SortDropdown({ currentSort, currentCategory, currentSearch }: { currentSort: string; currentCategory: string; currentSearch: string; }) {
  const options = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price (Low)' },
    { value: 'price_desc', label: 'Price (High)' },
  ];

  return (
    <div className="relative inline-block text-left">
      <select
        className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-bold"
        defaultValue={currentSort}
        onChange={(e) => {
          const v = e.target.value;
          const href = `/collection?category=${currentCategory}${currentSearch ? `&q=${currentSearch}` : ''}&sort=${v}`;
          window.location.href = href;
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
