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
          const settings = await res.json();
          const wa = settings.restaurant?.whatsapp?.replace(/\D/g, "") || "";
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
        }
      } catch (err) {
        // Silent fail (Hero should never break UI)
      }
    };

    load();
  }, []);

  const whatsappLink =
    whatsappNumber && whatsappNumber.length >= 10
      ? `https://wa.me/${whatsappNumber}`
      : "https://wa.me/966500000000"; // fallback

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/Images/hero-image-01.png"
          alt="Culinary excellence"
          fill
          priority
          className="object-cover brightness-[0.4] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
      </div>

      {/* Overlay Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        {/* <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/80 text-sm font-medium mb-12 shadow-2xl">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Riyadh’s Most Exclusive Dining Experience
        </div> */}

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-white mb-8 leading-none">
          <span className="block">Exceptional</span>
          <span className="block font-medium text-white/95">Cuisine</span>
          <span className="block">Delivered</span>
        </h1>

        <p className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto mb-16 leading-relaxed font-light tracking-wide">
          Handcrafted dishes from Riyadh’s finest kitchens — prepared with precision,
          delivered with elegance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/user/menu"
            className="group px-16 py-7 bg-white text-black rounded-full text-xl font-medium hover:bg-gray-100 transition-all duration-500 shadow-2xl flex items-center gap-4"
          >
            Explore the Menu
            <ChevronRight
              size={28}
              className="group-hover:translate-x-2 transition-transform"
            />
          </Link>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-16 py-7 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xl font-medium hover:bg-white/20 transition-all duration-500"
          >
            Order via WhatsApp
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-12 mt-20 text-white/50 text-sm uppercase tracking-widest">
          <div className="text-center">
            <p className="text-3xl font-light text-white mb-2">500+</p>
            <p>Curated Dishes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-light text-white mb-2">4.9</p>
            <p>Guest Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-light text-white mb-2">24/7</p>
            <p>Available</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-4 bg-white/60 rounded-full mt-3 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
