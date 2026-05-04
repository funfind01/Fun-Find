"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/supabase";

export default function QuickAddButton({ product }: { product: Product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url,
    });
    
    setAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleQuickAdd}
      className={`absolute bottom-4 left-4 right-4 py-4 text-sm uppercase tracking-widest font-bold opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 ${
        added ? "bg-[#29fe57] text-[#003d10]" : "bg-black text-white hover:opacity-90"
      }`}
    >
      {added ? (
        <>
          <span className="material-symbols-outlined text-sm">check</span>
          Added
        </>
      ) : (
        "Quick Add"
      )}
    </button>
  );
}
