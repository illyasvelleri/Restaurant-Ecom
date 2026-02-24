// // admin/role/components/StaffOrderView.js — FULLY RESPONSIVE, MOBILE-FIRST & PC-LUXURY

// "use client";

// import { useState, useEffect } from 'react';
// import {
//   ShoppingBag, Clock, Truck, CheckCircle2,
//   Search, Download, Eye, Phone, MapPin,
//   Filter, ChevronDown, AlertCircle, X
// } from 'lucide-react';
// import OrderModal from '../../role/components/StaffOrderModel';
// import toast from 'react-hot-toast';

// // ─────────────────────────────────────────────────────────
// // STATUS BADGE — tooltip-like, dynamic count, clickable
// // ─────────────────────────────────────────────────────────
// function StatusBadge({ status, count, isActive, onClick }) {
//   const map = {
//     all: { label: 'All Orders', bg: "rgba(255,255,255,0.08)", color: "#fff", border: "rgba(255,255,255,0.15)" },
//     pending: { label: 'Pending', bg: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "rgba(245,158,11,0.3)" },
//     confirmed: { label: 'Confirmed', bg: "rgba(16,185,129,0.15)", color: "#10b981", border: "rgba(16,185,129,0.3)" },
//     preparing: { label: 'Preparing', bg: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "rgba(59,130,246,0.3)" },
//     "on-the-way": { label: 'On The Way', bg: "rgba(139,92,246,0.15)", color: "#8b5cf6", border: "rgba(139,92,246,0.3)" },
//     delivered: { label: 'Delivered', bg: "rgba(16,185,129,0.15)", color: "#10b981", border: "rgba(16,185,129,0.3)" },
//     cancelled: { label: 'Cancelled', bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
//   };
//   const c = map[status] || { label: status, bg: "rgba(255,255,255,0.05)", color: "#fff", border: "rgba(255,255,255,0.1)" };

//   return (
//     <button
//       onClick={onClick}
//       className={`
//         flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all
//         border hover:scale-105 active:scale-95 whitespace-nowrap min-w-[fit-content]
//         ${isActive ? 'ring-2 ring-offset-2 ring-offset-[#080b10] ring-white/30 scale-105' : 'hover:bg-white/5'}
//       `}
//       style={{
//         background: c.bg,
//         color: c.color,
//         borderColor: c.border,
//       }}
//     >
//       <span>{c.label}</span>
//       <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold min-w-[1.6rem] text-center">
//         {count}
//       </span>
//     </button>
//   );
// }

// // ─────────────────────────────────────────────────────────
// // PULSE DOT
// // ─────────────────────────────────────────────────────────
// function PulseDot({ color = "#f59e0b", size = 8 }) {
//   return (
//     <span style={{ position: "relative", display: "inline-block", width: size, height: size }}>
//       <span style={{
//         position: "absolute", inset: 0, borderRadius: "50%",
//         background: color, animation: "pulse 2s infinite ease-in-out",
//       }} />
//       <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
//     </span>
//   );
// }

// const statusColumns = [
//   { id: 'all', title: 'All Orders', accent: "#ffffff" },
//   { id: 'pending', title: 'Pending', accent: "#f59e0b" },
//   { id: 'confirmed', title: 'Confirmed', accent: "#10b981" },
//   { id: 'preparing', title: 'Preparing', accent: "#3b82f6" },
//   { id: 'on-the-way', title: 'On The Way', accent: "#8b5cf6" },
//   { id: 'delivered', title: 'Delivered', accent: "#10b981" },
//   { id: 'cancelled', title: 'Cancelled', accent: "#ef4444" },
// ];

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [activeStatusFilter, setActiveStatusFilter] = useState('all');

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       let url = '/api/staff-order-view';
//       const res = await fetch(url);
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       toast.error('Failed to load orders');
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter orders by search + active status
//   const filteredOrders = orders.filter(order => {
//     const matchesSearch =
//       searchQuery === "" ||
//       order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.phone?.includes(searchQuery);

//     const matchesStatus =
//       activeStatusFilter === 'all' || order.status === activeStatusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   // Count per status (for badges)
//   const statusCounts = statusColumns.reduce((acc, col) => {
//     if (col.id === 'all') {
//       acc[col.id] = orders.length;
//     } else {
//       acc[col.id] = orders.filter(o => o.status === col.id).length;
//     }
//     return acc;
//   }, {});

