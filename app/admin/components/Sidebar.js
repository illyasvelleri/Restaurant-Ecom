"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, ShoppingBag, Users, Settings, Sandwich, Package, TrendingUp, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const router = useRouter();

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

  const handleNavigation = (itemId, path) => {
    setActiveMenu(itemId);
    setIsOpen(false); // Close sidebar on mobile after clicking
    router.push(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold text-lg">
              R
            </div>
            <span className="text-xl font-bold">RestaurantPro</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id, item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeMenu === item.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-lg'
                  : 'hover:bg-slate-700'
                }`}
            >
              <item.icon size={20} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-xs px-2 py-1 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;