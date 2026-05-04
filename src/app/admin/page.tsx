"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/supabase";

type ProductForm = {
  id?: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  image_url: string;
  images: string[];
  description: string;
  material: string;
  finish: string;
  badge: string;
};

type AdminProductsResponse = {
  products?: Product[];
  error?: string;
  message?: string;
  setupRequired?: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  category: "Keychains",
  price: "",
  stock: "",
  image_url: "",
  images: [],
  description: "",
  material: "",
  finish: "",
  badge: "",
};

const demoProducts: Product[] = [
  {
    id: "demo-1",
    name: "Vector-01 Titanium",
    price: 185,
    description: "A high-end matte black kinetic piece engineered from aerospace-grade titanium.",
    category: "Keychains",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB41GYsTE-GuylqlU7LH0VJPzArHrFbfWzV89bbqIWjAi_r4v1UhJHkgw5AXLUZve7KQH-C9gnYjLBupTeYg91-hCKk42YtF88P3Ivx8QbM_uTAS9AFvcaOSEIaEqbjFcayc8iC7AwkGrnfguXtqDALERiZF9DsqY-DPftFowgm_gWgh4mVNIHmu36o3Iv7l4xuNJKqf21myGOVujiPF75ukZNOCGw6PJVTTS4_ogWmyMZrdSAY7iHu1TjVQV7iyLCw3jj3hVb4Vk77",
    metadata: { material: "Grade 5 Titanium", finish: "Matte black", badge: "Limited Drop" },
    stock: 10,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "demo-2",
    name: "Apex Fun Find Frame",
    price: 320,
    description: "Intricately engineered mechanical frame with precision gear geometry.",
    category: "Frames",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANKN2fKcQIYjH7baNTqJadG0D717lZ5XHwpRvne6BeDMP9GzAEIxnyi4zY8pw5gclrQ8TgjfbsV9MOobiJEQqOMNzyNqx9I4PTMwdF05ve4d9r4ynXPeOokh5nKTpDh3j6FFWh3rzEUfDdEQVKcZ3DsLMSAeIwwMTgoHQnso-kggeS22CuKBV0rjoR2fq-krdou5LzWkwFaCgZVeS_7nYJxEFPFbjrl49ckmi8uBJjI2RXQOsYL_SwPPatfG__Yp-R32u1uBVPnNEM",
    metadata: { material: "Brushed aluminum", finish: "Gallery polish", badge: "New Asset" },
    stock: 8,
    created_at: "2026-01-02T00:00:00.000Z",
  },
];

const navItems = [
  { icon: "dashboard", label: "Dashboard", key: "dashboard" },
  { icon: "package_2", label: "Orders", key: "orders" },
  { icon: "inventory_2", label: "Inventory", key: "products" },
  { icon: "local_shipping", label: "Shiprocket", key: "shiprocket" },
] as const;

