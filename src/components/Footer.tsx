import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-brand-black border-t border-white/5 py-20 px-6 lg:px-12 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
        <div className="text-4xl font-black text-brand-white mb-8 tracking-tighter uppercase italic">
          KINETIC
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-16">
          {["Shipping", "Returns", "Privacy", "TikTok", "Instagram"].map((link) => (
            <Link 
              key={link}
              href="#" 
              className="text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-brand-neon transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
        
        <div className="divider-tech w-full max-w-2xl mb-12"></div>
        
        <div className="text-white/20 text-[10px] uppercase tracking-[0.2em]">
          © 2024 Fun Find © 2024
        </div>
      </div>
    </footer>
  );
};

export default Footer;
