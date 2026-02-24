// app/admin/components/AdminClientWrapper.js → FINAL FIXED & RESPONSIVE

// "use client";

// import Sidebar from "./Sidebar";

// export default function AdminClientWrapper({ children }) {
//   return (
//     <div className="flex min-h-screen">

//       {/* DESKTOP SIDEBAR — ONLY VISIBLE ON LG+ */}
//       <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-72">
//         <Sidebar />
//       </div>

//       {/* MAIN CONTENT — ADJUSTS AUTOMATICALLY */}
//       <div className="flex-1 w-full lg:pl-72">  {/* ← THIS IS THE FIX */}

//         {/* MOBILE HEADER */}
//         <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
//           <button
//             onClick={() => {
//               const sidebar = document.getElementById('mobile-sidebar');
//               const overlay = document.querySelector('.mobile-overlay');
//               sidebar?.classList.toggle('-translate-x-full');
//               overlay?.classList.toggle('hidden');
//             }}
//             className="p-3 hover:bg-gray-100 rounded-xl transition"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//           <div className="text-right">
//             <h1 className="text-xl font-bold text-gray-900">RestaurantPro</h1>
//             <p className="text-xs text-gray-500">Admin Panel</p>
//           </div>
//         </header>

//         {/* DESKTOP HEADER */}
//         <header className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-5">
//           <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//           <div className="flex items-center gap-4">
//             <span className="text-sm text-gray-600">Welcome back, Admin</span>
//             <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
//               A
//             </div>
//           </div>
//         </header>

//         {/* PAGE CONTENT */}
//         <main className="min-h-screen bg-gray-50">
//           {children}
//         </main>
//       </div>

//       {/* MOBILE SIDEBAR */}
//       <div 
//         id="mobile-sidebar"
//         className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white transform -translate-x-full lg:hidden transition-transform duration-300 ease-in-out"
//       >
//         <Sidebar />
//       </div>

//       {/* MOBILE OVERLAY */}
//       <div 
//         className="mobile-overlay fixed inset-0 bg-black/50 z-40 hidden lg:hidden"
//         onClick={() => {
//           document.getElementById('mobile-sidebar')?.classList.add('-translate-x-full');
//           document.querySelector('.mobile-overlay')?.classList.add('hidden');
//         }}
//       />
//     </div>
//   );
// }




"use client";

import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Added useState

export default function AdminClientWrapper({ children, role, userId }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // 1. ADD THIS: This stops the Hydration Error by waiting for the browser
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isStaff = ["staff", "manager", "waiter", "chef"].includes(role);
  const allowedPath = `/admin/role/${userId}`;

  // CLIENT-SIDE GUARD: Prevents the infinite redirect loop
  useEffect(() => {
    if (mounted && isStaff && pathname !== allowedPath) {
      router.replace(allowedPath);
    }
  }, [mounted, pathname, isStaff, userId, router, allowedPath]);

  // 2. ADD THIS: If not mounted, return a simple empty div to match server
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  // STAFF VIEW: No Sidebar, Black Background
  if (isStaff) {
    return (
      <div className="min-h-screen bg-[#080b10]">
        <main className="w-full">
          {children}
        </main>
      </div>
    );
  }

  // ADMIN VIEW: Full Sidebar Layout
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      <div 
        className="mobile-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] hidden lg:hidden"
        onClick={() => {
          document.getElementById('mobile-sidebar')?.classList.add('-translate-x-full');
          document.querySelector('.mobile-overlay')?.classList.add('hidden');
        }}
      />

      {/* Sliding Mobile Sidebar */}
      <aside 
        id="mobile-sidebar"
        className="fixed inset-y-0 left-0 z-[100] w-[280px] transform -translate-x-full lg:hidden transition-transform duration-300 ease-in-out"
      >
        <Sidebar />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-40 w-72 h-screen">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <header className="lg:hidden sticky top-0 z-30 bg-[#0a0e16] text-white px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              document.getElementById('mobile-sidebar')?.classList.remove('-translate-x-full');
              document.querySelector('.mobile-overlay')?.classList.remove('hidden');
            }}
            className="p-2 bg-white/5 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold">RestaurantPro</span>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

// // app/admin/components/AdminClientWrapper.js → FINAL FIXED & RESPONSIVE
// "use client";

// import Sidebar from "./Sidebar";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function AdminClientWrapper({ children, role, userId }) {
//   const pathname = usePathname();
//   const router = useRouter();
  
//   const isStaff = ["staff", "manager", "waiter", "chef"].includes(role);
//   const allowedPath = `/admin/role/${userId}`;

//   // CLIENT-SIDE GUARD: Prevents the infinite redirect loop
//   useEffect(() => {
//     if (isStaff && pathname !== allowedPath) {
//       router.replace(allowedPath);
//     }
//   }, [pathname, isStaff, userId, router, allowedPath]);

//   // STAFF VIEW: No Sidebar, Black Background
//   if (isStaff) {
//     return (
//       <div className="min-h-screen bg-[#080b10]">
//         <main className="w-full">
//           {children}
//         </main>
//       </div>
//     );
//   }

//   // ADMIN VIEW: Full Sidebar Layout
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Mobile Overlay */}
//       <div 
//         className="mobile-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] hidden lg:hidden"
//         onClick={() => {
//           document.getElementById('mobile-sidebar')?.classList.add('-translate-x-full');
//           document.querySelector('.mobile-overlay')?.classList.add('hidden');
//         }}
//       />

//       {/* Sliding Mobile Sidebar */}
//       <aside 
//         id="mobile-sidebar"
//         className="fixed inset-y-0 left-0 z-[100] w-[280px] transform -translate-x-full lg:hidden transition-transform duration-300 ease-in-out"
//       >
//         <Sidebar />
//       </aside>

//       {/* Desktop Sidebar */}
//       <aside className="hidden lg:block fixed inset-y-0 left-0 z-40 w-72 h-screen">
//         <Sidebar />
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
//         <header className="lg:hidden sticky top-0 z-30 bg-[#0a0e16] text-white px-5 py-4 flex items-center justify-between">
//           <button
//             onClick={() => {
//               document.getElementById('mobile-sidebar')?.classList.remove('-translate-x-full');
//               document.querySelector('.mobile-overlay')?.classList.remove('hidden');
//             }}
//             className="p-2 bg-white/5 rounded-lg transition"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//           <span className="font-bold">RestaurantPro</span>
//         </header>

//         <main className="flex-1">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }