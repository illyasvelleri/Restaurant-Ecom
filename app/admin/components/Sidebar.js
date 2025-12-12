// app/admin/components/Sidebar.js → FINAL MOBILE-FIRST COLORS

"use client";

import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, ShoppingBag, Package, TrendingUp, Sandwich, 
  Users, Settings, X 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
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

  const handleNavigation = (path) => {
    router.push(path);
    const mobileSidebar = document.getElementById('mobile-sidebar');
    if (mobileSidebar) mobileSidebar.classList.add('-translate-x-full');
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-2xl">
            R
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">RestaurantPro</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
        <button 
          onClick={() => {
            const mobileSidebar = document.getElementById('mobile-sidebar');
            if (mobileSidebar) mobileSidebar.classList.add('-translate-x-full');
          }}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center justify-between px-5 py-4 rounded-2xl 
                transition-all duration-300 group text-left
                ${isActive
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl"
                  : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <Icon size={22} className={isActive ? "text-white" : "text-gray-600"} />
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
    </div>
  );
}