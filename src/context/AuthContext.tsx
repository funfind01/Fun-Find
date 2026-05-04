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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (_event === 'SIGNED_IN') {
        showToast("Signed in successfully");
      } else if (_event === 'SIGNED_OUT') {
        showToast("Signed out");
      }
    });

    return () => subscription.unsubscribe();
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
