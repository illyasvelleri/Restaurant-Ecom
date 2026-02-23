// "use client";

// import { useState } from 'react';
// import { Menu, Bell, ChevronDown, Search, Settings, LogOut } from 'lucide-react';

// const Header = ({ setIsOpen, user }) => {
//   const [showProfile, setShowProfile] = useState(false);

//   return (
//     <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
//       <div className="flex items-center gap-4 flex-1">
//         <button onClick={() => setIsOpen(true)} className="lg:hidden">
//           <Menu size={24} />
//         </button>

//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search orders, products, customers..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-4">
//         <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
//           <Bell size={20} />
//           <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//         </button>

//         <div className="relative">
//           <button 
//             onClick={() => setShowProfile(!showProfile)}
//             className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
//               {user.username[0]}
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-sm font-semibold">{user.username}</p>
//               <p className="text-xs text-gray-500 capitalize">{user.role}</p>
//             </div>
//             <ChevronDown size={16} />
//           </button>

//           {showProfile && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
//               <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
//                 <Settings size={16} />
//                 Settings
//               </button>
//               <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600">
//                 <LogOut size={16} />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// app/admin/components/Header.js → PREMIUM DARK LUXURY REDESIGN 2025 (Mobile-First)
// Inter font | Dark glass theme | Glows/Hovers | Fully Responsive

"use client";

import { useState } from 'react';
import { Menu, Bell, ChevronDown, Search, Settings, LogOut } from 'lucide-react';

const Header = ({ setIsOpen, user }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .header-glass {
          background: rgba(8,11,16,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .search-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          border-radius: 14px;
          padding: 12px 16px 12px 48px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(245,158,11,0.5);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
        }

        .search-input::placeholder { color: rgba(255,255,255,0.35); }

        .profile-btn {
          transition: all 0.25s;
        }

        .profile-btn:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.08) !important;
        }

        .profile-dropdown {
          background: rgba(10,14,22,0.98);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          backdrop-filter: blur(12px);
          animation: dbUp 0.3s ease;
        }

        .notif-bell::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 8px; height: 8px;
          background: #ef4444;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.4);
          animation: pulseRing 2s infinite;
        }
      `}</style>

      <header className="header-glass sticky top-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left: Mobile Menu + Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            className="lg:hidden p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition text-white/80"
            onClick={() => {
              // 1. Show Sidebar
              const sidebar = document.getElementById('mobile-sidebar');
              if (sidebar) sidebar.classList.remove('-translate-x-full');

              // 2. Show Overlay (Crucial fix)
              const overlay = document.querySelector('.mobile-overlay');
              if (overlay) overlay.classList.remove('hidden');
            }}
          >
            <Menu size={24} />
          </button>
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              className="search-input w-full text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Notifications */}
          <button className="relative p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-white/80 hover:text-white">
            <Bell size={20} />
            <span className="notif-bell absolute top-1.5 right-1.5" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="profile-btn flex items-center gap-3 p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition"
            >
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg shadow-lg">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{user?.username || "Admin"}</p>
                <p className="text-xs text-white/60 capitalize">{user?.role || "Admin"}</p>
              </div>

              <ChevronDown size={16} className="text-white/70" />
            </button>

            {/* Dropdown */}
            {showProfile && (
              <div className="profile-dropdown absolute right-0 mt-3 w-56 py-3 px-2 shadow-2xl">
                <button className="w-full px-4 py-3 text-left hover:bg-white/5 rounded-xl transition flex items-center gap-3 text-white/90">
                  <Settings size={18} />
                  Settings
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-white/5 rounded-xl transition flex items-center gap-3 text-red-400 hover:text-red-300">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;