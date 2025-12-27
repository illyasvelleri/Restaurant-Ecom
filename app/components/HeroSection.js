// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ChevronRight, Clock, Star, Flame, Award } from "lucide-react";

// export default function BurgerHero() {
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     setIsLoaded(true);
//   }, []);

//   return (
//     <section className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans py-28">
      
//       {/* 1. DYNAMIC AMBIENCE (Modern UI Rule: Environmental Lighting) */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FFBF00]/10 rounded-full blur-[150px] opacity-50" />
//         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_100%)]" />
//       </div>

//       <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-10 flex flex-col items-center">
        
//         {/* 2. MINI BADGE (Modern UI Rule: Micro-Copy Hierarchy) */}
//         <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/5 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-md mb-8">
//             <Flame className="w-3 h-3 text-[#FFBF00] animate-pulse" />
//             <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400">
//               Handcrafted in Riyadh
//             </span>
//           </div>
//         </div>

//         {/* 3. KINETIC BACKGROUND TEXT (Modern UI Rule: Oversized Typography) */}
//         <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none">
//           <h1 className="text-[18vw] font-black leading-none tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.08] to-transparent uppercase italic">
//             Legendary
//           </h1>
//         </div>

//         {/* 4. THE CENTERPIECE (Modern UI Rule: Depth Perception) */}
//         <div className={`relative w-full max-w-[340px] md:max-w-[600px] aspect-square z-20 group transition-all duration-1000 delay-300 ${isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
//           {/* Main Image with advanced drop shadow */}
//           <div className="relative w-full h-full filter drop-shadow-[0_50px_50px_rgba(255,191,0,0.15)] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2">
//             <Image
//               src="/Images/hero-image-01.png" 
//               alt="Signature Smoked Burger"
//               fill
//               className="object-contain"
//               priority
//             />
//           </div>
          
//           {/* FLOATING GLASS CARD 01 (Rating) */}
//           <div className="absolute -top-4 -right-8 md:right-0 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-transform cursor-default hidden sm:block">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-[#FFBF00] rounded-lg text-black">
//                 <Star className="w-4 h-4 fill-current" />
//               </div>
//               <div>
//                 <p className="text-white font-black text-sm leading-none">4.9</p>
//                 <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Guest Review</p>
//               </div>
//             </div>
//           </div>

//           {/* FLOATING GLASS CARD 02 (Awards) */}
//           <div className="absolute bottom-10 -left-12 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transform hover:translate-y-2 transition-transform cursor-default hidden md:block">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-zinc-800 rounded-lg text-[#FFBF00]">
//                 <Award className="w-4 h-4" />
//               </div>
//               <p className="text-white font-bold text-xs uppercase tracking-widest">Premium Wagyu</p>
//             </div>
//           </div>
//         </div>

//         {/* 5. TITLES & ACTIONS (Modern UI Rule: Contrast and CTA Focus) */}
//         <div className={`text-center mt-[-20px] md:mt-[-50px] space-y-10 z-30 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="space-y-4">
//             <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-4">
//               Smoked <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFBF00] via-[#FFD700] to-[#FFBF00]">Masterpiece</span>
//             </h2>
//             <p className="text-zinc-400 text-sm md:text-xl max-w-xl mx-auto font-light leading-relaxed tracking-wide px-6">
//                Experience the synergy of <span className="text-white font-medium">mesquite-smoked wagyu</span> and artisan truffle textures. 
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-xl mx-auto px-6">
//             <Link
//               href="/user/menu"
//               className="group relative w-full sm:w-64 bg-[#FFBF00] text-black px-8 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-[0_25px_50px_-12px_rgba(255,191,0,0.5)] overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
//               Order Online
//               <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
//             </Link>
            
//             <div className="flex items-center gap-4 px-8 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
//                 <Clock className="w-4 h-4 text-[#FFBF00]" />
//                 <span className="text-white font-bold text-xs tracking-[0.2em] uppercase">20-25 MINS</span>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* LUXE DETAIL: Decorative Elements */}
//       <div className="absolute bottom-10 left-10 flex flex-col gap-4 opacity-20 hidden lg:flex">
//          <div className="w-px h-24 bg-gradient-to-t from-white to-transparent" />
//          <span className="text-[10px] text-white uppercase tracking-[0.5em] vertical-text font-bold [writing-mode:vertical-lr]">Scroll</span>
//       </div>
//     </section>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Clock, Star, Flame, Award, TrendingUp, Sparkles } from "lucide-react";

