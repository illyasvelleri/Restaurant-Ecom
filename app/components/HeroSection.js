"use client";

import { useState } from "react";
import Image from 'next/image'; // ← Added
import { Search, ShoppingCart, Star, TrendingUp, Clock, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 overflow-hidden">

      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 text-orange-600 rounded-full text-sm font-semibold shadow-sm">
              <TrendingUp size={16} className="mr-2" />
              #1 Food Delivery Service
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight">
              Fresh{" "}
              <span className="text-orange-500 relative inline-block">
                Food
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C40 4 160 4 198 10" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              ,<br />
              Fast{" "}
              <span className="text-orange-500 relative inline-block">
                Delivery
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C40 4 160 4 198 10" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl leading-relaxed">
              Discover culinary excellence delivered to your doorstep. Experience fresh, flavorful meals from your favorite restaurants in minutes.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Star className="text-orange-500 fill-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">4.9 Rating</p>
                  <p className="text-xs text-gray-500">2.5K+ Reviews</p>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">5000+ Users</p>
                  <p className="text-xs text-gray-500">Active Daily</p>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">15-30 Min</p>
                  <p className="text-xs text-gray-500">Delivery Time</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <a
                href="https://wa.me/918606746083"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base sm:text-lg text-center"
              >
                Order Now
              </a>

              <a
                href="/menu"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all text-base sm:text-lg text-center"
              >
                View Menu
              </a>
            </div>
          </div>

          {/* Right Column - Hero Image — FIXED */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-orange-100 to-transparent rounded-full transform scale-110 blur-3xl opacity-40 animate-pulse"></div>
              <div className="relative w-full h-full flex items-center justify-center z-10">
                <div className="relative w-4/5 h-4/5">
                  <Image
                    src="/Images/hero-image-01.png"
                    alt="Delicious food delivery"
                    fill
                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover rounded-full shadow-2xl border-8 border-white"
                    priority // This is the hero image → LCP critical
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 120" fill="none">
          <path d="M0,64 C320,96 640,96 960,64 C1280,32 1440,32 1440,64 L1440,120 L0,120 Z" fill="rgba(249, 115, 22, 0.05)" />
        </svg>
      </div>
    </section>
  );
}