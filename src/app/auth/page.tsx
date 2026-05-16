"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";
import { useSearchParams } from "next/navigation";

const getSafeReturnTo = (value: string | null) => {
  if (!value) return "/profile";
  if (!value.startsWith("/") || value.startsWith("//")) return "/profile";
  return value;
};

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));

  useEffect(() => {
    if (user) {
      window.location.replace(returnTo);
    }
  }, [returnTo, user]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0c0d0f] text-white antialiased overflow-x-hidden relative">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover scale-125 blur-lg sm:blur-2xl opacity-50"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA108rDIIlB4iV38YDmIpOd12tPW1QwtYcYI_aMhHyVKzOGuoWQwPtmYdAyTtM2Xim_x2DUjrOtaKvzPRklnmwq4UCB4iNZs3uqYDOFm8iaG--euIx2Oa-tdP8DsQpWQ3O80VpBCjOp6DlwtyF0ljYscmj_1Cwwr_LjCQayTsU4jhPIy4nvZYzqvBZsnts0AEUQF_7ugCp5jRFeDD5Odu_tugWfVoOUBbqH2XSXdd2EdTxKhGvaB6uV0xXKzLNj6hrIUi3Mu_2Vx79Z"
          alt="Precision titanium keychain on a reflective black surface"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,8,0.92)_0%,rgba(15,16,18,0.84)_42%,rgba(6,7,8,0.95)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(41,254,87,0.24),transparent_42%)]" />
        <div className="absolute inset-x-0 top-0 h-1 bg-[#29fe57]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-start justify-center px-4 sm:px-6 pt-14 sm:pt-16 pb-8 sm:pb-10">
        <section className="w-full max-w-md rounded-[32px] border border-[#29fe57]/45 bg-white text-[#121316] shadow-[0_28px_80px_rgba(0,0,0,0.48)] overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-1 bg-[#29fe57]" />
          <div className="px-6 sm:px-8 pt-8 sm:pt-10 text-center">
            <Link href="/" className="inline-flex justify-center">
              <Logo className="text-[40px] sm:text-[48px]" />
            </Link>
            <p className="mt-4 text-[12px] sm:text-[13px] uppercase tracking-[0.32em] text-zinc-500">
              Gift-ready keychains for every drop
            </p>
          </div>

          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10">
            <div className="rounded-[24px] border border-[#29fe57]/20 bg-[#f6f7f7] p-3 sm:p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)] overflow-auto">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA108rDIIlB4iV38YDmIpOd12tPW1QwtYcYI_aMhHyVKzOGuoWQwPtmYdAyTtM2Xim_x2DUjrOtaKvzPRklnmwq4UCB4iNZs3uqYDOFm8iaG--euIx2Oa-tdP8DsQpWQ3O80VpBCjOp6DlwtyF0ljYscmj_1Cwwr_LjCQayTsU4jhPIy4nvZYzqvBZsnts0AEUQF_7ugCp5jRFeDD5Odu_tugWfVoOUBbqH2XSXdd2EdTxKhGvaB6uV0xXKzLNj6hrIUi3Mu_2Vx79Z"
                alt="Full-size keychain"
                className="block mx-auto"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>

            <div className="mt-4 sm:mt-5 rounded-[22px] border border-[#29fe57]/25 bg-white p-4 sm:p-5 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
              <p className="text-[#121316] text-[22px] sm:text-[26px] font-bold leading-tight">
                Sign in for keychain gifts and new drops
              </p>
              <p className="mt-2 text-zinc-600 text-[12px] sm:text-[13px] leading-relaxed max-w-sm">
                Access limited releases, collectible keychains, and gift-ready arrivals.
              </p>
            </div>

            <div className="mt-5 sm:mt-6 space-y-5 sm:space-y-6">
              <button
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#29fe57] bg-[#29fe57] px-4 sm:px-5 py-4 text-sm sm:text-base font-black text-[#0a3a16] transition-all hover:bg-[#1fe24d] active:scale-[0.98] shadow-[0_8px_24px_rgba(41,254,87,0.28)]"
                disabled={isLoading}
                onClick={handleGoogleLogin}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] sm:text-[22px]">account_circle</span>
                {isLoading ? "Redirecting to Google..." : "Continue with Google"}
              </button>

              <p className="text-center text-[12px] sm:text-[13px] leading-relaxed text-zinc-600 px-2 sm:px-0">
                Google sign-in is required for first-time access to your Fun Find account.
              </p>

              {errorMessage && (
                <p className="rounded-lg bg-[#ffdad6] px-4 py-3 text-sm font-medium text-[#93000a]">
                  {errorMessage}
                </p>
              )}
            </div>

            <footer className="pt-6 sm:pt-8 text-center">
              <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[12px] text-zinc-500 uppercase tracking-widest">
                <a className="hover:text-black transition-colors" href="#">Privacy</a>
                <a className="hover:text-black transition-colors" href="#">Terms</a>
                <a className="hover:text-black transition-colors" href="#">Support</a>
              </nav>
            </footer>
          </div>
        </section>
      </div>

    </main>
  );
}
