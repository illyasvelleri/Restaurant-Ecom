// // components/Navbar.jsx → FINAL — EXACT YOUR DESIGN + REAL NAME FROM API

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, UtensilsCrossed, Flame, Package, User } from "lucide-react";
// import ProfileIcon from "./ProfileIcon"; // ← Your real ProfileIcon component

// export default function Navbar() {
//   const pathname = usePathname();

//   // Fetch restaurant name & logo from API
//   const [restaurant, setRestaurant] = useState({ name: "Loading...", logo: null });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const res = await fetch("/api/restaurantDetails");
//         if (res.ok) {
//           const data = await res.json();
//           setRestaurant({
//             name: data.restaurant?.name || "My Restaurant",
//             logo: data.restaurant?.logo || null,
//           });
//         }
//       } catch (err) {
//         console.error("Failed to load restaurant name");
//         setRestaurant({ name: "My Restaurant", logo: null });
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
//     { href: "/user/combos", label: "Offers", icon: Package },
//   ];

//   if (loading) return <div className="h-20 lg:h-24" />;

//   return (
//     <>
//       {/* DESKTOP NAVBAR — EXACT YOUR DESIGN */}
//       <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-8 py-6 flex items-center">

//           {/* LEFT: Logo + Restaurant Name (FROM API) */}
//           <a href="/" className="flex items-center gap-6">
//             {/* Logo */}
//             <div className="flex-shrink-0">
//               {restaurant.logo ? (
//                 <Image
//                   src={restaurant.logo}
//                   alt={restaurant.name}
//                   width={56}
//                   height={56}
//                   className="rounded-2xl shadow-lg"
//                 />
//               ) : (
//                 <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
//                   {restaurant.name.charAt(0).toUpperCase()}
//                 </div>
//               )}
//             </div>

//             {/* Restaurant Name — NOW FROM DATABASE */}
//             <span className="text-3xl lg:text-4xl font-light tracking-tight text-gray-900">
//               {restaurant.name}
//             </span>
//           </a>

//           {/* CENTER: Navigation Links — gap-16 */}
//           <div className="flex-1 flex justify-center ml-24">
//             <div className="flex items-center gap-16">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={`text-lg font-medium transition-all duration-300 ${pathname === link.href
//                     ? "text-gray-900"
//                     : "text-gray-600 hover:text-gray-900"
//                     }`}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT: Order Now + Profile — gap-8 between them */}
//           <div className="flex items-center gap-8 ml-24">
//             <Link
//               href="/user/menu"
//               className="px-10 py-4 bg-gray-900 text-white rounded-full font-medium text-lg hover:bg-gray-800 hover:shadow-amber-600/30 transition-all duration-500 shadow-xl"
//             >
//               Order Now
//             </Link>

//             {/* REAL PROFILE ICON */}
//             <ProfileIcon />
//           </div>

//         </div>
//       </nav>

//       {/* MOBILE TOP BAR */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
//         <div className="flex items-center justify-between px-6 py-5">
//           <a href="/" className="flex items-center gap-3">
//             {restaurant.logo ? (
//               <Image src={restaurant.logo} alt="" width={48} height={48} className="rounded-xl shadow-md" />
//             ) : (
//               <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
//                 {restaurant.name.charAt(0).toUpperCase()}
//               </div>
//             )}
//             <span className="text-xl font-light text-gray-900">{restaurant.name}</span>
//           </a>
//           <ProfileIcon />
//         </div>
//       </div>

//       {/* MOBILE BOTTOM NAV */}
//       {/* MOBILE BOTTOM NAV — WATER DROP CURVED NOTCH */}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
//         <div className="flex justify-around items-end py-2 relative">

//           {navLinks.map((item) => {
//             const Icon = item.icon;
//             const active = pathname === item.href;

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="relative flex flex-col items-center justify-end min-w-[70px]"
//               >
//                 {/* ACTIVE WATER DROP SHAPE (behind icon only) */}
//                 {active && (
//                   <div
//                     className="
//                 absolute 
//                 -top-4
//                 w-14
//                 h-14
//                 bg-white
//                 rounded-b-full rounded-t-3xl
//                 border border-gray-200/50
//                 shadow-md
//                 z-0
//               "
//                     style={{
//                       clipPath:
//                         "path('M0,28 Q28,-2 56,28 Q28,40 0,28 Z')",
//                     }}
//                   ></div>
//                 )}

