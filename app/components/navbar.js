// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { Home, UtensilsCrossed, Flame, Package } from "lucide-react";
// import ProfileIcon from "../components/ProfileIcon";

// export default function Navbar() {
//   const pathname = usePathname();
//   const [restaurant, setRestaurant] = useState({ name: "Restaurant", logo: null });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const res = await fetch("/api/admin/settings");
//         if (res.ok) {
//           const data = await res.json();
//           setRestaurant({
//             name: data.restaurant?.name || "Restaurant",
//             logo: data.restaurant?.logo || null,
//           });
//         }
//       } catch (err) {
//         console.error("Failed to load restaurant settings");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   const navLinks = [
//     { href: "/", label: "Home", icon: Home },
//     { href: "/user/menu", label: "Menu", icon: UtensilsCrossed },
//     { href: "/user/popular", label: "Popular", icon: Flame },
//     { href: "/user/combos", label: "Combos", icon: Package }, // NEW ITEM
//   ];

//   const isActive = (href) => pathname === href;

//   if (loading) return <div className="h-20 bg-black/80" />;

//   return (
//     <>
//       {/* DESKTOP NAVBAR */}
//       <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
//         <div className="container mx-auto px-8 py-5 flex items-center justify-between">
//           {/* LOGO */}
//           <Link href="/" className="flex items-center gap-4">
//             {restaurant.logo ? (
//               <Image
//                 src={restaurant.logo}
//                 alt={restaurant.name}
//                 width={48}
//                 height={48}
//                 className="rounded-2xl shadow-xl object-cover border border-white/20"
//               />
//             ) : (
//               <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
//                 <span className="text-white text-xl font-bold">
//                   {restaurant.name.charAt(0)}
//                 </span>
//               </div>
//             )}
//             <span className="text-2xl font-light text-white tracking-wide">
//               {restaurant.name}
//             </span>
//           </Link>

//           {/* NAV LINKS */}
//           <div className="flex items-center gap-12">
//             {navLinks.map((link) => {
//               const active = isActive(link.href);
//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={`relative text-lg tracking-wide ${
//                     active ? "text-white" : "text-white/60 hover:text-white"
//                   } transition-all`}
//                 >
//                   {link.label}
//                   {active && (
//                     <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-white rounded-full" />
//                   )}
//                 </Link>
//               );
//             })}
//           </div>

//           <ProfileIcon />
//         </div>
//       </nav>

//       {/* MOBILE TOP NAV */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-xl border-b border-white/10 shadow-xl">
//         <div className="flex items-center justify-between px-5 py-4">
//           <Link href="/" className="flex items-center gap-3">
//             {restaurant.logo ? (
//               <Image
//                 src={restaurant.logo}
//                 alt={restaurant.name}
//                 width={40}
//                 height={40}
//                 className="rounded-xl border border-white/20 shadow-lg"
//               />
//             ) : (
//               <div className="w-10 h-10 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">
//                   {restaurant.name.charAt(0)}
//                 </span>
//               </div>
//             )}
//             <span className="text-white font-medium text-xl">{restaurant.name}</span>
//           </Link>

//           <ProfileIcon />
//         </div>
//       </div>

//       {/* MOBILE BOTTOM NAV (FIXED, RESPONSIVE, PREMIUM) */}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
//         <div className="flex justify-between h-20 px-2">
//           {navLinks.map((item) => {
//             const active = isActive(item.href);
//             const Icon = item.icon;

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`relative flex flex-col items-center justify-center flex-1 gap-1 ${
//                   active ? "text-white" : "text-white/50"
//                 } transition`}
//               >
//                 <Icon size={26} className={`${active ? "drop-shadow-lg" : ""}`} />
//                 <span className={`text-[11px] tracking-wide ${active ? "font-semibold" : ""}`}>
//                   {item.label}
//                 </span>

//                 {active && (
//                   <span className="absolute top-1 w-1.5 h-1.5 bg-white rounded-full" />
//                 )}
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* MOBILE SPACER */}
//       <div className="lg:hidden h-20" />
//     </>
//   );
// }
// components/Navbar.jsx → CLEAN, MINIMAL, MATCHING THE HERO

// components/Navbar.jsx → FINAL 2025 LUXURY — PERFECT SPACING

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
        const res = await fetch("/api/admin/settings");
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
                  className={`text-lg font-medium transition-all duration-300 ${
                    pathname === link.href
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-2xl">
        <div className="flex justify-around py-3">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition-all ${
                  active ? "text-gray-900" : "text-gray-500"
                }`}
              >
                <Icon size={26} />
                <span className="text-xs font-medium">{item.label}</span>
                {active && <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-1" />}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="h-20 lg:h-24" />
    </>
  );
}