"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

function ProfileDetailsForm({
  profile,
  email,
  onProfileChange,
  onSave,
  saving,
}: {
  profile: { name: string; mobile: string };
  email: string;
  onProfileChange: (field: "name" | "mobile", value: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}) {
  return (
    <div className="bg-black rounded-[32px] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.14)] text-white border border-white/10">
      <div className="mb-8 space-y-3">
        <h2 className="text-[28px] font-black tracking-[-0.04em]">Account Details</h2>
        <p className="text-sm text-zinc-400 leading-6 max-w-xl">
          Manage your digital boutique experience, track recent acquisitions, and update your delivery preferences.
        </p>
      </div>

      <form onSubmit={async (e) => { e.preventDefault(); await onSave(); }} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.32em] text-zinc-500">Full Name</label>
          <input
            value={profile.name}
            onChange={(e) => onProfileChange("name", e.target.value)}
            className="w-full bg-white/5 border-b border-white/10 rounded-none px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#29fe57] focus:ring-2 focus:ring-[#29fe57]/20 transition"
            placeholder="Your Name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.32em] text-zinc-500">Mobile Number</label>
          <input
            value={profile.mobile}
            onChange={(e) => onProfileChange("mobile", e.target.value)}
            className="w-full bg-white/5 border-b border-white/10 rounded-none px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#29fe57] focus:ring-2 focus:ring-[#29fe57]/20 transition"
            placeholder="+91 0000000000"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.32em] text-zinc-500">Email Address</label>
          <div className="w-full bg-white/5 border-b border-white/10 px-4 py-3 text-sm text-zinc-200">
            {email}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#29fe57] text-black py-4 rounded-2xl font-black uppercase tracking-[0.18em] hover:bg-[#20d14b] transition disabled:opacity-60"
        >
          {saving ? "Updating…" : "Update Information"}
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading: authLoading, showToast } = useAuth();
  const router = useRouter();
  type OrderRow = {
    id: string;
    created_at: string;
    total: number | string;
    fulfillment_status: string | null;
    items: unknown[];
    shiprocket_awb?: string | null;
  };

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileData, setProfileData] = useState({ name: "", mobile: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: String(user.user_metadata?.name ?? ""),
        mobile: String(user.user_metadata?.mobile ?? ""),
      });

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleProfileChange = (field: "name" | "mobile", value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          mobile: profileData.mobile,
        },
      });

      if (error) {
        showToast("Failed to update profile");
        return;
      }

      showToast("Profile updated successfully");
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-zinc-50 flex items-center justify-center text-sm font-bold text-zinc-400">Loading profile...</div>;
  }

  return (
    <main className="min-h-screen bg-[#f9f9fa] text-zinc-950 pb-20">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="flex justify-between items-center h-20 px-6 max-w-5xl mx-auto">
          <Link href="/"><Logo className="text-[24px]" /></Link>
          <div className="flex items-center gap-6">
            <Link href="/collection" className="text-sm font-bold tracking-tight text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block">Shop</Link>
            <Link href="/checkout" className="relative flex items-center gap-1.5 text-sm font-bold tracking-tight text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block">
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              Cart
            </Link>
            <button onClick={handleSignOut} className="text-sm font-bold tracking-tight text-red-500 hover:text-red-600 transition-colors">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-32">
        <div className="mb-14">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">My Profile</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] text-zinc-950">My Profile</h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-500 leading-7">
            Manage your digital boutique experience, track recent acquisitions, and update your delivery preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Profile Sidebar */}
        <div className="md:col-span-4 space-y-8">
          <ProfileDetailsForm
            profile={profileData}
            email={user.email || ""}
            onProfileChange={handleProfileChange}
            onSave={handleSaveProfile}
            saving={savingProfile}
          />

          {/* Shipping address section removed as requested */}
        </div>

        {/* Order History */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)] border border-zinc-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Order History</h2>
                <p className="text-sm text-zinc-500">Track your latest purchases and shipment status.</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-400">{orders.length} items total</p>
              </div>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center text-sm font-bold text-zinc-400">Fetching orders...</div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                <span className="material-symbols-outlined text-4xl text-zinc-300 mb-3 block">inventory_2</span>
                <p className="text-sm font-bold text-zinc-500 mb-4">No orders placed yet.</p>
                <Link href="/collection" className="bg-white border border-zinc-200 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">
                  Start Collecting
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const item = (order.items as any[])[0] || {};
                  const itemName = item.name || `Order #${order.id.split("-")[0].toUpperCase()}`;
                  const itemImage = item.image || "";
                  const status = order.fulfillment_status || "Unknown";
                  return (
                    <div key={order.id} className="rounded-[32px] border border-zinc-200 p-5 hover:border-zinc-300 transition-colors bg-white">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-4 items-center">
                          <div className="w-24 h-24 rounded-[26px] bg-zinc-100 overflow-hidden flex items-center justify-center">
                            {itemImage ? (
                              <img src={itemImage} alt={itemName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-zinc-300 text-3xl">shopping_bag</span>
                            )}
                          </div>
                          <div>
                            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em]">
                              {status.toLowerCase() === "processing" ? "In Transit" : status}
                            </span>
                            <h3 className="mt-4 text-xl font-black tracking-tight text-zinc-950">{itemName}</h3>
                            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-zinc-400">#{order.id.split("-")[0].toUpperCase()}</p>
                            <p className="mt-2 text-sm text-zinc-500">Ordered {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-4 text-right md:items-end">
                          <p className="text-2xl font-black text-zinc-950">₹{typeof order.total === 'number' ? order.total.toFixed(2) : parseFloat(String(order.total) || '0').toFixed(2)}</p>
                          <Link href="/checkout" className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700 hover:text-emerald-900 transition">Track Order</Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)] border border-dashed border-zinc-200">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-zinc-950 text-white">
                <span className="material-symbols-outlined text-xl">sparkles</span>
              </div>
              <div>
                <p className="text-xl font-black text-zinc-950">Curated for you</p>
                <p className="mt-3 text-sm text-zinc-500 max-w-xl">Based on your history, we think you'll love the new Digital Nomad Collection.</p>
                <Link href="/collection" className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-900 px-5 py-3 text-sm font-black uppercase tracking-[0.28em] text-zinc-900 hover:bg-zinc-100 transition">
                  Explore Drops <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}
