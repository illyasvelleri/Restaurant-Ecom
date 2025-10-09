// // 'use client';

// // import Link from 'next/link';
// // import { usePathname } from 'next/navigation';
// // import Image from 'next/image';
// // import { motion } from 'framer-motion';
// // import { Home, Sparkles, ClipboardList, User, ShoppingCart } from 'lucide-react';

// // export default function Header({ cart = [] }) {
// //   const pathname = usePathname();

// //   const navItems = [
// //     { href: '/', label: 'Home', icon: Home },
// //     { href: '/menu', label: 'Menu', icon: Sparkles },
// //     { href: '/profile', label: 'Profile', icon: User },
// //     { href: '/cart', label: 'Cart', icon: ShoppingCart },
// //   ];

// //   const isActive = (href) => pathname === href;

// //   const getTotalItems = () =>
// //     Array.isArray(cart)
// //       ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
// //       : 0;

// //   return (
// //     <>
// //       {/* Desktop Navbar */}
// //       <nav className="hidden md:flex justify-between items-center w-full px-8 py-4 bg-white shadow-sm rounded-b-3xl z-50 fixed top-0 left-0 right-0">
// //         {/* Logo */}
// //         <div className="flex items-center space-x-3">
// //           <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500">
// //             <Image
// //               src="/Images/logo.png"
// //               alt="Indulge Logo"
// //               width={28}
// //               height={28}
// //               className="rounded-full object-cover"
// //             />
// //           </div>
// //           <div className="text-2xl font-bold text-orange-500">Indulge</div>
// //         </div>

// //         {/* Desktop Links */}
// //         <div className="flex gap-8 text-gray-700 text-sm font-medium">
// //           {navItems.map((item) => (
// //             <Link
// //               key={item.label}
// //               href={item.href}
// //               className={`group flex items-center gap-2 relative hover:text-orange-500 transition-colors duration-200 ${
// //                 isActive(item.href) ? 'text-orange-500' : ''
// //               }`}
// //             >
// //               <item.icon className="w-5 h-5" />
// //               <span className="relative">
// //                 {item.label}
// //                 <span
// //                   className={`absolute left-0 -bottom-1 h-[2px] bg-orange-500 transition-all duration-300 ${
// //                     isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
// //                   }`}
// //                 />
// //               </span>
// //               {item.label === 'Cart' && getTotalItems() > 0 && (
// //                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
// //                   {getTotalItems()}
// //                 </span>
// //               )}
// //             </Link>
// //           ))}
// //         </div>
// //       </nav>

// //       {/* Add padding for content below desktop navbar */}
// //       <div className="md:pt-20"></div>

// //       {/* Mobile Bottom Navbar */}
// //       <motion.div
// //         initial={{ y: 20, opacity: 0 }}
// //         animate={{ y: 0, opacity: 1 }}
// //         transition={{ duration: 0.6 }}
// //         className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-orange-500 text-white py-3 rounded-t-3xl shadow-2xl md:hidden z-50"
// //       >
// //         {navItems.map((item) => (
// //           <Link
// //             key={item.label}
// //             href={item.href}
// //             className={`flex flex-col items-center text-xs font-medium transition-all duration-300 ease-in-out relative ${
// //               isActive(item.href) ? 'text-white' : 'text-white/70'
// //             }`}
// //           >
// //             <motion.div
// //               whileHover={{ scale: 1.2 }}
// //               whileTap={{ scale: 0.9 }}
// //               className={`p-2 rounded-xl ${
// //                 isActive(item.href) ? 'bg-white/20' : 'hover:bg-white/10'
// //               }`}
// //             >
// //               <div className="relative">
// //                 <item.icon
// //                   className={`h-6 w-6 ${
// //                     isActive(item.href) ? 'text-white' : 'text-white/70'
// //                   }`}
// //                 />
// //                 {item.label === 'Cart' && getTotalItems() > 0 && (
// //                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
// //                     {getTotalItems()}
// //                   </span>
// //                 )}
// //               </div>
// //             </motion.div>
// //             <span
// //               className={`mt-1 text-[10px] ${
// //                 isActive(item.href) ? 'font-semibold' : 'text-white/50'
// //               }`}
// //             >
// //               {item.label}
// //             </span>
// //           </Link>
// //         ))}
// //       </motion.div>

