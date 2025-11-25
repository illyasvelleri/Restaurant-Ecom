// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ShoppingCart, Home, UtensilsCrossed, Flame, User } from "lucide-react"; // 🔥 Flame for Popular

// export default function Navbar({ cart = [] }) {
//     const pathname = usePathname();

//     const navLinksDesktop = [
//         { id: "home", label: "Home", href: "/" },
//         { id: "menu", label: "Menu", href: "/menu" },
//         { id: "popular", label: "Popular", href: "/popular" },
//         { id: "profile", label: "Profile", href: "/profile" },
//     ];

//     const bottomNavItems = [
//         { id: "home", label: "Home", icon: Home, href: "/" },
//         { id: "menu", label: "Menu", icon: UtensilsCrossed, href: "/menu" },
//         { id: "popular", label: "Popular", icon: Flame, href: "/popular" }, // 🔥 New Popular tab
//         { id: "profile", label: "Profile", icon: User, href: "/profile" },
//     ];

//     const getTotalItems = () =>
//         Array.isArray(cart)
//             ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
//             : 0;

//     const isActive = (href) => pathname === href;

//     return (
//         <>
//             {/* ✅ Desktop Navbar */}
//             <nav className="hidden lg:flex sticky top-0 bg-white shadow-sm z-50 border-b border-gray-100">
//                 <div className="container mx-auto px-8 py-4 flex items-center justify-between">
//                     {/* Logo */}
//                     <div className="flex items-center space-x-3">
//                         <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg">
//                             <span className="text-white font-bold text-xl">i</span>
//                         </div>
//                         <span className="text-2xl font-bold text-gray-900">Indulge</span>
//                     </div>

//                     {/* Desktop Nav Links */}
//                     <div className="flex items-center space-x-8">
//                         {navLinksDesktop.map((link) => (
//                             <Link
//                                 key={link.id}
//                                 href={link.href}
//                                 className={`font-semibold transition-colors relative ${isActive(link.href)
//                                         ? "text-orange-500"
//                                         : "text-gray-600 hover:text-orange-500"
//                                     }`}
//                             >
//                                 {link.label}
//                                 {isActive(link.href) && (
//                                     <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 rounded-full"></span>
//                                 )}
//                             </Link>
//                         ))}
//                     </div>

//                     {/* Cart Icon Right */}
//                     <div className="ml-8">
//                         <Link
//                             href="/cart"
//                             className="relative p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all inline-flex"
//                         >
//                             <ShoppingCart className="text-orange-600" size={24} />
//                             {getTotalItems() > 0 && (
//                                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
//                                     {getTotalItems()}
//                                 </span>
//                             )}
//                         </Link>
//                     </div>
//                 </div>
//             </nav>

//             {/* ✅ Mobile Top Navbar (Logo Left + Cart Right) */}
//             <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md border-b border-gray-100 z-50">
//                 <div className="flex items-center justify-between px-5 py-3">
//                     {/* Logo */}
//                     <div className="flex items-center space-x-2">
//                         <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
//                             <span className="text-white font-bold text-lg">i</span>
//                         </div>
//                         <span className="text-xl font-bold text-gray-900">Indulge</span>
//                     </div>

//                     {/* Cart Icon on Mobile Top Right */}
//                     <Link
//                         href="/cart"
//                         className="relative p-2.5 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all inline-flex"
//                     >
//                         <ShoppingCart className="text-orange-600" size={22} />
//                         {getTotalItems() > 0 && (
//                             <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//                                 {getTotalItems()}
//                             </span>
//                         )}
//                     </Link>
//                 </div>
//             </div>

//             {/* ✅ Mobile Bottom Navigation */}
//             <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
//                 <div className="grid grid-cols-4 h-20">
//                     {bottomNavItems.map((item) => {
//                         const active = isActive(item.href);
//                         return (
//                             <Link
//                                 key={item.id}
//                                 href={item.href}
//                                 className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 relative ${active ? "text-orange-500" : "text-gray-400"
//                                     }`}
//                             >
//                                 <div
//                                     className={`relative p-2.5 rounded-2xl transition-all ${active ? "bg-orange-50 scale-110" : ""
//                                         }`}
//                                 >
//                                     <item.icon
//                                         size={24}
//                                         className={`transition-all ${active ? "text-orange-500" : "text-gray-400"
//                                             }`}
//                                     />
//                                 </div>
//                                 <span
//                                     className={`text-xs font-medium transition-all ${active ? "font-bold" : ""
//                                         }`}
//                                 >
//                                     {item.label}
//                                 </span>
//                                 {active && (
//                                     <div className="absolute -bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
//                                 )}
//                             </Link>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Spacers for mobile header & footer */}
//             <div className="lg:hidden h-32"></div>
//         </>
//     );
// }



"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, Home, UtensilsCrossed, Flame, User, ChevronDown, LogOut } from "lucide-react";

export default function Navbar({ cart = [] }) {
  const pathname = usePathname();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navLinksDesktop = [
    { id: "home", label: "Home", href: "/" },
    { id: "menu", label: "Menu", href: "/user/menu" },
    { id: "popular", label: "Popular", href: "/user/popular" },
    { id: "combos", label: "Combos", href: "/user/combos" },
    // { id: "profile", label: "Profile", href: "/profile" },
  ];

  const bottomNavItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "menu", label: "Menu", icon: UtensilsCrossed, href: "/menu" },
    { id: "popular", label: "Popular", icon: Flame, href: "/popular" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ];

  const getTotalItems = () =>
    Array.isArray(cart)
      ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
      : 0;

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* ✅ Desktop Navbar */}
      <nav className="hidden lg:flex sticky top-0 bg-white shadow-md z-50 border-b border-gray-100 transition-shadow duration-300">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">i</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Indulge</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="flex items-center space-x-6">
            {navLinksDesktop.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`relative font-medium text-sm tracking-wide transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-orange-600 bg-orange-50 px-3 py-2 rounded-lg"
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* User Profile and Cart */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 hover:bg-orange-50 rounded-lg transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                  U
                </div>
                <span className="hidden xl:inline text-sm font-medium text-gray-700">User</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <button
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-orange-50 flex items-center gap-2 text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/cart"
              className="relative p-2.5 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all"
            >
              <ShoppingCart className="text-orange-600" size={22} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md border-b border-gray-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">i</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Indulge</span>
          </Link>

          {/* User Profile and Cart */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-1 p-2 hover:bg-orange-50 rounded-lg transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                  U
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <button
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-orange-50 flex items-center gap-2 text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/cart"
              className="relative p-2.5 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all"
            >
              <ShoppingCart className="text-orange-600" size={22} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Bottom Navigation (Unchanged) */}
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
                  className={`relative p-2.5 rounded-2xl transition-all ${active ? "bg-orange-50 scale-110" : ""}`}
                >
                  <item.icon
                    size={24}
                    className={`transition-all ${active ? "text-orange-500" : "text-gray-400"}`}
                  />
                </div>
                <span
                  className={`text-xs font-medium transition-all ${active ? "font-bold" : ""}`}
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

      {/* Spacers for mobile header & footer */}
      <div className="lg:hidden h-32"></div>
    </>
  );
}
