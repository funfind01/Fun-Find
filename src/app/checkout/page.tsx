"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Script from "next/script";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const GST_RATE = 0.18; // 18% GST

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user, showToast } = useAuth();
  
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  // Shipping Address State
  const [address, setAddress] = useState({
    name: user?.user_metadata?.name || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const gst = totalPrice * GST_RATE;
  const discount = promoApplied ? totalPrice * 0.1 : 0;
  const total = totalPrice + gst - discount;

  // SDK readiness will be set when the script loads

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "FUNFIND10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code.");
    }
  };

  const handleRazorpayCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!address.addressLine1 || !address.city || !address.pincode || !address.phone) {
      showToast("Please fill in all required shipping details.");
      return;
    }

    setIsProcessing(true);
    try {
      showToast("Initiating checkout...");
      
      // Create order from backend
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total })
      });
      const order = await res.json();
      
      if (!order || !order.id) {
        showToast("Failed to initialize checkout");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Fun Find",
        description: "Purchase Transaction",
        order_id: order.id,
        handler: async function (response: any) {
          setIsProcessing(true);
          showToast("Verifying payment...");
          
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart,
                user,
                totals: { totalPrice, gst, discount, total },
                shippingAddress: address
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              showToast("Order placed successfully!");
              clearCart();
              window.location.href = "/checkout/success";
            } else {
              showToast("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            showToast("Something went wrong during verification.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: address.name || user?.user_metadata?.name || "Customer",
          email: user?.email || "",
          contact: address.phone
        },
        theme: {
          color: "#09090b"
        }
      };

      // @ts-ignore
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response: any){
        showToast(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();
      
    } catch (err) {
      console.error("Checkout error:", err);
      showToast("Something went wrong with checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f9fa] text-[#1a1c1d]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" onLoad={() => setSdkReady(true)} />
      
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
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <span className="text-sm font-bold text-zinc-600">{user.user_metadata?.name?.split(" ")[0] ?? "Profile"}</span>
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
            ) : (
              <Link href="/auth" className="material-symbols-outlined hover:text-zinc-500 transition-colors">person</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <header className="mb-10 text-center">
          <h1 className="text-[48px] font-extrabold tracking-tight leading-tight text-zinc-950 mb-2">Your Cart</h1>
          <p className="text-zinc-500 text-base">Review your items and proceed with our 1-click fast checkout.</p>
        </header>

        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
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

                {/* Promo code */}
                <div className="bg-[#CCFF00] rounded-2xl p-6 mt-6 space-y-3">
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

                {/* Shipping Form */}
                <div className="border-t border-zinc-100 pt-8 mt-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-950 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">local_shipping</span>
                    Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Full Name</label>
                      <input 
                        value={address.name}
                        onChange={e => setAddress({...address, name: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Phone Number</label>
                      <input 
                        value={address.phone}
                        onChange={e => setAddress({...address, phone: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all"
                        placeholder="+91 99999 99999"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Pincode</label>
                      <input 
                        value={address.pincode}
                        onChange={e => setAddress({...address, pincode: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all"
                        placeholder="110001"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Address Line 1</label>
                      <input 
                        value={address.addressLine1}
                        onChange={e => setAddress({...address, addressLine1: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all"
                        placeholder="House No., Building, Street"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Address Line 2 (Optional)</label>
                      <input 
                        value={address.addressLine2}
                        onChange={e => setAddress({...address, addressLine2: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all"
                        placeholder="Landmark, Area"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">City</label>
                      <input 
                        value={address.city}
                        onChange={e => setAddress({...address, city: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all"
                        placeholder="New Delhi"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">State</label>
                      <input 
                        value={address.state}
                        onChange={e => setAddress({...address, state: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all"
                        placeholder="Delhi"
                      />
                    </div>
                  </div>
                </div>

                {/* Security badges */}
                <div className="flex justify-center gap-6 items-center pt-8 opacity-60">
                  {[["shield_with_heart", "PCI Compliant"], ["verified_user", "Verified Secure"], ["package", "Tracked Shipping"]].map(([icon, label]) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-zinc-600 text-lg">{icon}</span>
                      <span className="text-xs font-medium">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Fast Checkout CTA */}
                <div className="pt-8">
                  <button
                    onClick={handleRazorpayCheckout}
                    type="button"
                    disabled={isProcessing || !sdkReady}
                    className="w-full bg-zinc-950 text-[#CCFF00] py-5 rounded-xl font-black text-lg uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isProcessing ? "Processing..." : sdkReady ? "Pay with Razorpay" : "Loading Checkout..."}
                    <span className="material-symbols-outlined">{isProcessing ? "sync" : "lock"}</span>
                  </button>
                  <p className="text-center text-xs text-zinc-400 mt-4">
                    Secure payments powered by Razorpay.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-50 mt-16 py-10 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xl font-black tracking-tighter uppercase text-zinc-950">Fun Find</span>
          <div className="flex gap-8">
            <Link href="/legal/returns" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Returns</Link>
            <Link href="/contact" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Contact</Link>
            <Link href="/legal/privacy" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Terms</Link>
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
