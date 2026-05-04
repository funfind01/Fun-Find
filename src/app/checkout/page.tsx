"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const GST_RATE = 0.18; // 18% GST

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [placed, setPlaced] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", address: "", city: "", pin: "",
    cardNumber: "", expiry: "", cvv: "", payMethod: "card",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoadingUser(false);
    });
  }, []);

  const gst = totalPrice * GST_RATE;
  const discount = promoApplied ? totalPrice * 0.1 : 0;
  const total = totalPrice + gst - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "FUNFIND10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code.");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <main className="min-h-screen bg-[#f9f9fa] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#CCFF00] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-zinc-950">check</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 mb-3">Order Confirmed!</h1>
          <p className="text-zinc-500 mb-8">Thanks {user?.user_metadata?.name ?? ""}! Your order is being processed. You'll receive a confirmation shortly.</p>
          <Link href="/collection" className="inline-block bg-zinc-950 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-colors">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f9fa] text-[#1a1c1d]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="flex justify-between items-center h-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tighter uppercase text-zinc-900">Fun Find</Link>
          <div className="hidden md:flex items-center gap-8 font-medium tracking-tight">
            {["Keychains", "Frames", "Fidgets", "Drops"].map((c) => (
              <Link key={c} href="/collection" className="text-zinc-500 hover:text-zinc-900 transition-colors">{c}</Link>
            ))}
          </div>
          <div className="flex items-center gap-5 text-zinc-900">
            <Link href="/collection" className="material-symbols-outlined hover:text-zinc-500 transition-colors">arrow_back</Link>
            {user ? (
              <span className="text-sm font-bold text-zinc-600">{user.user_metadata?.name ?? user.email}</span>
            ) : (
              <Link href="/auth" className="material-symbols-outlined hover:text-zinc-500 transition-colors">person</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── Left: Checkout Form ── */}
          <div className="lg:col-span-7 space-y-10">
            <header>
              <h1 className="text-[48px] font-extrabold tracking-tight leading-tight text-zinc-950 mb-2">Checkout</h1>
              <p className="text-zinc-500 text-base">Secure transactional portal. Follow the Fun Find flow.</p>
            </header>

            {/* Login gate banner */}
            {!loadingUser && !user && (
              <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-600">info</span>
                  <p className="text-sm font-bold text-amber-800">Sign in to confirm your order.</p>
                </div>
                <Link href="/auth" className="bg-zinc-950 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-black transition-colors whitespace-nowrap">
                  Sign In
                </Link>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-10">
              {/* Shipping */}
              <section className="space-y-6">
                <div className="flex items-center gap-4 border-b border-zinc-200 pb-4">
                  <span className="bg-zinc-950 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">01</span>
                  <h2 className="text-2xl font-bold">Shipping Details</h2>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">First Name</label>
                    <input required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-200 focus:border-zinc-950 outline-none p-3 text-sm transition-colors"
                      placeholder="Alex" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Last Name</label>
                    <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-200 focus:border-zinc-950 outline-none p-3 text-sm transition-colors"
                      placeholder="Reese" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Shipping Address</label>
                    <input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-200 focus:border-zinc-950 outline-none p-3 text-sm transition-colors"
                      placeholder="123 Main Street, Apartment 4B" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">City</label>
                    <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-200 focus:border-zinc-950 outline-none p-3 text-sm transition-colors"
                      placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">PIN Code</label>
                    <input required value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value }))}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-200 focus:border-zinc-950 outline-none p-3 text-sm transition-colors"
                      placeholder="400001" maxLength={6} />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="space-y-6">
                <div className="flex items-center gap-4 border-b border-zinc-200 pb-4">
                  <span className="bg-zinc-100 text-zinc-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">02</span>
                  <h2 className="text-2xl font-bold">Payment Method</h2>
                </div>

                {/* Card option */}
                <div
                  onClick={() => setForm(f => ({ ...f, payMethod: "card" }))}
                  className={`p-4 border-2 flex items-center justify-between cursor-pointer transition-colors rounded-lg ${form.payMethod === "card" ? "border-zinc-950 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full border-4 ${form.payMethod === "card" ? "border-zinc-950" : "border-zinc-300"}`} />
                    <div>
                      <p className="text-sm font-black">Credit / Debit Card</p>
                      <p className="text-xs text-zinc-400">Encrypted secure transaction</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-zinc-400">credit_card</span>
                </div>

                {form.payMethod === "card" && (
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Card Number</label>
                      <div className="relative">
                        <input required value={form.cardNumber} onChange={e => setForm(f => ({ ...f, cardNumber: e.target.value }))}
                          className="w-full bg-zinc-50 border-b-2 border-zinc-200 focus:border-zinc-950 outline-none p-3 text-sm pr-10 transition-colors"
                          placeholder="0000 0000 0000 0000" maxLength={19} />
                        <span className="material-symbols-outlined absolute right-3 top-3 text-zinc-300 text-lg">lock</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Expiry Date</label>
                      <input required value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                        className="w-full bg-zinc-50 border-b-2 border-zinc-200 focus:border-zinc-950 outline-none p-3 text-sm transition-colors"
                        placeholder="MM / YY" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">CVV</label>
                      <input required value={form.cvv} onChange={e => setForm(f => ({ ...f, cvv: e.target.value }))}
                        className="w-full bg-zinc-50 border-b-2 border-zinc-200 focus:border-zinc-950 outline-none p-3 text-sm transition-colors"
                        placeholder="123" maxLength={4} />
                    </div>
                  </div>
                )}

                {/* UPI/Wallet option */}
                <div
                  onClick={() => setForm(f => ({ ...f, payMethod: "wallet" }))}
                  className={`p-4 border-2 flex items-center gap-4 cursor-pointer transition-colors rounded-lg ${form.payMethod === "wallet" ? "border-zinc-950 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}
                >
                  <div className={`w-4 h-4 rounded-full border-4 ${form.payMethod === "wallet" ? "border-zinc-950" : "border-zinc-300"}`} />
                  <span className="text-sm font-black">UPI / Digital Wallet</span>
                </div>
              </section>

              {/* Security badges */}
              <div className="flex flex-wrap gap-6 items-center pt-6 border-t border-zinc-200 opacity-60">
                {[["shield_with_heart", "PCI Compliant"], ["verified_user", "Verified Secure"], ["package", "Tracked Shipping"]].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-zinc-600 text-lg">{icon}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Place Order CTA — only active when logged in */}
              <button
                type="submit"
                disabled={!user || cart.length === 0}
                className="w-full bg-zinc-950 text-white py-5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {!user ? "Sign In to Confirm" : cart.length === 0 ? "Cart is Empty" : "Confirm Purchase"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              {user && (
                <p className="text-center text-xs text-zinc-400 -mt-4">
                  By placing your order, you agree to our{" "}
                  <a href="#" className="underline text-zinc-600">Terms of Service</a>.
                </p>
              )}
            </form>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-black mb-6">Order Summary</h3>

                {cart.length === 0 ? (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-zinc-200 mb-3 block">shopping_cart</span>
                    <p className="text-sm text-zinc-400 font-medium">Your cart is empty.</p>
                    <Link href="/collection" className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-zinc-950 underline">Browse Products</Link>
                  </div>
                ) : (
                  <>
                    {/* Cart items */}
                    <div className="space-y-5 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-20 h-20 bg-zinc-100 overflow-hidden rounded-xl border border-zinc-200 flex-shrink-0">
                            {item.image
                              ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-zinc-300">image</span></div>
                            }
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h4 className="text-sm font-black">{item.name}</h4>
                              <div className="flex items-center gap-1 mt-1 bg-zinc-100 border border-zinc-200 rounded-full w-fit px-1">
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
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-black">₹{(item.price * item.quantity).toFixed(2)}</p>
                              <button onClick={() => removeFromCart(item.id)} className="text-zinc-300 hover:text-red-400 transition-colors">
                                <span className="material-symbols-outlined text-base">close</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price breakdown */}
                    <div className="border-t border-zinc-100 pt-5 space-y-3">
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>Subtotal</span><span className="font-medium text-zinc-900">₹{totalPrice.toFixed(2)}</span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-sm text-zinc-500">
                          <span>Discount (10%)</span><span className="font-bold text-green-600">−₹{discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>Express Shipping</span><span className="font-bold text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>GST (18%)</span><span className="font-medium text-zinc-900">₹{gst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-zinc-200">
                        <span className="text-xl font-black">Total</span>
                        <span className="text-xl font-black">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Promo code */}
              <div className="bg-[#CCFF00] rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-zinc-950">sell</span>
                  <span className="text-sm font-black uppercase tracking-widest text-zinc-950">Promo Code</span>
                </div>
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError(""); }}
                    className="flex-1 bg-white rounded-lg border-0 p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-950"
                    placeholder="e.g. FUNFIND10"
                  />
                  <button type="button" onClick={handleApplyPromo}
                    className="bg-zinc-950 text-white px-5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-black transition-colors">
                    Apply
                  </button>
                </div>
                {promoApplied && <p className="text-xs font-bold text-green-800">✓ 10% discount applied!</p>}
                {promoError && <p className="text-xs font-bold text-red-700">{promoError}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-50 mt-16 py-10 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xl font-black tracking-tighter uppercase text-zinc-950">Fun Find</span>
          <div className="flex gap-8">
            {["Returns", "Contact", "Privacy"].map(l => (
              <a key={l} href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">{l}</a>
            ))}
          </div>
          <span className="text-xs text-zinc-400">© 2024 Fun Find. All Rights Reserved.</span>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-white border-t border-zinc-100 shadow-lg rounded-t-2xl z-50 text-[10px] font-bold uppercase tracking-widest text-zinc-950">
        {[["storefront", "Shop", "/collection"], ["search", "Search", "/collection"], ["shopping_cart", "Cart", "/checkout"], ["person", "Account", "/auth"]].map(([icon, label, href]) => (
          <Link key={label} href={href} className={`flex flex-col items-center gap-0.5 ${href === "/checkout" ? "text-zinc-950 scale-110" : "text-zinc-400 hover:text-zinc-900"} transition-all active:scale-90`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
