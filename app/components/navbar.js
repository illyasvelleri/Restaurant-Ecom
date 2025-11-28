// components/Navbar.js → FINAL & PERFECT (Using ProfileIcon)

"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, Flame } from "lucide-react";
import ProfileIcon from "../components/ProfileIcon";

export default function Navbar() {
  const pathname = usePathname();
  const [restaurant, setRestaurant] = useState({ name: "Indulge", logo: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setRestaurant({
            name: data.restaurant?.name || "Indulge",
            logo: data.restaurant?.logo || null,
          });
        }
      } catch (err) {
        console.error("Failed to load restaurant settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/user/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/user/popular", label: "Popular", icon: Flame },
  ];

  const isActive = (href) => pathname === href;

  if (loading) {
    return <div className="h-16 bg-white border-b border-gray-100" />;
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:block sticky top-0 bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-3">
            {restaurant.logo ? (
              <Image
                src={restaurant.logo}
                alt={restaurant.name}
                width={44}
                height={44}
                className="rounded-2xl shadow-md object-cover"
              />
            ) : (
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {restaurant.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {restaurant.name}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold text-gray-700 hover:text-orange-600 transition-all relative ${
                  isActive(link.href) ? "text-orange-600" : ""
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* PROFILE ICON — Compact & Perfect */}
          <ProfileIcon />
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50 border-b border-gray-100">
        <div className="flex items-center justify-between px-5 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {restaurant.logo ? (
              <Image src={restaurant.logo} alt={restaurant.name} width={36} height={36} className="rounded-xl" />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">{restaurant.name.charAt(0)}</span>
              </div>
            )}
            <span className="text-xl font-bold text-gray-900">{restaurant.name}</span>
          </Link>

          {/* PROFILE ICON on Mobile */}
          <ProfileIcon />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="grid grid-cols-4 h-20">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                  active ? "text-orange-600" : "text-gray-500"
                }`}
              >
                <Icon size={24} className={active ? "drop-shadow-md" : ""} />
                <span className={`text-xs font-medium ${active ? "font-bold" : ""}`}>
                  {item.label}
                </span>
                {active && <div className="absolute top-3 w-1 h-1 bg-orange-600 rounded-full" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Spacers */}
      <div className="lg:hidden h-20" />
      <div className="lg:hidden h-20" />
    </>
  );
}