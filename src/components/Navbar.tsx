"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 text-zinc-900">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center h-20 px-6 lg:px-12">
        <Link href="/">
          <Logo />
        </Link>
        
        <div className="hidden md:flex gap-10 items-center">
          {["Keychains", "Frames", "Fidgets", "Drops"].map((item) => (
            <Link 
              key={item}
              href={`/collection?category=${item}`}
              className="text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
          {isSearchOpen ? (
            <form action="/collection" method="GET" className="relative flex items-center hidden sm:flex">
              <input 
                type="text" 
                name="q" 
                autoFocus
                placeholder="Search..." 
                className="w-32 focus:w-48 transition-all outline-none border-b border-zinc-300 focus:border-zinc-900 text-sm py-1 bg-transparent placeholder:text-zinc-400" 
              />
              <button 
                type="button" 
                onClick={() => setIsSearchOpen(false)}
                className="material-symbols-outlined absolute right-0 text-zinc-400 hover:text-zinc-900 text-sm"
              >
                close
              </button>
            </form>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="material-symbols-outlined text-zinc-900 hover:text-zinc-500 transition-all active:scale-90">
              search
            </button>
          )}
          
          <button onClick={() => setIsCartOpen(true)} className="material-symbols-outlined text-zinc-900 hover:text-zinc-500 transition-all active:scale-90 relative">
            shopping_cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#29fe57] text-[#00711f] text-[10px] font-bold font-sans w-4 h-4 flex items-center justify-center rounded-full tracking-normal shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
          <Link href="/auth" className="material-symbols-outlined text-zinc-900 hover:text-zinc-500 transition-all active:scale-90">
            person
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