export default function BurgerHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
      
      {/* ENHANCED AMBIENT LIGHTING */}
      <div className="absolute inset-0 z-0">
        {/* Primary glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] bg-[#FFBF00] rounded-full blur-[120px] opacity-20 animate-pulse"
          style={{
            animationDuration: '4s',
            transform: `translate(calc(-50% + ${mousePosition.x}px), calc(-50% + ${mousePosition.y}px))`
          }}
        />
        {/* Secondary accent glow */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500 rounded-full blur-[100px] opacity-10" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-amber-600 rounded-full blur-[100px] opacity-10" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,15,15,0.8)_0%,rgba(10,10,10,1)_100%)]" />
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* TOP BADGE WITH ANIMATION */}
        <div className={`flex justify-center mb-8 md:mb-12 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="group relative flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-gradient-to-r from-white/[0.08] via-white/[0.05] to-transparent backdrop-blur-xl hover:border-[#FFBF00]/30 transition-all duration-500">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFBF00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Flame className="w-4 h-4 text-[#FFBF00] animate-pulse relative z-10" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 relative z-10">
              Handcrafted Daily
            </span>
            <Sparkles className="w-3 h-3 text-[#FFBF00]/60 animate-pulse relative z-10" />
          </div>
        </div>

        {/* OVERSIZED BACKGROUND TEXT */}
        <div className="absolute top-[35%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none overflow-hidden">
          <h1 className="text-[20vw] md:text-[18vw] lg:text-[16vw] font-black leading-none tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.12] via-white/[0.06] to-transparent uppercase italic whitespace-nowrap">
            Legendary
          </h1>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          
          {/* LEFT STATS - Desktop Only */}
          <div className="hidden lg:flex flex-col gap-6 justify-center">
            <div className={`group p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-[#FFBF00]/10 rounded-xl group-hover:bg-[#FFBF00]/20 transition-colors">
                  <Star className="w-5 h-5 text-[#FFBF00] fill-current" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">4.9</p>
                  <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Rating</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">Rated excellent by 8,000+ guests</p>
            </div>

            <div className={`group p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">8K+</p>
                  <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Orders</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">Monthly satisfied customers</p>
            </div>
          </div>

          {/* CENTER - HERO IMAGE */}
          <div className={`relative w-full max-w-[340px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[600px] aspect-square mx-auto transition-all duration-1200 delay-200 ${isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
            
            {/* Rotating ring effect */}
            <div className="absolute inset-0 rounded-full border border-[#FFBF00]/10 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-8 rounded-full border border-[#FFBF00]/5 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            
            {/* Main product image */}
            <div 
              className="relative w-full h-full group cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 0.3}deg) rotateY(${mousePosition.x * 0.3}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="relative w-full h-full filter drop-shadow-[0_40px_80px_rgba(255,191,0,0.25)] transition-all duration-700 group-hover:drop-shadow-[0_50px_100px_rgba(255,191,0,0.35)] group-hover:scale-105">
                <img
                  src="/Images/hero-image-01.png" 
                  alt="Signature Smoked Burger"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* FLOATING CARDS - Mobile Optimized */}
            <div className={`absolute -top-4 -right-4 sm:-right-8 md:right-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-4 md:p-5 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 bg-[#FFBF00] rounded-xl shadow-lg">
                  <Star className="w-4 h-4 md:w-5 md:h-5 fill-current text-black" />
                </div>
                <div>
                  <p className="text-white font-black text-lg md:text-xl leading-none">4.9</p>
                  <p className="text-[10px] md:text-xs text-zinc-400 uppercase font-bold tracking-wide">Rating</p>
                </div>
              </div>
            </div>

            <div className={`absolute bottom-8 md:bottom-10 -left-4 sm:-left-8 md:-left-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-4 md:p-5 rounded-2xl shadow-2xl transform hover:translate-y-2 transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 bg-zinc-800 rounded-xl shadow-lg">
                  <Award className="w-4 h-4 md:w-5 md:h-5 text-[#FFBF00]" />
                </div>
                <p className="text-white font-bold text-xs md:text-sm uppercase tracking-widest">Premium</p>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="hidden lg:flex flex-col gap-6 justify-center">
            <div className={`group p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-colors">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">20'</p>
                  <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Delivery</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">Express delivery to your door</p>
            </div>

            <div className={`group p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">100%</p>
                  <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Fresh</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">Made fresh, never frozen</p>
            </div>
          </div>
        </div>

        {/* MOBILE STATS - Below image on mobile */}
        <div className="grid grid-cols-2 gap-4 mt-8 lg:hidden">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-[#FFBF00]/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-[#FFBF00]" />
              </div>
            </div>
            <p className="text-2xl font-black text-white">8K+</p>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider mt-1">Orders</p>
          </div>
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <p className="text-2xl font-black text-white">20'</p>
            <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider mt-1">Delivery</p>
          </div>
        </div>

        {/* TITLE & CTA SECTION */}
        <div className={`text-center mt-8 md:mt-12 space-y-8 md:space-y-10 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Main headline */}
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] px-4">
              Smoked <br />
              <span className="relative inline-block mt-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFBF00] via-[#FFD700] to-[#FFA500] animate-gradient">
                  Masterpiece
                </span>
                <div className="absolute inset-x-0 -bottom-2 h-3 bg-gradient-to-r from-[#FFBF00]/30 to-[#FFA500]/30 blur-xl" />
              </span>
            </h2>
            
            <p className="text-zinc-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed tracking-wide px-6">
              Experience the synergy of <span className="text-white font-semibold">mesquite-smoked wagyu</span> and artisan truffle textures, crafted to perfection.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 px-4">
            
            {/* Primary CTA */}
            <a
              href="/user/menu"
              className="group relative w-full sm:w-auto bg-gradient-to-r from-[#FFBF00] to-[#FFA500] text-black px-8 md:px-10 py-5 md:py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs md:text-sm flex items-center justify-center gap-3 md:gap-4 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_-12px_rgba(255,191,0,0.5)] hover:shadow-[0_30px_60px_-12px_rgba(255,191,0,0.6)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              <span className="relative z-10">Order Online</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            </a>
            
            {/* Secondary Info */}
            <div className="w-full sm:w-auto flex items-center justify-center gap-3 md:gap-4 px-6 md:px-8 py-5 md:py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#FFBF00]" />
              <span className="text-white font-bold text-xs md:text-sm tracking-[0.2em] uppercase">20-25 Mins</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 pt-4 md:pt-6 text-xs text-zinc-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FFBF00] animate-pulse" />
              <span>Fresh Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* DECORATIVE SCROLL INDICATOR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-10 lg:translate-x-0 flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
        <div className="w-px h-16 md:h-24 bg-gradient-to-b from-transparent via-white to-transparent animate-pulse" />
        <span className="text-[10px] text-white uppercase tracking-[0.3em] font-bold hidden lg:block [writing-mode:vertical-lr]">Scroll</span>
        <span className="text-[10px] text-white uppercase tracking-[0.3em] font-bold lg:hidden">Scroll Down</span>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}