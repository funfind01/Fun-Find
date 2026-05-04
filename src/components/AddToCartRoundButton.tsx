"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/supabase";

export default function AddToCartRoundButton({ product }: { product: Product }) {
  const { addToCart, setIsCartOpen } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url,
    });
    setIsCartOpen(true);
  };

  return (
    <button 
      onClick={handleAdd}
      className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full active:scale-90 transition-transform hover:bg-[#006e1e]"
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
    </button>
  );
}