type NavKey = (typeof navItems)[number]["key"];

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeView, setActiveView] = useState<NavKey>("dashboard");
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [setupRequired, setSetupRequired] = useState(false);

  const metrics = useMemo(() => {
    // Using mock sales revenue based on recent orders (₹320.00 + ₹1,240.50 + ₹89.00)
    const revenue = 1649.50;
    const activeStock = products.reduce((sum, product) => sum + product.stock, 0);
    const lowStock = products.filter((product) => product.stock <= 10).length;

    return { revenue, activeStock, lowStock };
  }, [products]);

  const loadProducts = async () => {
    setError("");

    try {
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const data = (await response.json()) as AdminProductsResponse;

      if (response.status === 401) {
        setAuthenticated(false);
        throw new Error("Admin session expired. Re-enter the authorization key.");
      }

      if (data.setupRequired) {
        setProducts(demoProducts);
        setSetupRequired(true);
        setMessage(data.message || "Inventory table not initialized. Run supabase/products.sql.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to load inventory");
      }

      setSetupRequired(false);
      setProducts(data.products?.length ? data.products : demoProducts);
    } catch (err) {
      setProducts(demoProducts);
      setError(err instanceof Error ? err.message : "Inventory is running in demo mode.");
    }
  };

  useEffect(() => {
    const frame = requestAnimationFrame(async () => {
      try {
        const response = await fetch("/api/admin/auth/status", { cache: "no-store" });
        const data = (await response.json()) as { authenticated?: boolean };
        setAuthenticated(Boolean(data.authenticated));

        if (data.authenticated) {
          await loadProducts();
        }
      } finally {
        setIsCheckingSession(false);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const updateForm = (key: keyof ProductForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openCreateProduct = () => {
    setForm(emptyForm);
    setMessage("");
    setError("");
    setIsEditorOpen(true);
  };

  const editProduct = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image_url: product.image_url,
      images: Array.isArray(product.metadata?.images) ? (product.metadata.images as string[]) : [],
      description: product.description,
      material: String(product.metadata?.material ?? ""),
      finish: String(product.metadata?.finish ?? ""),
      badge: String(product.metadata?.badge ?? ""),
    });
    setMessage("");
    setError("");
    setIsEditorOpen(true);
  };

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");

    const response = await fetch("/api/admin/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await response.json()) as { success?: boolean; error?: string };

    if (!response.ok || !data.success) {
      setAuthError(data.error || "Access denied");
      setPassword("");
      return;
    }

    setAuthenticated(true);
    setPassword("");
    await loadProducts();
  };

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
    setProducts(demoProducts);
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    const payload = {
      id: form.id,
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url,
      description: form.description,
      metadata: {
        material: form.material,
        finish: form.finish,
        badge: form.badge,
        images: (form.images || []).filter(Boolean),
      },
    };

    try {
      const response = await fetch("/api/admin/products", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { product?: Product; error?: string; setupRequired?: boolean };

      if (response.status === 401) {
        setAuthenticated(false);
        throw new Error("Admin session expired. Re-enter the authorization key.");
      }

      if (data.setupRequired) {
        setSetupRequired(true);
        throw new Error("Inventory table not initialized. Run supabase/products.sql.");
      }

      if (!response.ok || !data.product) {
        throw new Error(data.error || "Unable to save product");
      }

      const savedProduct = data.product;
      setProducts((current) =>
        form.id ? current.map((product) => (product.id === savedProduct.id ? savedProduct : product)) : [savedProduct, ...current],
      );
      setForm(emptyForm);
      setIsEditorOpen(false);
      setSetupRequired(false);
      setMessage(form.id ? "Asset updated successfully." : "New asset indexed successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setError("");
    setMessage("");

    if (!confirm("Remove this asset from inventory?")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await response.json()) as { error?: string; setupRequired?: boolean };

      if (response.status === 401) {
        setAuthenticated(false);
        throw new Error("Admin session expired. Re-enter the authorization key.");
      }

      if (data.setupRequired) {
        setSetupRequired(true);
        throw new Error("Inventory table not initialized. Run supabase/products.sql.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete product");
      }

      setProducts((current) => current.filter((product) => product.id !== id));
      setMessage("Asset removed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete product.");
    }
  };

  if (isCheckingSession) {
    return <div className="min-h-screen bg-zinc-50 flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-zinc-400 text-4xl">progress_activity</span></div>;
  }

  if (!authenticated) {
    return <AdminLogin password={password} setPassword={setPassword} error={authError} onSubmit={login} />;
  }

  const viewLabel: Record<NavKey, string> = {
    dashboard: "Analytics Dashboard",
    orders: "Order Management",
    products: "Inventory Manager",
    shiprocket: "Shiprocket Pro",
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex h-screen w-64 shrink-0 sticky top-0 flex-col border-r border-zinc-200 bg-zinc-50 p-4 space-y-2 z-50">
        <div className="px-2 py-4 mb-4">
          <h1 className="text-xl font-black tracking-tighter italic uppercase text-zinc-950">Fun Find</h1>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ icon, label, key }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveView(key)}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all hover:translate-x-0.5 ${
                activeView === key
                  ? "bg-[#CCFF00] text-zinc-950"
                  : "text-zinc-500 hover:bg-zinc-200 active:bg-zinc-300"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-zinc-200 space-y-3">
          <button
            className="w-full bg-zinc-950 text-white text-xs font-black uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors active:scale-95"
            onClick={openCreateProduct}
            type="button"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Product
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            View Store
          </Link>
          <button
            className="flex w-full items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
            onClick={() => void logout()}
            type="button"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold tracking-tight">{viewLabel[activeView]}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center bg-zinc-100 rounded-full px-4 py-1.5 gap-2 border border-zinc-200">
                <span className="material-symbols-outlined text-zinc-400 text-lg">search</span>
                <input className="bg-transparent border-none outline-none text-sm w-44 placeholder:text-zinc-400" placeholder="Search..." type="text" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Root Admin</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8 space-y-8">
          {activeView === "dashboard" && (
            <DashboardView metrics={metrics} products={products} onReload={() => void loadProducts()} />
          )}
          {activeView === "orders" && <OrdersView />}
          {activeView === "shiprocket" && <ShiprocketView />}
          {activeView === "products" && (
            <ProductsView
              error={error}
              message={message}
              products={products}
              setupRequired={setupRequired}
              onCreate={openCreateProduct}
              onDelete={deleteProduct}
              onEdit={editProduct}
              onReload={() => void loadProducts()}
            />
          )}

        </div>

        <footer className="py-6 px-8 border-t border-zinc-100">
          <div className="flex flex-col md:flex-row justify-between items-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest gap-3">
            <p>© 2024 Fun Find. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-zinc-900 transition-colors">Storefront</Link>
              <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-white border-t border-zinc-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50">
        {navItems.slice(0, 4).map(({ icon, label, key }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveView(key)}
            className={`flex flex-col items-center gap-0.5 transition-all active:scale-90 ${
              activeView === key ? "text-zinc-950" : "text-zinc-400"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">{icon}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
          </button>
        ))}
      </nav>

      {isEditorOpen && (
        <ProductEditor
          form={form}
          isSaving={isSaving}
          onChange={updateForm}
          onClose={() => setIsEditorOpen(false)}
          onSubmit={saveProduct}
        />
      )}
    </div>
  );
}

function AdminLogin({
  password,
  setPassword,
  error,
  onSubmit,
}: {
  password: string;
  setPassword: (value: string) => void;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <section className="w-full max-w-sm bg-white rounded-2xl border border-zinc-200 shadow-[0_24px_60px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="h-1.5 w-full bg-[#CCFF00]" />
        <div className="p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200">
              <span className="material-symbols-outlined text-3xl text-zinc-700">shield_lock</span>
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-zinc-950">Fun Find</h1>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Secure Gateway &middot; Admin Panel</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Authorization Key
              <div className="relative mt-2">
                <input
                  autoFocus
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm outline-none transition-all focus:border-zinc-950 focus:bg-white pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={show ? "text" : "password"}
                  value={password}
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                  <span className="material-symbols-outlined text-base">{show ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </label>

            {error && <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest text-red-600">{error}</p>}

            <button
              className="w-full bg-zinc-950 hover:bg-black text-white py-4 rounded-lg text-xs font-black uppercase tracking-[0.3em] transition-colors active:scale-95"
              type="submit"
            >
              Initiate Access
            </button>
          </form>

          <p className="mt-8 text-center text-[9px] font-bold uppercase tracking-widest text-zinc-300">Authorized Personnel Only &mdash; Fun Find</p>
        </div>
      </section>
    </main>
  );
}

const BAR_HEIGHTS = [40, 65, 45, 90, 75, 55, 85];
const BAR_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DashboardView({ metrics, products, onReload }: { metrics: { revenue: number; activeStock: number; lowStock: number }; products: Product[]; onReload: () => void }) {
  const lowStockItems = products.filter((p) => p.stock <= 10 && p.stock > 0);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <section className="space-y-8">
      {/* Bento metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-xl flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Total Revenue</span>
            <span className="material-symbols-outlined text-emerald-500 text-xl">trending_up</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight">₹{metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-emerald-600 font-bold mt-1">Sales Revenue</p>
          </div>
        </div>
        <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-xl flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Products</span>
            <span className="material-symbols-outlined text-zinc-400 text-xl">inventory_2</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight">{products.length}</p>
            <p className="text-xs text-zinc-400 font-bold mt-1">{metrics.activeStock} total units</p>
          </div>
        </div>
        <div className="bg-[#CCFF00]/20 border border-[#CCFF00]/40 p-6 rounded-xl flex flex-col justify-between hover:shadow-lg transition-shadow md:col-span-2 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Stock Alerts</span>
            <p className="text-3xl font-black tracking-tight mt-4">{metrics.lowStock} Items</p>
            <p className="text-sm text-zinc-600 mt-1">{outOfStock.length} out of stock &middot; {lowStockItems.length} low stock</p>
          </div>
          <div className="absolute right-[-16px] bottom-[-16px] opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px]">warning</span>
          </div>
        </div>
      </div>

      {/* Chart + Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black tracking-tight">Sales Performance</h3>
              <p className="text-xs text-zinc-400 font-bold mt-0.5">Weekly revenue breakdown</p>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors" onClick={onReload} type="button">↻ Reload</button>
          </div>
          <div className="flex items-end justify-between gap-2 h-48">
            {BAR_HEIGHTS.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer ${
                    i === 4 ? "bg-zinc-950" : "bg-zinc-100 hover:bg-[#CCFF00]"
                  }`}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            {BAR_DAYS.map((d) => <span key={d} className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{d}</span>)}
          </div>
        </div>

        <div className="bg-zinc-950 text-white rounded-xl p-8 flex flex-col">
          <h3 className="text-lg font-black mb-6">Inventory Status</h3>
          <div className="space-y-5 flex-1">
            {products.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      : <span className="material-symbols-outlined text-zinc-600">image</span>}
                  </div>
                  <div>
                    <p className="text-sm font-black">{p.name}</p>
                    <p className="text-[10px] text-zinc-400">{p.stock} units left</p>
                  </div>
                </div>
                {p.stock === 0
                  ? <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Out of Stock</span>
                  : p.stock <= 10
                  ? <span className="bg-emerald-500 text-black px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Low Stock</span>
                  : <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">In Stock</span>}
              </div>
            ))}
          </div>
          <button className="mt-6 w-full border border-zinc-700 hover:bg-zinc-800 text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-colors">
            View Full Inventory
          </button>
        </div>
      </div>

      {/* Recent orders mini table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-lg font-black tracking-tight">Recent Orders</h3>
          <button className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {["Order ID", "Customer", "Date", "Status", "Amount", ""].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {[
                { id: "#ORD-9021", name: "Jordan Dixon", initials: "JD", color: "bg-[#CCFF00] text-zinc-950", date: "Oct 24, 2024", status: "Delivered", statusColor: "bg-green-100 text-green-800", amount: "₹320.00" },
                { id: "#ORD-9022", name: "Avery Miller", initials: "AM", color: "bg-zinc-200 text-zinc-950", date: "Oct 24, 2024", status: "Processing", statusColor: "bg-amber-100 text-amber-800", amount: "₹1,240.50" },
                { id: "#ORD-9023", name: "Sam Kim", initials: "SK", color: "bg-zinc-950 text-white", date: "Oct 23, 2024", status: "Shipped", statusColor: "bg-blue-100 text-blue-800", amount: "₹89.00" },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-black">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${row.color} flex items-center justify-center text-[10px] font-black`}>{row.initials}</div>
                      <span className="text-sm">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${row.statusColor}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black">{row.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-zinc-400 hover:text-zinc-950 transition-colors">more_horiz</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ProductsView({
  error,
  message,
  products,
  setupRequired,
  onCreate,
  onDelete,
  onEdit,
  onReload,
}: {
  error: string;
  message: string;
  products: Product[];
  setupRequired: boolean;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  onReload: () => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950">Inventory Manager</h2>
          <p className="text-sm text-zinc-400 font-medium mt-1">{products.length} assets in registry</p>
        </div>
        <button
          className="bg-zinc-950 hover:bg-black text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-lg flex items-center gap-2 transition-colors active:scale-95"
          onClick={onCreate}
          type="button"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Product
        </button>
      </div>

      {/* Alerts */}
      {setupRequired && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-800">
          Inventory table not initialized. Run <code className="font-mono">supabase/products.sql</code>. Demo data shown.
        </div>
      )}
      {message && !setupRequired && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">{message}</div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">{error}</div>}

      {/* Search + Filter Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-base">search</span>
          <input
            className="w-full rounded-lg border border-zinc-200 bg-white py-3 pl-11 pr-5 text-sm outline-none focus:border-zinc-950 placeholder:text-zinc-300"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            value={search}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              type="button"
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-colors ${
                categoryFilter === cat
                  ? "bg-zinc-950 text-white border-zinc-950"
                  : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{filtered.length} assets</span>
          <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors" onClick={onReload} type="button">↻ Reload</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {["Product", "Name & ID", "Price", "Stock", ""].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.length === 0 && (
                <tr><td className="px-6 py-12 text-center text-sm text-zinc-400 italic" colSpan={5}>No products match your search.</td></tr>
              )}
              {filtered.map((product) => (
                <tr className="group hover:bg-zinc-50 transition-colors" key={product.id}>
                  <td className="px-6 py-4">
                    <div className="h-16 w-16 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                      {product.image_url
                        ? <img alt={product.name} className="h-full w-full object-cover" src={product.image_url} />
                        : <div className="h-full w-full flex items-center justify-center"><span className="material-symbols-outlined text-zinc-300">image</span></div>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link className="text-sm font-black hover:underline text-zinc-950" href={`/product/${product.id}`}>{product.name}</Link>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-zinc-500">{product.category}</span>
                      <span className="font-mono text-[9px] text-zinc-300">#{product.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-lg font-black text-zinc-950">₹{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4"><StockBadge stock={product.stock} /></td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="mr-2 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 transition-colors"
                      onClick={() => onEdit(product)} title="Edit" type="button"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      onClick={() => onDelete(product.id)} title="Delete" type="button"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}



const CATEGORIES = ["Keychains", "Frames", "Fidgets", "Drops", "Other"];

function ProductEditor({
  form,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}: {
  form: ProductForm;
  isSaving: boolean;
  onChange: (key: keyof ProductForm, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const isEdit = Boolean(form.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-[0_40px_100px_rgba(0,0,0,0.25)] flex flex-col border border-zinc-200"
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neon accent bar */}
        <div className="h-1 w-full bg-[#CCFF00]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 bg-white px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-zinc-600 text-xl">{isEdit ? "edit" : "add_circle"}</span>
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-zinc-950">{isEdit ? "Update Product" : "New Product"}</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Product Resource Matrix</p>
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors text-lg"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        {/* Body — 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] overflow-y-auto flex-1">
          {/* Left: form fields */}
          <div className="space-y-5 p-8 border-r border-zinc-100">
            <TextField label="Product Title" value={form.name} onChange={(v) => onChange("name", v)} required />

            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Category
              <select
                className="mt-2 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:bg-white cursor-pointer transition-colors"
                onChange={(e) => onChange("category", e.target.value)}
                value={form.category}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <TextField label="Price (₹)" type="number" value={form.price} onChange={(v) => onChange("price", v)} required />
              <TextField label="Stock Units" type="number" value={form.stock} onChange={(v) => onChange("stock", v)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextField label="Material" value={form.material} onChange={(v) => onChange("material", v)} />
              <TextField label="Finish" value={form.finish} onChange={(v) => onChange("finish", v)} />
            </div>

            <TextField label="Badge Label" value={form.badge} onChange={(v) => onChange("badge", v)} />

            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Description
              <textarea
                className="mt-2 min-h-28 w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm normal-case tracking-normal text-zinc-900 outline-none focus:border-zinc-950 focus:bg-white transition-colors"
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Describe the product — materials, use case, what makes it special..."
                value={form.description}
              />
            </label>
          </div>

          {/* Right: image panel */}
          <ImageUploadPanel
            value={form.image_url}
            images={form.images}
            onChange={(url) => onChange("image_url", url)}
            onImagesChange={(imgs) => onChange("images", imgs as any)}
            material={form.material}
            finish={form.finish}
            badge={form.badge}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-5 border-t border-zinc-100 bg-white px-8 py-5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">Authorized Personnel Only — Fun Find</p>
          <div className="flex gap-3">
            <button
              className="px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              onClick={onClose}
              type="button"
            >
              Discard
            </button>
            <button
              className="bg-zinc-950 hover:bg-black px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest text-white disabled:opacity-50 transition-colors flex items-center gap-2 active:scale-95"
              disabled={isSaving}
              type="submit"
            >
              {isSaving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
              {isSaving ? "Saving..." : (isEdit ? "Update Product" : "Add Product")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ImageUploadPanel({
  value,
  images = [],
  onChange,
  onImagesChange,
  material,
  finish,
  badge,
}: {
  value: string;
  images?: string[];
  onChange: (url: string) => void;
  onImagesChange?: (urls: string[]) => void;
  material: string;
  finish: string;
  badge: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const extraInputRef0 = useRef<HTMLInputElement>(null);
  const extraInputRef1 = useRef<HTMLInputElement>(null);
  const extraInputRef2 = useRef<HTMLInputElement>(null);
  const extraInputRefs = [extraInputRef0, extraInputRef1, extraInputRef2];
  
  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
    return data.url;
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleExtraFile = async (file: File | undefined, index: number) => {
    if (!file) return;
    setUploadingExtra(index);
    setUploadError("");
    try {
      const url = await uploadFile(file);
      const newImages = [...images];
      newImages[index] = url;
      onImagesChange?.(newImages);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingExtra(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-zinc-50">
      {/* Upload zone */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Product Image</p>

        {/* Drag-and-drop / click zone */}
        <div
          className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
            isDragging ? "border-[#CCFF00] bg-[#CCFF00]/10" : "border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {value && !uploading ? (
            /* Live preview fills the zone */
            <div className="relative group">
              <img
                src={value}
                alt="Preview"
                className="w-full max-h-52 object-contain rounded-xl"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              {/* Hover overlay to re-upload */}
              <div className="absolute inset-0 rounded-xl bg-zinc-950/0 group-hover:bg-zinc-950/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                  <span className="material-symbols-outlined text-base text-zinc-700">upload</span>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Change</span>
                </div>
              </div>
            </div>
          ) : uploading ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined animate-spin text-3xl text-zinc-400">progress_activity</span>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Uploading...</p>
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-zinc-400">cloud_upload</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-zinc-700">Click to upload or drag & drop</p>
                <p className="text-xs text-zinc-400 mt-1">PNG, JPG, WEBP · max 5 MB</p>
              </div>
              <div className="bg-zinc-950 text-white text-xs font-black uppercase tracking-widest px-5 py-2 rounded-lg">
                Choose File
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {uploadError && (
          <p className="mt-2 text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{uploadError}</p>
        )}
      </div>

      {/* Extra Images */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 mt-2">Side Views (Optional)</p>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-square relative rounded-lg border-2 border-dashed border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer flex flex-col items-center justify-center overflow-hidden"
              onClick={() => extraInputRefs[i].current?.click()}
            >
              <input
                ref={extraInputRefs[i]}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleExtraFile(e.target.files?.[0], i)}
              />
              {images[i] && uploadingExtra !== i ? (
                <img src={images[i]} className="w-full h-full object-cover" alt="side view" />
              ) : uploadingExtra === i ? (
                <span className="material-symbols-outlined animate-spin text-zinc-400">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-zinc-300">add_photo_alternate</span>
              )}
              {images[i] && uploadingExtra !== i && (
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white/80 p-0.5 rounded-full hover:bg-white text-zinc-600 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newImages = [...images];
                    newImages[i] = "";
                    onImagesChange?.(newImages);
                  }}
                >
                  <span className="material-symbols-outlined text-xs block">close</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Manual URL fallback */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
          Or paste URL
        </label>
        <input
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-950 placeholder:text-zinc-300 transition-colors"
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          value={value}
        />
      </div>

      {/* Spec summary */}
      {(material || finish || badge) && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-2">
          {badge && <span className="inline-block bg-zinc-950 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded">{badge}</span>}
          {material && <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Material: <span className="text-zinc-900">{material}</span></p>}
          {finish && <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Finish: <span className="text-zinc-900">{finish}</span></p>}
        </div>
      )}
    </div>
  );
}

function OrdersView() {

  const orders = [
    { id: "#ORD-9021", name: "Jordan Dixon", initials: "JD", color: "bg-[#CCFF00] text-zinc-950", date: "Oct 24, 2024", value: "₹320.00", status: "Delivered", statusColor: "bg-green-100 text-green-800" },
    { id: "#ORD-9022", name: "Avery Miller", initials: "AM", color: "bg-zinc-200 text-zinc-950", date: "Oct 24, 2024", value: "₹1,240.50", status: "Processing", statusColor: "bg-amber-100 text-amber-800" },
    { id: "#ORD-9023", name: "Sam Kim", initials: "SK", color: "bg-zinc-950 text-white", date: "Oct 23, 2024", value: "₹89.00", status: "Confirmed", statusColor: "bg-blue-100 text-blue-800" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950">Order Management</h2>
          <p className="text-sm text-zinc-400 font-medium mt-1">Customer acquisition records and fulfilment status.</p>
        </div>
        <button className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline">Export CSV</button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Orders", value: "0", icon: "package_2", color: "text-zinc-400" },
          { label: "Revenue", value: "₹1,649.50", icon: "payments", color: "text-emerald-500" },
          { label: "Pending", value: "1", icon: "schedule", color: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-50 border border-zinc-100 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{s.label}</span>
              <span className={`material-symbols-outlined text-xl ${s.color}`}>{s.icon}</span>
            </div>
            <p className="text-2xl font-black mt-3">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Recent Orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100">
                {["Order ID", "Customer", "Date", "Status", "Amount", ""].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-black">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${row.color} flex items-center justify-center text-[10px] font-black`}>{row.initials}</div>
                      <span className="text-sm font-medium">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${row.statusColor}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black">{row.value}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-zinc-400 hover:text-zinc-950 transition-colors">more_horiz</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}



function ShiprocketView() {
  const stats = [
    { label: "Account Balance", value: "₹0.00", status: "neutral" },
    { label: "API Status", value: "Disconnected", status: "error" },
    { label: "Active Node", value: "North-Sector-GGN", status: "neutral" },
    { label: "Carrier Link", value: "Pending", status: "warning" },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Shiprocket Pro</h2>
        <p className="text-sm text-zinc-400 font-medium mt-1">Advanced logistics API management surface.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-zinc-50 border border-zinc-100 rounded-xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{s.label}</p>
            <p className={`mt-3 text-lg font-black ${
              s.status === "error" ? "text-red-500" :
              s.status === "warning" ? "text-amber-500" : "text-zinc-950"
            }`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-500">local_shipping</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-950">Shiprocket Engine v2.0</h3>
              <p className="text-xs text-zinc-400">Automated fulfilment orchestration</p>
            </div>
          </div>
          <p className="text-zinc-600 text-sm leading-relaxed max-w-lg">
            Connect your Shiprocket account to enable automated order fulfilment, national carrier routing, and real-time tracking across all districts.
          </p>
          <div className="mt-8 flex gap-3">
            <button className="bg-zinc-950 hover:bg-black text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-lg transition-colors">
              Connect Account
            </button>
            <button className="border border-zinc-200 text-zinc-600 text-xs font-black uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-zinc-50 transition-colors">
              View Docs
            </button>
          </div>
        </div>

        <div className="bg-zinc-950 text-white rounded-xl p-8">
          <h3 className="text-base font-black mb-6">Connection Status</h3>
          <div className="space-y-5">
            {[
              { label: "API Auth", value: "Not configured", dot: "bg-red-500" },
              { label: "Webhook", value: "Inactive", dot: "bg-zinc-600" },
              { label: "Carrier Pool", value: "0 active", dot: "bg-zinc-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{item.label}</span>
                </div>
                <span className="text-xs font-black text-zinc-300">{item.value}</span>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full border border-zinc-700 hover:bg-zinc-800 text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-colors">
            Configure Now
          </button>
        </div>
      </div>
    </section>
  );
}

function ArchiveTable({ title, subtitle, columns, rows }: { title: string; subtitle: string; columns: string[]; rows: string[][] }) {
  return (
    <section>
      <h2 className="font-serif text-5xl font-black italic tracking-tight">{title}</h2>
      <p className="mt-3 text-sm font-medium text-[#8e6e6e]">{subtitle}</p>
      <div className="mt-10 overflow-hidden border border-[#e0d5c5] bg-white shadow-lg">
        <table className="w-full text-left">
          <thead className="border-b border-[#e0d5c5] bg-[#fcfaf7] text-[10px] uppercase tracking-[0.26em] text-[#8e6e6e]">
            <tr>{columns.map((column) => <th className="px-8 py-5" key={column}>{column}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#e0d5c5]">
            {rows.map((row) => (
              <tr className="hover:bg-[#fcfaf7]" key={row.join("-")}>
                {row.map((cell) => <td className="px-8 py-6 text-sm font-bold" key={cell}>{cell}</td>)}
                {row.length < columns.length && <td className="px-8 py-6"><button className="bg-[#1a0b0b] px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white">View</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="border border-[#e0d5c5] bg-white p-8 shadow-sm">
      <span className="material-symbols-outlined border border-[#e0d5c5] bg-[#fcfaf7] p-3">{icon}</span>
      <p className="mt-10 text-4xl font-black tracking-tight">{value}</p>
      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#8e6e6e]">{label}</p>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0)
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-700">Out of stock</span>;
  if (stock <= 10)
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-700">{stock} left</span>;
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-green-100 text-green-700">{stock} in stock</span>;
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
      {label}
      <input
        className="mt-2 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm normal-case tracking-normal text-zinc-900 outline-none focus:border-zinc-950 focus:bg-white transition-colors"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
