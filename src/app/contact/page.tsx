"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const SUPPORT_EMAIL = "support@funfind.shop";

export default function ContactPage() {
  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("FunFind Support");
    return `mailto:${SUPPORT_EMAIL}?subject=${subject}`;
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = name.trim() && email.trim() && message.trim();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9f9fa] text-[#1a1c1d] pt-24 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-[12px] uppercase tracking-[0.35em] text-zinc-500">Support</p>
            <h1 className="mt-4 text-[52px] leading-[1.05] tracking-[-0.05em] font-black text-black">Contact Us</h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-7 text-zinc-500">
              Need help with an order, shipping, or a product question? Email us and we&apos;ll get back to you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <section className="lg:col-span-5 bg-black text-white rounded-[32px] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.16)] border border-white/10">
              <h2 className="text-[26px] font-black tracking-[-0.04em]">Support Email</h2>
              <p className="mt-3 text-sm text-zinc-400 leading-6">
                For the fastest response, include your order ID (if you have one) and a short description of the issue.
              </p>

              <a
                href={mailtoHref}
                className="mt-8 inline-flex items-center justify-center w-full bg-[#29fe57] text-black py-4 rounded-2xl font-black uppercase tracking-[0.18em] hover:bg-[#20d14b] transition"
              >
                Email {SUPPORT_EMAIL}
              </a>

              <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5">
                <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">Quick links</p>
                <div className="mt-4 flex flex-col gap-3 text-sm font-bold">
                  <Link className="text-white/80 hover:text-[#29fe57] transition-colors" href="/legal/shipping">
                    Shipping Policy
                  </Link>
                  <Link className="text-white/80 hover:text-[#29fe57] transition-colors" href="/legal/returns">
                    Returns Policy
                  </Link>
                  <Link className="text-white/80 hover:text-[#29fe57] transition-colors" href="/legal/privacy">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </section>

            <section className="lg:col-span-7 bg-white rounded-[32px] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)] border border-zinc-200">
              <h2 className="text-[26px] font-black tracking-[-0.04em] text-black">Send a Message</h2>
              <p className="mt-2 text-sm text-zinc-500 leading-6">
                This form opens your email client with a pre-filled message (no data is stored on our servers).
              </p>

              <form
                className="mt-8 space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!canSubmit) return;
                  const subject = encodeURIComponent(`Support request from ${name.trim()}`);
                  const body = encodeURIComponent(
                    `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}\n`
                  );
                  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.32em] text-zinc-500">
                      Full Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-[#29fe57] focus:ring-2 focus:ring-[#29fe57]/20 transition"
                      placeholder="Your name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.32em] text-zinc-500">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-[#29fe57] focus:ring-2 focus:ring-[#29fe57]/20 transition"
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.32em] text-zinc-500">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full min-h-[160px] bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-[#29fe57] focus:ring-2 focus:ring-[#29fe57]/20 transition resize-none"
                    placeholder="Tell us what you need help with…"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-[0.18em] hover:bg-zinc-900 transition disabled:opacity-50 disabled:hover:bg-black"
                >
                  Open Email
                </button>

                <p className="text-xs text-zinc-500 leading-6">
                  Prefer composing manually? Email{" "}
                  <a className="font-bold text-black hover:underline" href={mailtoHref}>
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </p>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