//                 {/* ICON */}
//                 <div
//                   className={`relative z-10 transition-all duration-300 ${active ? "text-gray-900 scale-110 -translate-y-1" : "text-gray-500"
//                     }`}
//                 >
//                   <Icon size={26} />
//                 </div>

//                 {/* LABEL (DOES NOT MOVE) */}
//                 <span
//                   className={`relative z-10 text-xs mt-1 transition-all ${active ? "text-gray-900 font-medium" : "text-gray-500"
//                     }`}
//                 >
//                   {item.label}
//                 </span>
//               </Link>
//             );
//           })}

//         </div>
//       </div>



//       <div className="" />
//     </>
//   );
// }


// components/Navbar.jsx → THE 2026 PREMIUM EDIT
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, Flame, Package, Shield } from "lucide-react"; // Added Shield
import ProfileIcon from "./ProfileIcon";
import { motion } from "framer-motion";

export default function Navbar() {

  const { data: session } = useSession();

  // THE PRO LOGIC: 
  // An Admin is 'authenticated' globally, but 'signed out' for the User Menu UI.
  const isCustomer = session?.user?.role === "user";
  const isAdmin = session?.user?.role && session?.user?.role !== "user";

  const pathname = usePathname();
  const [restaurant, setRestaurant] = useState({ name: "...", logo: null });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    fetch("/api/restaurantDetails")
      .then(res => res.json())
      .then(data => setRestaurant({
        name: data.restaurant?.name || "Restaurant",
        logo: data.restaurant?.logo || null
      }))
      .catch(() => setRestaurant({ name: "Luxe Eats", logo: null }));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/user/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/user/popular", label: "Curated", icon: Flame },
    { href: "/user/combos", label: "Offers", icon: Package },
  ];

  return (
    <>
      {/* DESKTOP: MINIMALIST LUXURY */}
      <nav className={`hidden lg:flex fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? "py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm" : "py-8 bg-transparent"
        }`}>
        <div className="max-w-screen-2xl mx-auto px-12 flex items-center justify-between w-full">

          {/* BRANDING */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-[1.2rem] bg-black shadow-2xl transition-transform duration-500 group-hover:scale-105">
              {restaurant.logo ? (
                <Image src={restaurant.logo} alt="Logo" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-white font-serif italic text-xl">
                  {restaurant.name.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-2xl font-light tracking-[-0.03em] text-black">
              {restaurant.name.split(' ')[0]}<span className="font-serif italic text-gray-400">{restaurant.name.split(' ')[1] || ""}</span>
            </span>
          </Link>

          {/* NAVIGATION - FLOATING PILL STYLE */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-gray-50/50 border border-gray-100/50 p-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-6 py-2 rounded-full text-[13px] font-bold tracking-[0.1em] uppercase transition-all duration-300 ${pathname === link.href ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-black"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ACTION AREA */}
          <div className="flex items-center gap-8">
            {/* ADMIN SHORTCUT: Only visible to logged-in Admins on User Route */}
            {isAdmin && (
              <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-red-100 transition-all">
                <Shield size={12} /> Exit Guest View
              </Link>
            )}

            <Link href="/user/menu" className="relative group">
              <span className="text-[11px] font-bold tracking-widest uppercase text-black group-hover:text-gray-500 transition-colors">Reserved Table</span>
              <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black transition-all group-hover:w-full"></div>
            </Link>
            <div className="h-6 w-[1px] bg-gray-200"></div>
            
            {/* FIX: If not a customer role, we pass 'null' to ProfileIcon so it shows 'Sign In' */}
            <ProfileIcon session={isCustomer ? session : null} />
          </div>
        </div>
      </nav>

      {/* MOBILE TOP: CLEAN GLASS */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-light tracking-tighter uppercase">{restaurant.name}</span>
          <div className="flex items-center gap-4">
            {isAdmin && (
               <Link href="/admin/dashboard" className="p-2 bg-black text-white rounded-lg">
                  <Shield size={16} />
               </Link>
            )}
            <ProfileIcon session={isCustomer ? session : null} />
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM: LIQUID TAB BAR */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100]">
        <div className="bg-black/90 backdrop-blur-2xl rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl border border-white/10">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center flex-1 py-2"
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-2xl mx-1"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={20} className={`transition-colors duration-300 ${active ? "text-white" : "text-gray-500"}`} />
                <span className={`text-[9px] mt-1 font-bold uppercase tracking-widest ${active ? "text-white" : "text-gray-500"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

// // components/Navbar.jsx → THE 2026 PREMIUM EDIT
// "use client";


// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, UtensilsCrossed, Flame, Package, ShoppingBag } from "lucide-react";
// import ProfileIcon from "./ProfileIcon";
// import { motion } from "framer-motion";

// export default function Navbar() {
//   const pathname = usePathname();
//   const [restaurant, setRestaurant] = useState({ name: "...", logo: null });
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
    
//     fetch("/api/restaurantDetails")
//       .then(res => res.json())
//       .then(data => setRestaurant({
//         name: data.restaurant?.name || "Restaurant",
//         logo: data.restaurant?.logo || null
//       }))
//       .catch(() => setRestaurant({ name: "Luxe Eats", logo: null }));

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navLinks = [
//     { href: "/", label: "Home", icon: Home },
//     { href: "/user/menu", label: "Menu", icon: UtensilsCrossed },
//     { href: "/user/popular", label: "Curated", icon: Flame },
//     { href: "/user/combos", label: "Offers", icon: Package },
//   ];

//   return (
//     <>
//       {/* DESKTOP: MINIMALIST LUXURY */}
//       <nav className={`hidden lg:flex fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
//         isScrolled ? "py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm" : "py-8 bg-transparent"
//       }`}>
//         <div className="max-w-screen-2xl mx-auto px-12 flex items-center justify-between w-full">
          
//           {/* BRANDING */}
//           <Link href="/" className="flex items-center gap-4 group">
//             <div className="relative w-12 h-12 overflow-hidden rounded-[1.2rem] bg-black shadow-2xl transition-transform duration-500 group-hover:scale-105">
//               {restaurant.logo ? (
//                 <Image src={restaurant.logo} alt="Logo" fill className="object-cover" />
//               ) : (
//                 <div className="flex items-center justify-center h-full text-white font-serif italic text-xl">
//                   {restaurant.name.charAt(0)}
//                 </div>
//               )}
//             </div>
//             <span className="text-2xl font-light tracking-[-0.03em] text-black">
//               {restaurant.name.split(' ')[0]}<span className="font-serif italic text-gray-400">{restaurant.name.split(' ')[1] || ""}</span>
//             </span>
//           </Link>

//           {/* NAVIGATION - FLOATING PILL STYLE */}
//           <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-gray-50/50 border border-gray-100/50 p-1.5 rounded-full backdrop-blur-md">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className={`px-6 py-2 rounded-full text-[13px] font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
//                   pathname === link.href ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-black"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* ACTION AREA */}
//           <div className="flex items-center gap-8">
//             <Link href="/user/menu" className="relative group">
//                <span className="text-[11px] font-bold tracking-widest uppercase text-black group-hover:text-gray-500 transition-colors">Reserved Table</span>
//                <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black transition-all group-hover:w-full"></div>
//             </Link>
//             <div className="h-6 w-[1px] bg-gray-200"></div>
//             <ProfileIcon />
//           </div>
//         </div>
//       </nav>

//       {/* MOBILE TOP: CLEAN GLASS */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <span className="text-lg font-light tracking-tighter uppercase">{restaurant.name}</span>
//           <ProfileIcon />
//         </div>
//       </div>

//       {/* MOBILE BOTTOM: LIQUID TAB BAR */}
//       <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100]">
//         <div className="bg-black/90 backdrop-blur-2xl rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl border border-white/10">
//           {navLinks.map((item) => {
//             const Icon = item.icon;
//             const active = pathname === item.href;
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="relative flex flex-col items-center flex-1 py-2"
//               >
//                 {active && (
//                   <motion.div 
//                     layoutId="activeTab"
//                     className="absolute inset-0 bg-white/10 rounded-2xl mx-1"
//                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                   />
//                 )}
//                 <Icon size={20} className={`transition-colors duration-300 ${active ? "text-white" : "text-gray-500"}`} />
//                 <span className={`text-[9px] mt-1 font-bold uppercase tracking-widest ${active ? "text-white" : "text-gray-500"}`}>
//                   {item.label}
//                 </span>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }