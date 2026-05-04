"use client";

import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative h-[90vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden bg-brand-black">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-transparent to-brand-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.05)_0%,transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full text-center md:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="font-bold text-brand-neon mb-6 block uppercase tracking-[0.4em] text-xs">
            New Arrival: Velo 01
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-brand-white mb-8 tracking-tighter leading-[0.9] uppercase italic">
            ENGINEERED <br /> 
            <span className="text-white/20">FOR THE</span> <br /> 
            COLLECTOR.
          </h1>
          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-lg leading-relaxed">
            High-velocity aesthetics meet industrial-grade durability. Every Fun Find product is CNC-milled for the modern digital boutique.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <button className="bg-brand-neon text-brand-black font-black px-12 py-5 rounded-none hover:bg-white transition-all active:scale-95 uppercase tracking-widest text-sm">
              Shop the Drop
            </button>
            <button className="border border-white/20 text-white font-black px-12 py-5 rounded-none hover:bg-white hover:text-brand-black transition-all active:scale-95 uppercase tracking-widest text-sm">
              View Lookbook
            </button>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
