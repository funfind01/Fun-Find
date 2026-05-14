import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SuccessPage() {
  return (
    <div className="bg-[#f9f9fa] text-[#1a1c1d] min-h-screen flex flex-col" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-zinc-950">Order Placed!</h1>
        <p className="text-zinc-500 text-lg max-w-md mb-12">
          Thank you for your purchase. We&apos;ve received your order and are preparing it for shipment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link 
            href="/profile" 
            className="flex-1 bg-zinc-950 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all text-sm"
          >
            View Orders
          </Link>
          <Link 
            href="/collection" 
            className="flex-1 bg-white border border-zinc-200 text-zinc-950 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all text-sm"
          >
            Keep Shopping
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
