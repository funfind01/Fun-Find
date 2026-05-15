"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    // Supabase will automatically handle the session from the URL
    // Just wait a moment for it to process, then redirect
    const handleCallback = async () => {
      try {
        // Give Supabase time to set the session
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if we have an active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // User is authenticated, redirect to profile
          window.location.replace("/profile");
        } else {
          // No session, redirect to auth page
          window.location.replace("/auth");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        window.location.replace("/auth");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