//   const exportCSV = () => {
//     const csv = [
//       ['Order ID', 'Customer', 'Phone', 'Branch', 'Status', 'Total', 'Date'],
//       ...filteredOrders.map(o => [
//         o.orderId || o._id,
//         o.customerName,
//         o.phone,
//         o.branchId?.name || '—',
//         o.status,
//         o.total,
//         new Date(o.createdAt).toLocaleString()
//       ])
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

//         .orders-page {
//           font-family: 'Inter', system-ui, sans-serif;
//           background: #080b10;
//           color: white;
//           min-height: 100vh;
//           padding-bottom: env(safe-area-inset-bottom);
//         }

//         .status-scroll {
//           display: flex;
//           overflow-x: auto;
//           gap: 10px;
//           padding: 12px 0;
//           scrollbar-width: none;
//           -webkit-overflow-scrolling: touch;
//           justify-content: flex-start;
//         }

//         .status-scroll::-webkit-scrollbar {
//           display: none;
//         }

//         @media (min-width: 1024px) {
//           .status-scroll {
//             justify-content: center;
//             max-width: 1200px;
//             margin: 0 auto;
//           }
//         }

//         .order-card {
//           background: rgba(255,255,255,0.03);
//           border: 1px solid rgba(255,255,255,0.08);
//           border-radius: 16px;
//           padding: 16px;
//           transition: all 0.25s;
//           cursor: pointer;
//         }

//         .order-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 12px 32px rgba(0,0,0,0.4);
//         }

//         @media (max-width: 640px) {
//           .order-card {
//             padding: 14px;
//           }
//           .order-card p {
//             font-size: 0.95rem;
//           }
//         }

//         .topbar {
//           background: #0a0e16;
//           backdrop-filter: blur(20px);
//           border-bottom: 1px solid rgba(255,255,255,0.05);
//         }

//         .search-input {
//           background: rgba(255,255,255,0.05);
//           border: 1px solid rgba(255,255,255,0.1);
//           border-radius: 12px;
//           padding: 12px 16px 12px 48px;
//           color: white;
//           font-size: 0.95rem;
//         }

//         .search-input::placeholder {
//           color: rgba(255,255,255,0.4);
//         }

//         .container {
//           max-width: 1400px;
//           margin: 0 auto;
//           padding: 0 16px;
//         }

//         @media (min-width: 768px) {
//           .container {
//             padding: 0 24px;
//           }
//         }
//       `}</style>

//       <div className="orders-page">

//         {/* ── TOPBAR ── Responsive: full-width search on mobile */}
//         <div className="topbar sticky top-0 z-50 px-4 py-4 shadow-lg">
//           <div className="container flex items-center justify-between">
//             <h1 className="text-xl sm:text-2xl font-bold">Orders</h1>
//             <button
//               onClick={exportCSV}
//               className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 transition"
//               title="Export CSV"
//             >
//               <Download size={20} />
//             </button>
//           </div>

//           <div className="mt-4 container">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//                 placeholder="Search order ID, name, phone..."
//                 className="search-input w-full focus:outline-none focus:ring-2 focus:ring-amber-500/40"
//               />
//             </div>
//           </div>
//         </div>

