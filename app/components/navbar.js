'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, Sparkles, ClipboardList, User, ShoppingCart } from 'lucide-react';

export default function Header({ cart = [] }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/menu', label: 'Menu', icon: Sparkles },
    { href: '/orders', label: 'Orders', icon: ClipboardList },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
  ];

  const isActive = (href) => pathname === href;

  const getTotalItems = () =>
    Array.isArray(cart)
      ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
      : 0;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-between items-center w-full px-8 py-4 bg-white shadow-sm rounded-b-3xl z-50 fixed top-0 left-0 right-0">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500">
            <Image
              src="/Images/logo.png"
              alt="Indulge Logo"
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-2xl font-bold text-orange-500">Indulge</div>
        </div>

        {/* Desktop Links */}
        <div className="flex gap-8 text-gray-700 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-2 relative hover:text-orange-500 transition-colors duration-200 ${
                isActive(item.href) ? 'text-orange-500' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="relative">
                {item.label}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-orange-500 transition-all duration-300 ${
                    isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </span>
              {item.label === 'Cart' && getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Add padding for content below desktop navbar */}
      <div className="md:pt-20"></div>

      {/* Mobile Bottom Navbar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-orange-500 text-white py-3 rounded-t-3xl shadow-2xl md:hidden z-50"
      >
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center text-xs font-medium transition-all duration-300 ease-in-out relative ${
              isActive(item.href) ? 'text-white' : 'text-white/70'
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-xl ${
                isActive(item.href) ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <div className="relative">
                <item.icon
                  className={`h-6 w-6 ${
                    isActive(item.href) ? 'text-white' : 'text-white/70'
                  }`}
                />
                {item.label === 'Cart' && getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </div>
            </motion.div>
            <span
              className={`mt-1 text-[10px] ${
                isActive(item.href) ? 'font-semibold' : 'text-white/50'
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </motion.div>

      {/* Add padding for content above mobile navbar */}
      <div className="pb-20 md:hidden"></div>
    </>
  );
}
