// // app/admin/components/Sidebar.js → FINAL MOBILE-FIRST COLORS

// "use client";

// import { usePathname, useRouter } from 'next/navigation';
// import { 
//   Home, ShoppingBag, Package, TrendingUp, Sandwich, 
//   Users, Settings, X 
// } from 'lucide-react';

// export default function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const menuItems = [
//     { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
//     { id: 'orders', icon: ShoppingBag, label: 'Orders', badge: '12', path: '/admin/orders' },
//     { id: 'users', icon: ShoppingBag, label: 'Users', path: '/admin/users' },
//     { id: 'products', icon: Package, label: 'Products', path: '/admin/products' },
//     { id: 'popular', icon: TrendingUp, label: 'Popular', path: '/admin/popular' },
//     { id: 'combos', icon: Sandwich, label: 'Combos', path: '/admin/combos' },
//     { id: 'pricing-rules', icon: Sandwich, label: 'Pricing-Rules', path: '/admin/pricing-rules' },
//     { id: 'customers', icon: Users, label: 'Customers', path: '/admin/customers' },
//     // { id: 'inventoryLog', icon: TrendingUp, label: 'Inventory Log', path: '/admin/inventoryLog' },
//     { id: 'analytics', icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
//     { id: 'settings', icon: Settings, label: 'Settings', path: '/admin/settings' },
//   ];

//   const handleNavigation = (path) => {
//     router.push(path);
//     const mobileSidebar = document.getElementById('mobile-sidebar');
//     if (mobileSidebar) mobileSidebar.classList.add('-translate-x-full');
//   };

//   return (
//     <div className="h-full flex flex-col bg-white border-r border-gray-200">
//       <div className="flex items-center justify-between p-6 border-b border-gray-100">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-2xl">
//             R
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">RestaurantPro</h2>
//             <p className="text-xs text-gray-500">Admin Panel</p>
//           </div>
//         </div>
//         <button 
//           onClick={() => {
//             const mobileSidebar = document.getElementById('mobile-sidebar');
//             if (mobileSidebar) mobileSidebar.classList.add('-translate-x-full');
//           }}
//           className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
//         >
//           <X size={24} className="text-gray-600" />
//         </button>
//       </div>

//       <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = pathname === item.path;
//           return (
//             <button
//               key={item.id}
//               onClick={() => handleNavigation(item.path)}
//               className={`
//                 w-full flex items-center justify-between px-5 py-4 rounded-2xl 
//                 transition-all duration-300 group text-left
//                 ${isActive
//                   ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl"
//                   : "hover:bg-gray-100 text-gray-700"
//                 }
//               `}
//             >
//               <div className="flex items-center gap-4">
//                 <Icon size={22} className={isActive ? "text-white" : "text-gray-600"} />
//                 <span className="font-medium text-lg">{item.label}</span>
//               </div>
//               {item.badge && (
//                 <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full">
//                   {item.badge}
//                 </span>
//               )}
//             </button>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }
// app/admin/components/Sidebar.js → PREMIUM DARK LUXURY REDESIGN 2025 (Mobile-First)
// Inter font | Dark glass theme | Glows/Hovers | Fully Responsive + Slide-in Mobile
// FIXED: Mobile menu items now fully visible & scrollable
"use client";
import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingBag, Package, TrendingUp, Sandwich, Users, Settings, X, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { id: 'users', icon: ShoppingBag, label: 'Users', path: '/admin/users' },
    { id: 'customers', icon: Users, label: 'Customers', path: '/admin/customers' },
    { id: 'products', icon: Package, label: 'Products', path: '/admin/products' },
    { id: 'popular', icon: TrendingUp, label: 'Popular', path: '/admin/popular' },
    { id: 'combos', icon: Sandwich, label: 'Combos', path: '/admin/combos' },
    { id: 'pricing-rules', icon: TrendingUp, label: 'Pricing Rules', path: '/admin/pricing-rules' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const closeSidebar = () => {
    document.getElementById('mobile-sidebar')?.classList.add('-translate-x-full');
    document.querySelector('.mobile-overlay')?.classList.add('hidden');
  };

  const handleNavigation = (path) => {
    router.push(path);
    closeSidebar();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0a0e16] to-[#080b10] border-r border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0e16] z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xl">R</div>
          <div>
            <h2 className="text-xl font-bold text-white">RestaurantPro</h2>
            <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase">Admin</p>
          </div>
        </div>
        <button onClick={closeSidebar} className="lg:hidden p-2 text-white/50 hover:text-white"><X size={20}/></button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group
                ${isActive ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}