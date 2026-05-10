"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f9fa] text-[#1a1c1d] antialiased">
      <div className="min-h-screen flex flex-col md:flex-row">
        <section className="relative w-full md:w-1/2 lg:w-3/5 bg-[#e2e2e3] overflow-hidden order-last md:order-first h-72 md:h-auto">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA108rDIIlB4iV38YDmIpOd12tPW1QwtYcYI_aMhHyVKzOGuoWQwPtmYdAyTtM2Xim_x2DUjrOtaKvzPRklnmwq4UCB4iNZs3uqYDOFm8iaG--euIx2Oa-tdP8DsQpWQ3O80VpBCjOp6DlwtyF0ljYscmj_1Cwwr_LjCQayTsU4jhPIy4nvZYzqvBZsnts0AEUQF_7ugCp5jRFeDD5Odu_tugWfVoOUBbqH2XSXdd2EdTxKhGvaB6uV0xXKzLNj6hrIUi3Mu_2Vx79Z"
              alt="Precision titanium keychain on a reflective black surface"
            />
          </div>

          <div className="relative z-10 p-8 md:p-16 h-full flex flex-col justify-between bg-gradient-to-t from-black/60 via-black/10 to-transparent">
            <Link href="/" className="inline-block mb-4">
              <Logo inverted className="text-[48px]" />
            </Link>

            <div className="hidden md:block">
              <span className="inline-block px-3 py-1 bg-[#29fe57] text-[#00711f] text-sm font-bold rounded-full mb-4">
                NEW DROP
              </span>
              <h2 className="text-[32px] leading-tight font-bold text-white mb-4">
                Precision gear for the digital native.
              </h2>
              <p className="text-[18px] leading-relaxed text-white/80 max-w-md">
                Join the ecosystem. Secure your access to limited collections and exclusive hardware drops.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-md space-y-8">
            <header className="text-center md:text-left">
              <h1 className="text-[32px] leading-tight font-bold text-black mb-2">Welcome Back</h1>
              <p className="text-[16px] leading-relaxed text-[#46464a]">Access your Fun Find account.</p>
            </header>

            <div className="space-y-6">
              <button
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#c7c6ca] bg-white px-5 py-4 text-sm font-bold transition-all hover:bg-[#eeeeef] active:scale-[0.98]"
                disabled={isLoading}
                onClick={handleGoogleLogin}
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">account_circle</span>
                {isLoading ? "Redirecting to Google..." : "Continue with Google"}
              </button>

              <p className="text-center text-[12px] leading-relaxed text-[#46464a]">
                Google sign-in is required for first-time access to your Fun Find account.
              </p>

              {errorMessage && (
                <p className="rounded-lg bg-[#ffdad6] px-4 py-3 text-sm font-medium text-[#93000a]">
                  {errorMessage}
                </p>
              )}
            </div>

            <footer className="pt-8 text-center">
              <p className="text-[16px] leading-relaxed text-[#46464a]">
                New collectors are created automatically after Google verification.
              </p>
              <nav className="mt-12 flex justify-center gap-6 text-[12px] text-[#77777b] uppercase tracking-widest">
                <a className="hover:text-black transition-colors" href="#">Privacy</a>
                <a className="hover:text-black transition-colors" href="#">Terms</a>
                <a className="hover:text-black transition-colors" href="#">Support</a>
              </nav>
            </footer>
          </div>
        </section>
      </div>

      <div className="fixed top-6 left-6 z-50 md:hidden mix-blend-difference">
        <Link href="/" className="inline-block">
          <Logo inverted className="text-[24px]" />
        </Link>
      </div>
    </main>
  );
}