//         {/* ── HORIZONTAL SCROLLABLE STATUS BADGES ── Centered on PC, scroll on mobile */}
//         <div className="px-4 pt-3 pb-2 overflow-hidden">
//           <div className="status-scroll">
//             {statusColumns.map(col => (
//               <StatusBadge
//                 key={col.id}
//                 status={col.id}
//                 count={statusCounts[col.id] || 0}
//                 isActive={activeStatusFilter === col.id}
//                 onClick={() => setActiveStatusFilter(col.id)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* ── ORDERS LIST ── Responsive grid */}
//         <div className="container pb-24">
//           {loading ? (
//             <div className="space-y-4 sm:space-y-6">
//               {[1, 2, 3, 4, 5].map(i => (
//                 <div key={i} className="h-32 sm:h-36 bg-white/5 rounded-2xl animate-pulse" />
//               ))}
//             </div>
//           ) : filteredOrders.length === 0 ? (
//             <div className="text-center py-20 text-white/50">
//               No orders found for this filter
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {filteredOrders.map(order => (
//                 <div
//                   key={order._id}
//                   className="order-card"
//                   onClick={() => setSelectedOrder(order)}
//                 >
//                   <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
//                     <div>
//                       <p className="font-medium text-white text-base sm:text-lg">
//                         #{order.orderId || order._id.slice(-6)}
//                       </p>
//                       <p className="text-sm text-white/70 mt-1 truncate">{order.customerName}</p>
//                     </div>
//                     <div className="self-start sm:self-center">
//                       <StatusBadge status={order.status} count={null} isActive={false} />
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 text-sm text-white/70 mb-3">
//                     <Phone size={16} className="flex-shrink-0" />
//                     <span className="truncate">{order.phone}</span>
//                   </div>

//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm pt-2 border-t border-white/5">
//                     <span className="font-bold text-amber-400 text-base">
//                       ₹{order.total?.toFixed(2)}
//                     </span>
//                     <span className="text-white/60 text-xs sm:text-sm">
//                       {new Date(order.createdAt).toLocaleString([], {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         day: 'numeric',
//                         month: 'short'
//                       })}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {selectedOrder && (
//           <OrderModal
//             order={selectedOrder}
//             onClose={() => setSelectedOrder(null)}
//             onUpdate={fetchOrders}
//           />
//         )}
//       </div>
//     </>
//   );
// }


// admin/role/components/StaffOrderView.js — FULLY RESPONSIVE + LOGOUT ADDED PERFECTLY

"use client";

import { useState, useEffect } from 'react';
import {
  ShoppingBag, Clock, Truck, CheckCircle2,
  Search, Download, Eye, Phone, MapPin,
  Filter, ChevronDown, AlertCircle, X, LogOut
} from 'lucide-react';
import OrderModal from '../../role/components/StaffOrderModel';
import toast from 'react-hot-toast';
import { signOut } from "next-auth/react";

// ─────────────────────────────────────────────────────────
// STATUS BADGE — tooltip-like, dynamic count, clickable
// ─────────────────────────────────────────────────────────
function StatusBadge({ status, count, isActive, onClick }) {
  const map = {
    all: { label: 'All Orders', bg: "rgba(255,255,255,0.08)", color: "#fff", border: "rgba(255,255,255,0.15)" },
    pending: { label: 'Pending', bg: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "rgba(245,158,11,0.3)" },
    confirmed: { label: 'Confirmed', bg: "rgba(16,185,129,0.15)", color: "#10b981", border: "rgba(16,185,129,0.3)" },
    preparing: { label: 'Preparing', bg: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "rgba(59,130,246,0.3)" },
    "on-the-way": { label: 'On The Way', bg: "rgba(139,92,246,0.15)", color: "#8b5cf6", border: "rgba(139,92,246,0.3)" },
    delivered: { label: 'Delivered', bg: "rgba(16,185,129,0.15)", color: "#10b981", border: "rgba(16,185,129,0.3)" },
    cancelled: { label: 'Cancelled', bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
  };
  const c = map[status] || { label: status, bg: "rgba(255,255,255,0.05)", color: "#fff", border: "rgba(255,255,255,0.1)" };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all
        border hover:scale-105 active:scale-95 whitespace-nowrap min-w-[fit-content]
        ${isActive ? 'ring-2 ring-offset-2 ring-offset-[#080b10] ring-white/30 scale-105' : 'hover:bg-white/5'}
      `}
      style={{
        background: c.bg,
        color: c.color,
        borderColor: c.border,
      }}
    >
      <span>{c.label}</span>
      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold min-w-[1.6rem] text-center">
        {count}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// PULSE DOT
// ─────────────────────────────────────────────────────────
function PulseDot({ color = "#f59e0b", size = 8 }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: size, height: size }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: color, animation: "pulse 2s infinite ease-in-out",
      }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
    </span>
  );
}

const statusColumns = [
  { id: 'all', title: 'All Orders', accent: "#ffffff" },
  { id: 'pending', title: 'Pending', accent: "#f59e0b" },
  { id: 'confirmed', title: 'Confirmed', accent: "#10b981" },
  { id: 'preparing', title: 'Preparing', accent: "#3b82f6" },
  { id: 'on-the-way', title: 'On The Way', accent: "#8b5cf6" },
  { id: 'delivered', title: 'Delivered', accent: "#10b981" },
  { id: 'cancelled', title: 'Cancelled', accent: "#ef4444" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = '/api/staff-order-view';
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by search + active status
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      searchQuery === "" ||
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone?.includes(searchQuery);

    const matchesStatus =
      activeStatusFilter === 'all' || order.status === activeStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Count per status (for badges)
  const statusCounts = statusColumns.reduce((acc, col) => {
    if (col.id === 'all') {
      acc[col.id] = orders.length;
    } else {
      acc[col.id] = orders.filter(o => o.status === col.id).length;
    }
    return acc;
  }, {});

  const exportCSV = () => {
    const csv = [
      ['Order ID', 'Customer', 'Phone', 'Branch', 'Status', 'Total', 'Date'],
      ...filteredOrders.map(o => [
        o.orderId || o._id,
        o.customerName,
        o.phone,
        o.branchId?.name || '—',
        o.status,
        o.total,
        new Date(o.createdAt).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
    toast.success("Logged out successfully", {
      icon: '👋',
      duration: 3000,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .orders-page {
          font-family: 'Inter', system-ui, sans-serif;
          background: #080b10;
          color: white;
          min-height: 100vh;
          padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
          position: relative;
        }

        .status-scroll {
          display: flex;
          overflow-x: auto;
          gap: 10px;
          padding: 12px 0;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          justify-content: flex-start;
        }

        .status-scroll::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 1024px) {
          .status-scroll {
            justify-content: center;
            max-width: 1200px;
            margin: 0 auto;
          }
        }

        .order-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.25s;
          cursor: pointer;
        }

        .order-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }

        @media (max-width: 640px) {
          .order-card {
            padding: 14px;
          }
          .order-card p {
            font-size: 0.95rem;
          }
        }

        .topbar {
          background: #0a0e16;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .search-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px 12px 48px;
          color: white;
          font-size: 0.95rem;
        }

        .search-input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 16px;
        }

        @media (min-width: 768px) {
          .container {
            padding: 0 24px;
          }
        }

        /* Floating Logout Button (mobile) */
        .logout-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 100;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
          transition: all 0.3s ease;
        }

        .logout-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.5);
        }

        @media (min-width: 640px) {
          .logout-fab {
            display: none;
          }
        }
      `}</style>

      <div className="orders-page">

        {/* ── TOPBAR ── Responsive */}
        <div className="topbar sticky top-0 z-50 px-4 py-4 shadow-lg">
          <div className="container flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">Orders</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={exportCSV}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 transition hidden sm:block"
                title="Export CSV"
              >
                <Download size={20} />
              </button>

              {/* Desktop Logout */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-all text-sm font-bold uppercase tracking-wider"
              >
                Logout
                <LogOut size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 container">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search order ID, name, phone..."
                className="search-input w-full focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          </div>
        </div>

        {/* ── HORIZONTAL SCROLLABLE STATUS BADGES ── */}
        <div className="px-4 pt-3 pb-2 overflow-hidden">
          <div className="status-scroll">
            {statusColumns.map(col => (
              <StatusBadge
                key={col.id}
                status={col.id}
                count={statusCounts[col.id] || 0}
                isActive={activeStatusFilter === col.id}
                onClick={() => setActiveStatusFilter(col.id)}
              />
            ))}
          </div>
        </div>

        {/* ── ORDERS LIST ── */}
        <div className="container pb-32 sm:pb-24">
          {loading ? (
            <div className="space-y-4 sm:space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-32 sm:h-36 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 text-white/50">
              No orders found for this filter
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredOrders.map(order => (
                <div
                  key={order._id}
                  className="order-card"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                    <div>
                      <p className="font-medium text-white text-base sm:text-lg">
                        #{order.orderId || order._id.slice(-6)}
                      </p>
                      <p className="text-sm text-white/70 mt-1 truncate">{order.customerName}</p>
                    </div>
                    <div className="self-start sm:self-center">
                      <StatusBadge status={order.status} count={null} isActive={false} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-white/70 mb-3">
                    <Phone size={16} className="flex-shrink-0" />
                    <span className="truncate">{order.phone}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm pt-2 border-t border-white/5">
                    <span className="font-bold text-amber-400 text-base">
                      ₹{order.total?.toFixed(2)}
                    </span>
                    <span className="text-white/60 text-xs sm:text-sm">
                      {new Date(order.createdAt).toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FLOATING LOGOUT BUTTON (Mobile only) ── */}
        <button
          onClick={handleLogout}
          className="logout-fab sm:hidden"
          title="Logout"
        >
          <LogOut size={24} />
        </button>

        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdate={fetchOrders}
          />
        )}
      </div>
    </>
  );
}