// //       {/* Add padding for content above mobile navbar */}
// //       <div className="pb-20 md:hidden"></div>
// //     </>
// //   );
// // }



// "use client";
// import { useState } from "react";
// import { Search, ShoppingCart, Menu, X, Home, UtensilsCrossed, User, Heart } from "lucide-react";

// export default function Navbar({ cart = [] }) {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [activeLink, setActiveLink] = useState("home");

//   const navLinks = [
//     { id: "home", label: "Home", href: "/" },
//     { id: "menu", label: "Menu", href: "/menu" },
//     { id: "service", label: "Service", href: "/service" },
//     { id: "about", label: "About", href: "/about" },
//   ];

//   const bottomNavItems = [
//     { id: "home", label: "Home", icon: Home, href: "/" },
//     { id: "menu", label: "Menu", icon: UtensilsCrossed, href: "/menu" },
//     { id: "favorites", label: "Favorites", icon: Heart, href: "/favorites" },
//     { id: "profile", label: "Profile", icon: User, href: "/profile" },
//   ];

//   const getTotalItems = () =>
//     Array.isArray(cart) ? cart.reduce((total, item) => total + (item.quantity || 0), 0) : 0;

//   return (
//     <>
//       {/* Desktop Navbar */}
//       <nav className="hidden lg:block sticky top-0 bg-white/90 backdrop-blur-lg shadow-sm z-50 border-b border-gray-100">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             <div className="flex items-center space-x-2 sm:space-x-3">
//               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg">
//                 <span className="text-white font-bold text-lg sm:text-xl">I</span>
//               </div>
//               <span className="text-xl sm:text-2xl font-bold text-gray-900">Indulge</span>
//             </div>

//             {/* Desktop Nav Links */}
//             <div className="flex items-center space-x-8 xl:space-x-12">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.id}
//                   href={link.href}
//                   onClick={() => setActiveLink(link.id)}
//                   className={`font-semibold hover:text-orange-500 transition-colors relative group ${
//                     activeLink === link.id ? "text-orange-500" : "text-gray-600"
//                   }`}
//                 >
//                   {link.label}
//                   <span
//                     className={`absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${
//                       activeLink === link.id ? "w-full" : "w-0 group-hover:w-full"
//                     }`}
//                   ></span>
//                 </a>
//               ))}
//             </div>

//             {/* Right Side Actions */}
//             <div className="flex items-center space-x-4">
//               <button className="hidden xl:flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-orange-300 transition-all group">
//                 <Search className="text-gray-400 group-hover:text-orange-500 transition-colors" size={18} />
//                 <span className="text-gray-400 text-sm">Search...</span>
//               </button>

//               <button className="relative p-2.5 rounded-full bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all group">
//                 <ShoppingCart className="text-gray-600 group-hover:text-orange-500 transition-colors" size={20} />
//                 {getTotalItems() > 0 && (
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
//                     {getTotalItems()}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile/Tablet Top Navbar */}
//       <nav className="lg:hidden sticky top-0 bg-white/90 backdrop-blur-lg shadow-sm z-50 border-b border-gray-100">
//         <div className="container mx-auto px-4 sm:px-6 py-4">
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             <div className="flex items-center space-x-2">
//               <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-white font-bold text-lg">HN</span>
//               </div>
//               <span className="text-xl font-bold text-gray-900">Hungry Naki</span>
//             </div>

//             {/* Right Side Actions */}
//             <div className="flex items-center space-x-3">
//               <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
//                 <Search className="text-gray-600" size={20} />
//               </button>

//               <button className="relative p-2 rounded-full hover:bg-gray-100 transition-all">
//                 <ShoppingCart className="text-gray-600" size={20} />
//                 {getTotalItems() > 0 && (
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
//                     {getTotalItems()}
//                   </span>
//                 )}
//               </button>

