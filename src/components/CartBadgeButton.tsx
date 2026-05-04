"use client";

import { useCart } from "@/context/CartContext";

export default function CartBadgeButton({ className = "" }: { className?: string }) {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <button 
      onClick={() => setIsCartOpen(true)} 
      className={`material-symbols-outlined relative transition-colors ${className}`}
    >
      shopping_cart
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#CCFF00] text-black text-[10px] font-bold font-sans w-4 h-4 flex items-center justify-center rounded-full shadow-sm tracking-normal">
          {totalItems}
        </span>
      )}
    </button>
  );
}
