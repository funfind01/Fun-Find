import React from "react";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

const policies: Record<string, { title: string; content: React.ReactNode }> = {
  terms: {
    title: "Terms & Conditions",
    content: (
      <>
        <p>Welcome to Fun Find. These terms and conditions outline the rules and regulations for the use of our website.</p>
        <h3 className="text-xl font-bold mt-6 mb-2 text-black">1. Acceptance of Terms</h3>
        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Fun Find if you do not agree to take all of the terms and conditions stated on this page.</p>
        <h3 className="text-xl font-bold mt-6 mb-2 text-black">2. Products & Pricing</h3>
        <p>All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice.</p>
        <h3 className="text-xl font-bold mt-6 mb-2 text-black">3. User Conduct</h3>
        <p>You agree not to use the site for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the site in any way that could damage the site, the services or the general business of Fun Find.</p>
      </>
    )
  },
  privacy: {
    title: "Privacy Policy",
    content: (
      <>
        <p>At Fun Find, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Fun Find and how we use it.</p>
        <h3 className="text-xl font-bold mt-6 mb-2 text-black">Information We Collect</h3>
        <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
        <h3 className="text-xl font-bold mt-6 mb-2 text-black">How We Use Your Information</h3>
        <p>We use the information we collect in various ways, including to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
        </ul>
      </>
    )
  },
  shipping: {
    title: "Shipping Policy",
    content: (
      <>
        <p>Thank you for visiting and shopping at Fun Find. Following are the terms and conditions that constitute our Shipping Policy.</p>
        <h3 className="text-xl font-bold mt-6 mb-2 text-black">Shipment Processing Time</h3>
        <p>All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.</p>
        <h3 className="text-xl font-bold mt-6 mb-2 text-black">Shipping Rates & Delivery Estimates</h3>
        <p>Shipping charges for your order will be calculated and displayed at checkout. Delivery delays can occasionally occur due to unforeseen logistics issues.</p>
      </>
    )
  },
  returns: {
    title: "Returns & Refunds",
    content: (
      <>
        <p>Thank you for shopping at Fun Find.</p>
        <h3 className="text-xl font-bold mt-6 mb-2 text-black">Returns</h3>
        <p>You have 14 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.</p>
        <h3 className="text-xl font-bold mt-6 mb-2 text-black">Refunds</h3>
        <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your credit card (or original method of payment).</p>
      </>
    )
  }
};

export default async function LegalPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const data = policies[policy];

  if (!data) {
    notFound();
  }

  return (
    <div className="bg-[#f9f9fa] text-[#1a1c1d] min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 min-h-[70vh]">
        <nav className="mb-8 flex gap-2 text-[12px] text-zinc-500 uppercase tracking-widest font-bold">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-black">{data.title}</span>
        </nav>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-8 text-black">{data.title}</h1>
        <div className="text-zinc-600 leading-relaxed text-lg">
          {data.content}
        </div>
      </main>

      <footer className="w-full bg-zinc-900 border-t border-zinc-800 flex flex-col items-center py-16 px-6 text-center">
        <div className="mb-4">
          <Logo className="text-3xl" inverted />
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50" href="/legal/terms">Terms</Link>
          <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50" href="/legal/shipping">Shipping</Link>
          <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50" href="/legal/returns">Returns</Link>
          <Link className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50" href="/legal/privacy">Privacy</Link>
        </div>
        <div className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">© 2024 Fun Find © 2024</div>
      </footer>
    </div>
  );
}
