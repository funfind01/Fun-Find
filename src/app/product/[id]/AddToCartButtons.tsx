"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/supabase";

export default function AddToCartButtons({ product }: { product: Product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
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

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url,
    });
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-3 mt-auto">
      <button
        onClick={handleAddToCart}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
          added
            ? "bg-[#29fe57] text-[#003d10]"
            : "bg-black text-white hover:opacity-90"
        }`}
      >
        {added ? (
          <>
            <span className="material-symbols-outlined text-lg">check</span>
            Added to Cart!
          </>
        ) : (
          "ADD TO CART"
        )}
      </button>

      <button
        onClick={handleBuyNow}
        className="w-full border-2 border-black text-black py-4 rounded-lg font-bold text-lg hover:bg-[#f3f3f4] transition-colors active:scale-95"
      >
        BUY IT NOW
      </button>

      <div className="flex justify-between items-center px-2 text-sm text-[#46464a]">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">local_shipping</span>
          SHIPS IN 7 DAYS
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">verified</span>
          VERIFIED
        </div>
      </div>
    </div>
  );
}