//               <button
//                 className="p-2 rounded-lg hover:bg-gray-100 transition-all"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               >
//                 {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu Dropdown */}
//           {mobileMenuOpen && (
//             <div className="absolute top-full left-0 w-full bg-white shadow-xl py-6 px-4 border-t animate-slide-down">
//               <div className="flex flex-col space-y-4">
//                 {navLinks.map((link) => (
//                   <a
//                     key={link.id}
//                     href={link.href}
//                     onClick={() => {
//                       setActiveLink(link.id);
//                       setMobileMenuOpen(false);
//                     }}
//                     className={`font-semibold py-3 px-4 rounded-lg transition-all ${
//                       activeLink === link.id
//                         ? "text-orange-500 bg-orange-50"
//                         : "text-gray-600 hover:bg-gray-50"
//                     }`}
//                   >
//                     {link.label}
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Mobile Bottom Navigation */}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
//         <div className="grid grid-cols-4 h-20">
//           {bottomNavItems.map((item) => (
//             <a
//               key={item.id}
//               href={item.href}
//               onClick={() => setActiveLink(item.id)}
//               className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 relative ${
//                 activeLink === item.id ? "text-orange-500" : "text-gray-400"
//               }`}
//             >
//               {/* Active Indicator */}
//               {activeLink === item.id && (
//                 <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-orange-500 rounded-b-full"></div>
//               )}

//               {/* Icon Container */}
//               <div className={`relative p-2.5 rounded-2xl transition-all ${
//                 activeLink === item.id ? "bg-orange-50 scale-110" : ""
//               }`}>
//                 <item.icon
//                   size={24}
//                   className={`transition-all ${
//                     activeLink === item.id ? "text-orange-500" : "text-gray-400"
//                   }`}
//                 />

//                 {/* Cart Badge */}
//                 {item.id === "menu" && getTotalItems() > 0 && (
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//                     {getTotalItems()}
//                   </span>
//                 )}
//               </div>

//               {/* Label */}
//               <span className={`text-xs font-medium transition-all ${
//                 activeLink === item.id ? "font-bold" : ""
//               }`}>
//                 {item.label}
//               </span>

//               {/* Active Dot */}
//               {activeLink === item.id && (
//                 <div className="absolute -bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
//               )}
//             </a>
//           ))}
//         </div>
//       </div>

//       {/* Spacer for mobile bottom nav */}
//       <div className="lg:hidden h-20"></div>

//       <style jsx>{`
//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slide-down {
//           animation: slide-down 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// }

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Home, UtensilsCrossed, User } from "lucide-react";

export default function Navbar({ cart = [] }) {
  const pathname = usePathname();

  const navLinksDesktop = [
    { id: "home", label: "Home", href: "/" },
    { id: "menu", label: "Menu", href: "/menu" },
    { id: "profile", label: "Profile", href: "/profile" },
  ];

  const bottomNavItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "menu", label: "Menu", icon: UtensilsCrossed, href: "/menu" },
    { id: "cart", label: "Cart", icon: ShoppingCart, href: "/cart" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ];

  const getTotalItems = () =>
    Array.isArray(cart)
      ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
      : 0;

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:flex sticky top-0 bg-white shadow-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">i</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Indulge</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="flex items-center space-x-8">
            {navLinksDesktop.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`font-semibold transition-colors relative ${
                  isActive(link.href)
                    ? "text-orange-500"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Only One Cart Icon on Right */}
          <div className="ml-8">
            <Link
              href="/cart"
              className="relative p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all inline-flex"
            >
              <ShoppingCart className="text-orange-600" size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="grid grid-cols-4 h-20">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 relative ${
                  active ? "text-orange-500" : "text-gray-400"
                }`}
              >
                <div
                  className={`relative p-2.5 rounded-2xl transition-all ${
                    active ? "bg-orange-50 scale-110" : ""
                  }`}
                >
                  <item.icon
                    size={24}
                    className={`transition-all ${
                      active ? "text-orange-500" : "text-gray-400"
                    }`}
                  />
                  {item.id === "cart" && getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-all ${
                    active ? "font-bold" : ""
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="lg:hidden h-20"></div>
    </>
  );
}
