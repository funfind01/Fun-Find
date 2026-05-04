"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
          >
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-950">Your Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-zinc-600">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">shopping_cart</span>
              <p className="font-bold uppercase tracking-widest text-sm">Cart is empty</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 text-zinc-950 underline font-bold uppercase tracking-widest text-xs"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-zinc-300">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-zinc-950 text-sm leading-tight">{item.name}</h3>
                      <div className="flex items-center gap-1 mt-2 bg-zinc-100 rounded-full w-fit px-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-200 rounded-full transition-colors font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-black min-w-[16px] text-center font-sans">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-200 rounded-full transition-colors font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-black text-zinc-950 text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-100 bg-zinc-50">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-zinc-500 uppercase tracking-widest text-xs">Subtotal</span>
              <span className="font-black text-zinc-950 text-xl">₹{totalPrice.toFixed(2)}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-zinc-950 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-black transition-transform active:scale-95"
            >
              Checkout <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
}
