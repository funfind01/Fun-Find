"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function ProfilePage() {
  const { user, loading: authLoading, showToast } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form State
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "");
      setMobile(user.user_metadata?.mobile || "");

      // Fetch user's orders
      const fetchOrders = async () => {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (!error && data) {
          setOrders(data);
        }
        setLoadingOrders(false);
      };
      
      fetchOrders();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const { error } = await supabase.auth.updateUser({
      data: { name, mobile }
    });

    if (error) {
      showToast("Failed to update profile");
    } else {
      showToast("Profile updated successfully");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-zinc-50 flex items-center justify-center text-sm font-bold text-zinc-400">Loading profile...</div>;
  }

  return (
    <main className="min-h-screen bg-[#f9f9fa] text-zinc-950 pb-20">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="flex justify-between items-center h-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
          <Link href="/"><Logo className="text-[24px]" /></Link>
          <div className="flex items-center gap-6">
            <Link href="/collection" className="text-sm font-bold tracking-tight text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block">Shop</Link>
            <button onClick={handleSignOut} className="text-sm font-bold tracking-tight text-red-500 hover:text-red-600 transition-colors">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-32 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Profile Sidebar */}
        <div className="md:col-span-4 space-y-8">
          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
            <div className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center text-2xl font-black mb-4">
              {name ? name.substring(0, 1).toUpperCase() : user.email?.substring(0, 1).toUpperCase()}
            </div>
            <h1 className="text-2xl font-black tracking-tight">{name || "Collector"}</h1>
            <p className="text-sm text-zinc-500 font-medium">{user.email}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Profile Details</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-50 border-b-2 border-zinc-200 focus:border-zinc-950 outline-none p-2.5 text-sm transition-colors" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Mobile Number</label>
                <input value={mobile} onChange={e => setMobile(e.target.value)} className="w-full bg-zinc-50 border-b-2 border-zinc-200 focus:border-zinc-950 outline-none p-2.5 text-sm transition-colors" placeholder="+91 0000000000" />
              </div>
              <button type="submit" className="w-full bg-zinc-950 text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-black transition-colors mt-2">
                Save Changes
              </button>
            </form>
          </div>
        </div>

        {/* Order History */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight">Order History</h2>
              <span className="material-symbols-outlined text-zinc-300 text-3xl">shopping_bag</span>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center text-sm font-bold text-zinc-400">Fetching orders...</div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                <span className="material-symbols-outlined text-4xl text-zinc-300 mb-3 block">inventory_2</span>
                <p className="text-sm font-bold text-zinc-500 mb-4">No orders placed yet.</p>
                <Link href="/collection" className="bg-white border border-zinc-200 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">
                  Start Collecting
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-300 transition-colors">
                    <div className="bg-zinc-50 px-5 py-3 border-b border-zinc-200 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Order ID</span>
                        <span className="text-xs font-bold font-mono">#{order.id.split('-')[0].toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Date</span>
                        <span className="text-xs font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="p-5 flex justify-between items-center">
                      <div>
                        <p className="text-lg font-black mb-1">₹{Number(order.total).toFixed(2)}</p>
                        <p className="text-xs font-bold text-zinc-500">{order.items.length} Item{order.items.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.fulfillment_status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.fulfillment_status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                          'bg-zinc-100 text-zinc-800'
                        }`}>
                          {order.fulfillment_status}
                        </span>
                        {order.shiprocket_awb && (
                          <p className="text-[10px] font-bold text-zinc-500 mt-2">AWB: {order.shiprocket_awb}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
