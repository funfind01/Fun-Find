"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showToast: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  showToast: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const isInvalidRefreshTokenError = (message: string) =>
    /invalid refresh token|refresh token not found/i.test(message);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      // Check active session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error && isInvalidRefreshTokenError(error.message)) {
        await supabase.auth.signOut({ scope: "local" });
        if (isMounted) {
          setUser(null);
          setLoading(false);
          showToast("Session expired. Please sign in again.");
        }
        return;
      }

      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    };

    bootstrapSession();

    // Listen for auth changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "TOKEN_REFRESH_FAILED") {
        supabase.auth.signOut({ scope: "local" });
        setUser(null);
        setLoading(false);
        showToast("Session expired. Please sign in again.");
        return;
      }

      setUser(session?.user ?? null);
      setLoading(false);
      
      if (_event === 'SIGNED_OUT') {
        showToast("Signed out successfully");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, showToast }}>
      {children}
      
      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: 10 }}
            className="fixed top-6 right-6 z-[9999] bg-zinc-950 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-zinc-950 flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px] font-bold">check</span>
            </div>
            <span className="text-sm font-bold tracking-wide">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
