"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Star, Flame, Award } from "lucide-react";

export default function BurgerHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans py-28">
      
      {/* 1. DYNAMIC AMBIENCE (Modern UI Rule: Environmental Lighting) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FFBF00]/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-10 flex flex-col items-center">
        
        {/* 2. MINI BADGE (Modern UI Rule: Micro-Copy Hierarchy) */}
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/5 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-md mb-8">
            <Flame className="w-3 h-3 text-[#FFBF00] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400">
              Handcrafted in Riyadh
            </span>
          </div>
        </div>

        {/* 3. KINETIC BACKGROUND TEXT (Modern UI Rule: Oversized Typography) */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none">
          <h1 className="text-[18vw] font-black leading-none tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.08] to-transparent uppercase italic">
            Legendary
          </h1>
        </div>

        {/* 4. THE CENTERPIECE (Modern UI Rule: Depth Perception) */}
        <div className={`relative w-full max-w-[340px] md:max-w-[600px] aspect-square z-20 group transition-all duration-1000 delay-300 ${isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
          {/* Main Image with advanced drop shadow */}
          <div className="relative w-full h-full filter drop-shadow-[0_50px_50px_rgba(255,191,0,0.15)] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2">
            <Image
              src="/Images/hero-image-01.png" 
              alt="Signature Smoked Burger"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* FLOATING GLASS CARD 01 (Rating) */}
          <div className="absolute -top-4 -right-8 md:right-0 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-transform cursor-default hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFBF00] rounded-lg text-black">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="text-white font-black text-sm leading-none">4.9</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Guest Review</p>
              </div>
            </div>
          </div>

          {/* FLOATING GLASS CARD 02 (Awards) */}
          <div className="absolute bottom-10 -left-12 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transform hover:translate-y-2 transition-transform cursor-default hidden md:block">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg text-[#FFBF00]">
                <Award className="w-4 h-4" />
              </div>
              <p className="text-white font-bold text-xs uppercase tracking-widest">Premium Wagyu</p>
            </div>
          </div>
        </div>

        {/* 5. TITLES & ACTIONS (Modern UI Rule: Contrast and CTA Focus) */}
        <div className={`text-center mt-[-20px] md:mt-[-50px] space-y-10 z-30 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="space-y-4">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-4">
              Smoked <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFBF00] via-[#FFD700] to-[#FFBF00]">Masterpiece</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-xl max-w-xl mx-auto font-light leading-relaxed tracking-wide px-6">
               Experience the synergy of <span className="text-white font-medium">mesquite-smoked wagyu</span> and artisan truffle textures. 
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-xl mx-auto px-6">
            <Link
              href="/user/menu"
              className="group relative w-full sm:w-64 bg-[#FFBF00] text-black px-8 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-[0_25px_50px_-12px_rgba(255,191,0,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              Order Online
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
            
            <div className="flex items-center gap-4 px-8 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <Clock className="w-4 h-4 text-[#FFBF00]" />
                <span className="text-white font-bold text-xs tracking-[0.2em] uppercase">20-25 MINS</span>
            </div>
          </div>
        </div>

      </div>

      {/* LUXE DETAIL: Decorative Elements */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-4 opacity-20 hidden lg:flex">
         <div className="w-px h-24 bg-gradient-to-t from-white to-transparent" />
         <span className="text-[10px] text-white uppercase tracking-[0.5em] vertical-text font-bold [writing-mode:vertical-lr]">Scroll</span>
      </div>
    </section>
  );
}