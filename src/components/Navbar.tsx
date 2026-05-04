"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="fixed top-0 w-full z-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#b391fc] via-[#9171f8] to-[#b391fc] overflow-hidden whitespace-nowrap py-1.5 flex items-center">
        <div className="animate-marquee flex items-center shrink-0 w-max">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-white text-[10px] font-bold tracking-widest uppercase px-4 flex items-center shrink-0">
              Free Shipping On All Orders <span className="mx-4 text-white/70">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-black text-white">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center h-[72px] px-6 lg:px-12">
          {/* Left: Logo */}
          <Link href="/">
            <Logo inverted className="text-2xl" />
          </Link>
          
          {/* Center: Links */}
          <div className="hidden md:flex gap-10 items-center justify-center absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-[13px] font-bold text-white hover:text-zinc-300 transition-colors">Home</Link>
            <Link href="/collection" className="text-[13px] font-bold text-white hover:text-zinc-300 transition-colors">All Products</Link>
            <Link href="#" className="text-[13px] font-bold text-white hover:text-zinc-300 transition-colors">Contact Us</Link>
          </div>
          
          {/* Right: Icons */}
          <div className="flex items-center gap-6 z-10">
            {isSearchOpen ? (
              <form action="/collection" method="GET" className="relative flex items-center hidden sm:flex">
                <input 
                  type="text" 
                  name="q" 
                  autoFocus
                  placeholder="Search..." 
                  className="w-32 focus:w-48 transition-all outline-none border-b border-zinc-700 focus:border-white text-sm py-1 bg-transparent text-white placeholder:text-zinc-500" 
                />
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)}
                  className="material-symbols-outlined absolute right-0 text-zinc-400 hover:text-white text-sm"
                >
                  close
                </button>
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="material-symbols-outlined text-white hover:text-zinc-400 transition-colors">
                search
              </button>
            )}
            
            <Link href="/auth" className="material-symbols-outlined text-white hover:text-zinc-400 transition-colors">
              person
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="material-symbols-outlined text-white hover:text-zinc-400 transition-colors relative">
              shopping_bag
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#29fe57] text-[#00711f] text-[9px] font-bold font-sans w-[15px] h-[15px] flex items-center justify-center rounded-full tracking-normal shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
