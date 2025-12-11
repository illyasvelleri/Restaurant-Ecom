// components/HeroSection.jsx → PURE LUXURY • MINIMAL • TIMELESS

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          const wa = data.restaurant?.whatsapp?.replace(/\D/g, "") || "";
          if (wa) setWhatsappNumber(wa);
        }
      } catch { }
    };
    load();
  }, []);

  const waLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/966500000000";

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Subtle luxurious warmth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-50/20 via-transparent to-orange-50/10" />
        <div className="absolute top-32 -left-40 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-orange-100/15 rounded-full blur-3xl" />
      </div>

      <div className="relative pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Refined, spacious headline */}
          <div className="text-center mb-32">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight">
              <span className="block text-gray-800">Exceptional</span>
              <span className="block text-gray-900 mt-2">Cuisine</span>
              <span className="block relative inline-block mt-6">
                <span className="relative z-10 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                  Delivered
                </span>
                <span className="absolute inset-x-0 bottom-4 h-4 bg-gradient-to-r from-amber-400/25 to-orange-400/15 blur-2xl" />
              </span>
            </h1>
            <p className="mt-12 text-xl lg:text-2xl text-gray-600 font-light tracking-wide max-w-2xl mx-auto">
              Private dining, perfected — in the comfort of your home.
            </p>
          </div>

          {/* Floating centerpiece */}
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-20">

            {/* Left: Subtle customer trust */}
            <div className="flex flex-col items-center lg:items-start gap-10">
              {/* Floating customer avatars */}
              <div className="flex -space-x-8">
                <div className="w-20 h-20 rounded-full border-8 border-white shadow-2xl overflow-hidden hover:scale-110 transition">
                  <Image src="/Images/customer-1.jpg" alt="" width={80} height={80} className="object-cover" />
                </div>
                <div className="w-20 h-20 rounded-full border-8 border-white shadow-2xl overflow-hidden hover:scale-110 transition">
                  <Image src="/Images/customer-2.jpg" alt="" width={80} height={80} className="object-cover" />
                </div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 border-8 border-white shadow-2xl flex items-center justify-center text-white font-bold text-2xl">
                  8K+
                </div>
              </div>
              <p className="text-gray-700 font-medium text-center lg:text-left">
                Happy Guests<br />
                <span className="text-gray-500 text-sm font-light">Since 2020</span>
              </p>
            </div>

            {/* Center: The star — Signature Dish */}
            <div className="relative group">
              <div className="absolute -inset-12 bg-gradient-to-br from-amber-200/20 via-orange-100/15 to-transparent rounded-3xl blur-3xl opacity-60 group-hover:opacity-100 transition duration-1000" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-12 border-white">
                <Image
                  src="/Images/sandwich.jpg"
                  alt="Signature dish"
                  width={1000}
                  height={1000}
                  className="w-full max-w-xl lg:max-w-2xl object-cover transition-transform duration-1500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Right: Clean CTA + Trust */}
            <div className="text-center lg:text-left space-y-16 max-w-md">
              <p className="text-xl lg:text-2xl text-gray-700 font-light leading-relaxed">
                Crafted daily with the finest ingredients.<br />
                Delivered hot, on time, every time.
              </p>

              <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">

                {/* Primary: Explore Menu — Black & Gold */}
                <Link
                  href="/user/menu"
                  className="group relative flex items-center justify-center gap-5 
               px-10 py-5 sm:px-12 sm:py-6 lg:px-16 lg:py-8 
               bg-gray-900 dark:bg-white 
               text-white dark:text-gray-900 
               font-bold text-lg sm:text-xl lg:text-2xl 
               rounded-full shadow-2xl hover:shadow-amber-600/30 
               transform hover:scale-105 
               transition-all duration-700 overflow-hidden"
                >
                  <span className="relative z-10">Explore Menu</span>
                  <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 group-hover:translate-x-4 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 
                    scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
                </Link>

                {/* Secondary: WhatsApp — White with Black Border (Luxury Outline Style) */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-4 
               px-10 py-5 sm:px-12 sm:py-6 lg:px-16 lg:py-8 
               bg-white dark:bg-gray-900 
               border-2 border-gray-900 dark:border-white 
               text-gray-900 dark:text-white 
               font-bold text-lg sm:text-xl lg:text-2xl 
               rounded-full shadow-xl hover:shadow-2xl 
               hover:border-amber-600 dark:hover:border-amber-500 
               hover:text-amber-700 dark:hover:text-amber-400 
               transform hover:scale-105 
               transition-all duration-700 overflow-hidden"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 21.5c-5.185 0-9.5-4.315-9.5-9.5S6.815 2.5 12 2.5s9.5 4.315 9.5 9.5-4.315 9.5-9.5 9.5zm0-17c-4.136 0-7.5 3.364-7.5 7.5 0 1.656.677 3.151 1.765 4.237L5.5 20l3.823-.765A7.45 7.45 0 0012 20.5c4.136 0 7.5-3.364 7.5-7.5S16.136 4.5 12 4.5z" />
                  </svg>
                  <span className="relative z-10">Order on WhatsApp</span>

                  {/* Subtle amber glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/12 to-orange-500/12 
                    scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
                </a>
              </div>

              {/* Minimal trust metrics */}
              <div className="grid grid-cols-3 gap-10 pt-8">
                <div className="text-center">
                  <p className="text-5xl font-bold bg-gradient-to-b from-amber-600 to-orange-600 bg-clip-text text-transparent">4.9</p>
                  <p className="text-gray-600 text-sm mt-3">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-bold bg-gradient-to-b from-amber-600 to-orange-600 bg-clip-text text-transparent">20</p>
                  <p className="text-gray-600 text-sm mt-3">Min Delivery</p>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-bold bg-gradient-to-b from-amber-600 to-orange-600 bg-clip-text text-transparent">8K+</p>
                  <p className="text-gray-600 text-sm mt-3">Happy Guests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}