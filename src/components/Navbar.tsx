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
      {/* Top Banner (hidden on small screens to save vertical space) */}
      <div className="hidden sm:flex bg-gradient-to-r from-[#29fe57] via-[#24e54e] to-[#29fe57] overflow-hidden whitespace-nowrap py-1 flex items-center border-b border-black/5">
        <div className="animate-marquee flex items-center shrink-0 w-max">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-[#00711f] text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-3 sm:px-4 flex items-center shrink-0">
              Free Shipping On All Orders <span className="mx-4 text-[#00711f]/40">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-black text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-2 sm:py-0 sm:h-[72px] flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center justify-between gap-4 sm:contents">
            {/* Left: Logo */}
            <Link href="/" className="transition-all duration-300 hover:-translate-y-1 inline-block shrink-0">
              <Logo inverted className="text-xl sm:text-2xl" />
            </Link>

            <div className="flex items-center gap-4 sm:hidden text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
              <span>Shop</span>
              <span>Support</span>
            </div>
          </div>
          
          {/* Center: Links */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:hidden">
            {[
              { name: "Home", href: "/" },
              { name: "All Products", href: "/collection" },
              { name: "Contact Us", href: "/contact" },
            ].map((link) => (
              <div key={link.name} className="group relative shrink-0">
                <Link 
                  href={link.href} 
                  className="relative inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:text-[#29fe57] uppercase tracking-wider"
                >
                  {link.name}
                </Link>
              </div>
            ))}
          </div>

          <div className="hidden sm:flex gap-10 items-center justify-center absolute left-1/2 -translate-x-1/2">
            {[
              { name: "Home", href: "/" },
              { name: "All Products", href: "/collection" },
              { name: "Contact Us", href: "/contact" },
            ].map((link) => (
              <div key={link.name} className="group relative">
                <Link 
                  href={link.href} 
                  className="relative inline-block text-[13px] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:text-[#29fe57] uppercase tracking-wider"
                >
                  {link.name}
                  <span className="absolute left-1/2 -bottom-1.5 h-[2px] w-full bg-[#29fe57] 
                  transform -translate-x-1/2 scale-x-0 origin-center 
                  transition-transform duration-300 
                  group-hover:scale-x-100"></span>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Right: Icons */}
          <div className="flex items-center gap-4 sm:gap-6 z-10 self-end sm:self-auto">
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
                  className="material-symbols-outlined absolute right-0 text-zinc-400 hover:text-[#29fe57] transition-colors text-sm"
                >
                  close
                </button>
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="material-symbols-outlined text-white hover:text-[#29fe57] transition-all duration-300 hover:-translate-y-1">
                search
              </button>
            )}
            
            <Link href="/auth" className="material-symbols-outlined text-white hover:text-[#29fe57] transition-all duration-300 hover:-translate-y-1">
              person
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="material-symbols-outlined text-white hover:text-[#29fe57] transition-all duration-300 hover:-translate-y-1 relative">
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
