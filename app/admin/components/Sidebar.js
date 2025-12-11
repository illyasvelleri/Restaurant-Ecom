// app/admin/components/Sidebar.js → FINAL 2025 LUXURY ADMIN SIDEBAR

"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, ShoppingBag, Package, TrendingUp, Sandwich, 
  Users, Settings, Menu, X 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders', badge: '12', path: '/admin/orders' },
    { id: 'products', icon: Package, label: 'Products', path: '/admin/products' },
    { id: 'popular', icon: TrendingUp, label: 'Popular', path: '/admin/popular' },
    { id: 'combos', icon: Sandwich, label: 'Combos', path: '/admin/combos' },
    { id: 'customers', icon: Users, label: 'Customers', path: '/admin/customers' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleNavigation = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggler */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-3 shadow-xl border border-gray-200"
      >
        <Menu size={24} className="text-gray-900" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo + Close */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl">
              R
            </div>
            <div>
              <h2 className="text-2xl font-bold">RestaurantPro</h2>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <X size={28} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-red-600 shadow-2xl shadow-orange-500/30"
                    : "hover:bg-slate-800 hover:shadow-lg"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={22} className={isActive ? "text-white" : "text-slate-400"} />
                  <span className="font-medium text-lg">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}