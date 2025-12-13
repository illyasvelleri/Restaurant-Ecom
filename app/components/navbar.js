// components/Navbar.jsx → FINAL — EXACT YOUR DESIGN + REAL NAME FROM API

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, Flame, Package, User } from "lucide-react";
import ProfileIcon from "./ProfileIcon"; // ← Your real ProfileIcon component

export default function Navbar() {
  const pathname = usePathname();

  // Fetch restaurant name & logo from API
  const [restaurant, setRestaurant] = useState({ name: "Loading...", logo: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/restaurantDetails");
        if (res.ok) {
          const data = await res.json();
          setRestaurant({
            name: data.restaurant?.name || "My Restaurant",
            logo: data.restaurant?.logo || null,
          });
        }
      } catch (err) {
        console.error("Failed to load restaurant name");
        setRestaurant({ name: "My Restaurant", logo: null });
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
    { href: "/user/combos", label: "Offers", icon: Package },
  ];

  if (loading) return <div className="h-20 lg:h-24" />;

  return (
    <>
      {/* DESKTOP NAVBAR — EXACT YOUR DESIGN */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center">

          {/* LEFT: Logo + Restaurant Name (FROM API) */}
          <a href="/" className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {restaurant.logo ? (
                <Image
                  src={restaurant.logo}
                  alt={restaurant.name}
                  width={56}
                  height={56}
                  className="rounded-2xl shadow-lg"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                  {restaurant.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Restaurant Name — NOW FROM DATABASE */}
            <span className="text-3xl lg:text-4xl font-light tracking-tight text-gray-900">
              {restaurant.name}
            </span>
          </a>

          {/* CENTER: Navigation Links — gap-16 */}
          <div className="flex-1 flex justify-center ml-24">
            <div className="flex items-center gap-16">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium transition-all duration-300 ${pathname === link.href
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: Order Now + Profile — gap-8 between them */}
          <div className="flex items-center gap-8 ml-24">
            <Link
              href="/user/menu"
              className="px-10 py-4 bg-gray-900 text-white rounded-full font-medium text-lg hover:bg-gray-800 hover:shadow-amber-600/30 transition-all duration-500 shadow-xl"
            >
              Order Now
            </Link>

            {/* REAL PROFILE ICON */}
            <ProfileIcon />
          </div>

        </div>
      </nav>

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            {restaurant.logo ? (
              <Image src={restaurant.logo} alt="" width={48} height={48} className="rounded-xl shadow-md" />
            ) : (
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                {restaurant.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xl font-light text-gray-900">{restaurant.name}</span>
          </a>
          <ProfileIcon />
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      {/* MOBILE BOTTOM NAV — WATER DROP CURVED NOTCH */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex justify-around items-end py-2 relative">

          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-end min-w-[70px]"
              >
                {/* ACTIVE WATER DROP SHAPE (behind icon only) */}
                {active && (
                  <div
                    className="
                absolute 
                -top-4
                w-14
                h-14
                bg-white
                rounded-b-full rounded-t-3xl
                border border-gray-200/50
                shadow-md
                z-0
              "
                    style={{
                      clipPath:
                        "path('M0,28 Q28,-2 56,28 Q28,40 0,28 Z')",
                    }}
                  ></div>
                )}

                {/* ICON */}
                <div
                  className={`relative z-10 transition-all duration-300 ${active ? "text-gray-900 scale-110 -translate-y-1" : "text-gray-500"
                    }`}
                >
                  <Icon size={26} />
                </div>

                {/* LABEL (DOES NOT MOVE) */}
                <span
                  className={`relative z-10 text-xs mt-1 transition-all ${active ? "text-gray-900 font-medium" : "text-gray-500"
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

        </div>
      </div>



      <div className="h-20 lg:h-24" />
    </>
  );
}