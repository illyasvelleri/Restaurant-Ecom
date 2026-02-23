// app/admin/orders/page.js → PREMIUM DARK REDESIGN (matching dashboard style)
// // FONTS CHANGED TO STANDARD READABLE ADMIN PANEL FONTS (Inter + system fallback)
// // ALL OTHER LOGIC & FUNCTIONALITY PRESERVED

// "use client";

// import { useState, useEffect } from 'react';
// import {
//   ShoppingBag, Clock, Truck, CheckCircle2,
//   Search, Download, Eye, Phone, MapPin,
//   Filter, ChevronDown, AlertCircle, X
// } from 'lucide-react';
// import OrderModal from '../components/OrderModal';
// import AdminFooter from '../../components/footer';
// import toast from 'react-hot-toast';

// // ─────────────────────────────────────────────────────────
// // STATUS BADGE — copied from dashboard (exact same)
// // ─────────────────────────────────────────────────────────
// function StatusBadge({ status }) {
//   const map = {
//     delivered:    { bg: "rgba(16,185,129,0.12)", color: "#10b981", border: "rgba(16,185,129,0.25)", label: "Delivered" },
//     preparing:    { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "rgba(59,130,246,0.25)", label: "Preparing" },
//     pending:      { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "rgba(245,158,11,0.25)", label: "Pending" },
//     confirmed:    { bg: "rgba(16,185,129,0.1)",  color: "#34d399", border: "rgba(52,211,153,0.25)", label: "Confirmed" },
//     "on-the-way": { bg: "rgba(139,92,246,0.12)", color: "#8b5cf6", border: "rgba(139,92,246,0.25)", label: "On the Way" },
//     cancelled:    { bg: "rgba(239,68,68,0.10)",  color: "#ef4444", border: "rgba(239,68,68,0.22)", label: "Cancelled" },
//   };
//   const c = map[status] || { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.1)", label: status };
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center",
//       padding: "4px 12px", borderRadius: 999,
//       background: c.bg, border: `1px solid ${c.border}`,
//       fontFamily: "'Inter', system-ui, sans-serif",
//       fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase",
//       color: c.color, whiteSpace: "nowrap",
//     }}>
//       {c.label}
//     </span>
//   );
// }

// // ─────────────────────────────────────────────────────────
// // PULSE DOT — copied from dashboard
// // ─────────────────────────────────────────────────────────
// function PulseDot({ color = "#10b981", size = 8 }) {
//   return (
//     <span style={{ position: "relative", display: "inline-block", width: size, height: size, flexShrink: 0 }}>
//       <span style={{
//         position: "absolute", inset: 0, borderRadius: "50%",
//         background: color, animation: "dbPulse 2s ease-in-out infinite",
//       }} />
//       <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
//     </span>
//   );
// }

// // ─────────────────────────────────────────────────────────
// // SKELETON — copied from dashboard
// // ─────────────────────────────────────────────────────────
// function Skeleton({ h = 120, r = 20 }) {
//   return (
//     <div style={{
//       height: h, borderRadius: r,
//       background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
//       backgroundSize: "200% 100%",
//       animation: "dbShimmer 1.6s ease infinite",
//     }} />
//   );
// }

// const statusColumns = [
//   { id: 'pending',    title: 'Pending',    accentHex: "#f59e0b" },
//   { id: 'confirmed',  title: 'Confirmed',  accentHex: "#10b981" },
//   { id: 'preparing',  title: 'Preparing',  accentHex: "#3b82f6" },
//   { id: 'on-the-way', title: 'On The Way', accentHex: "#8b5cf6" },
//   { id: 'delivered',  title: 'Delivered',  accentHex: "#10b981" },
//   { id: 'cancelled',  title: 'Cancelled',  accentHex: "#ef4444" },
// ];

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   useEffect(() => {
//     fetchBranches();
//     fetchOrders();
//   }, [selectedBranch]);

//   const fetchBranches = async () => {
//     try {
//       const res = await fetch('/api/branches');
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setBranches(data.branches || []);
//     } catch {
//       toast.error('Failed to load branches');
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       let url = '/api/admin/orders';
//       if (selectedBranch !== 'all') {
//         url += `?branchId=${selectedBranch}`;
//       }
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

//   const filteredOrders = orders.filter(order =>
//     searchQuery === "" ||
//     order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     order.phone?.includes(searchQuery)
//   );

//   const getColumnOrders = (status) => filteredOrders.filter(o => o.status === status);

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
//     a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap');

//         @keyframes dbUp       { from{opacity:0;transform:translateY(18px);}  to{opacity:1;transform:translateY(0);} }
//         @keyframes dbSpin     { to{transform:rotate(360deg);} }
//         @keyframes dbPulse    { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(2.4);opacity:0;} }
//         @keyframes dbShimmer  { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }

//         *, *::before, *::after { box-sizing:border-box; }

//         .ord-page {
//           font-family:'Inter', system-ui, sans-serif;
//           min-height:100vh;
//           background:#080b10;
//           color:#fff;
//           padding-bottom:80px;
//         }

//         /* ── TOPBAR ── */
//         .ord-topbar {
//           position:sticky; top:0; z-index:50;
//           background:rgba(8,11,16,0.88);
//           backdrop-filter:blur(24px);
//           border-bottom:1px solid rgba(255,255,255,0.06);
//           padding:18px 24px;
//           display:flex; flex-direction:column; gap:16px;
//         }

//         .ord-title {
//           font-family:'Inter', system-ui, sans-serif;
//           font-size:clamp(22px,4vw,30px);
//           font-weight:300; color:#fff;
//           letter-spacing:-0.03em; line-height:1;
//         }

//         .ord-sub { font-size:11px; font-weight:400; color:rgba(255,255,255,0.28); font-style:italic; margin-top:3px; }

//         .ord-controls {
//           display:flex; flex-wrap:wrap; gap:12px; align-items:center;
//         }

//         .ord-search {
//           flex:1;
//           min-width:220px;
//           position:relative;
//         }

//         .ord-search input {
//           width:100%; padding:12px 16px 12px 44px;
//           background:rgba(255,255,255,0.04);
//           border:1px solid rgba(255,255,255,0.08);
//           border-radius:14px;
//           color:#fff;
//           font-size:13px;
//         }

//         .ord-search input::placeholder { color:rgba(255,255,255,0.3); }

//         .ord-branch-select {
//           padding:12px 16px;
//           background:rgba(255,255,255,0.04);
//           border:1px solid rgba(255,255,255,0.08);
//           border-radius:14px;
//           color:#fff;
//           font-size:13px;
//           min-width:180px;
//         }

//         .ord-export-btn {
//           display:flex; align-items:center; gap:8px;
//           padding:10px 16px; border-radius:12px;
//           background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.25);
//           color:#f59e0b; font-size:12px; font-weight:500;
//           transition:all 0.2s;
//         }

//         .ord-export-btn:hover { background:rgba(245,158,11,0.22); }

//         /* ── CONTENT ── */
//         .ord-content { max-width:1400px; margin:0 auto; padding:24px 20px; }

//         .ord-kanban {
//           display:flex; gap:20px; overflow-x:auto; padding-bottom:40px;
//         }

//         .ord-column {
//           flex:0 0 340px;
//           background:rgba(255,255,255,0.015);
//           border:1px solid rgba(255,255,255,0.06);
//           border-radius:20px; overflow:hidden;
//           animation:dbUp 0.6s ease both;
//         }

//         .ord-column-header {
//           padding:18px 20px;
//           border-bottom:1px solid rgba(255,255,255,0.05);
//           display:flex; justify-content:space-between; align-items:center;
//         }

//         .ord-column-title {
//           font-family:'Inter', system-ui, sans-serif;
//           font-size:18px; font-weight:500; color:#fff;
//           letter-spacing:-0.02em;
//         }

//         .ord-column-count {
//           padding:4px 12px; border-radius:999px;
//           font-size:11px; font-weight:500; letter-spacing:0.1em;
//           background:rgba(255,255,255,0.06);
//         }

//         .ord-card {
//           padding:16px 18px;
//           border-bottom:1px solid rgba(255,255,255,0.04);
//           transition:all 0.3s ease;
//           cursor:pointer;
//           position:relative;
//           overflow:hidden;
//         }

//         .ord-card:hover {
//           background:rgba(255,255,255,0.03);
//           transform:translateY(-2px);
//         }

//         .ord-card-glow {
//           position:absolute; inset:0; pointer-events:none;
//           opacity:0; transition:opacity 0.4s;
//           background:radial-gradient(circle at 30% 20%, var(--accent)15, transparent 60%);
//         }

//         .ord-card:hover .ord-card-glow { opacity:0.15; }

//         .ord-empty-column {
//           padding:60px 20px; text-align:center; color:rgba(255,255,255,0.3);
//           font-style:italic; font-size:14px;
//         }
//       `}</style>

//       <div className="ord-page">

//         {/* ── TOPBAR ── */}
//         <div className="ord-topbar">
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <PulseDot color="#f59e0b" size={9} />
//               <div>
//                 <div className="ord-title">Orders</div>
//                 <div className="ord-sub">Real-time order tracking across all branches</div>
//               </div>
//             </div>

//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <div style={{
//                 display: "flex", alignItems: "center", gap: 8,
//                 padding: "8px 14px", borderRadius: 999,
//                 background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)",
//                 fontSize: 11, fontWeight: 500, color: "#10b981", letterSpacing: "0.12em",
//               }}>
//                 <PulseDot color="#10b981" size={6} />
//                 LIVE
//               </div>

//               <button
//                 onClick={exportCSV}
//                 className="ord-export-btn"
//               >
//                 <Download size={15} />
//                 Export CSV
//               </button>
//             </div>
//           </div>

//           {/* Controls */}
//           <div className="ord-controls">
//             <div className="ord-search">
//               <Search size={18} style={{
//                 position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
//                 color: "rgba(255,255,255,0.4)"
//               }} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//                 placeholder="Search by order ID, name or phone..."
//               />
//             </div>

//             <select
//               value={selectedBranch}
//               onChange={e => setSelectedBranch(e.target.value)}
//               className="ord-branch-select"
//             >
//               <option value="all">All Branches</option>
//               {branches.map(b => (
//                 <option key={b._id} value={b._id}>
//                   {b.name} ({b.code})
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="ord-content">

//           {loading ? (
//             <div className="ord-kanban">
//               {statusColumns.map((_, i) => (
//                 <div key={i} className="ord-column" style={{ animationDelay: `${i*0.08}s` }}>
//                   <div className="ord-column-header">
//                     <Skeleton h={28} r={12} />
//                   </div>
//                   <div style={{ padding: "20px" }}>
//                     {[1,2,3,4,5].map(j => <Skeleton key={j} h={110} r={16} style={{ marginBottom: 12 }} />)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="ord-kanban">
//               {statusColumns.map((column, colIndex) => {
//                 const columnOrders = getColumnOrders(column.id);
//                 return (
//                   <div
//                     key={column.id}
//                     className="ord-column"
//                     style={{
//                       '--accent': column.accentHex,
//                       animationDelay: `${colIndex * 0.1}s`
//                     }}
//                   >
//                     <div className="ord-column-header">
//                       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                         <span style={{
//                           width: 10, height: 10, borderRadius: "50%",
//                           background: column.accentHex, boxShadow: `0 0 12px ${column.accentHex}60`
//                         }} />
//                         <span className="ord-column-title">{column.title}</span>
//                       </div>
//                       <span className="ord-column-count" style={{
//                         background: `${column.accentHex}18`,
//                         color: column.accentHex,
//                         border: `1px solid ${column.accentHex}30`
//                       }}>
//                         {columnOrders.length}
//                       </span>
//                     </div>

//                     <div style={{ padding: "8px" }}>
//                       {columnOrders.length === 0 ? (
//                         <div className="ord-empty-column">
//                           No {column.title.toLowerCase()} orders at the moment
//                         </div>
//                       ) : (
//                         columnOrders.map((order, i) => (
//                           <div
//                             key={order._id}
//                             className="ord-card"
//                             onClick={() => setSelectedOrder(order)}
//                             style={{ animationDelay: `${colIndex*0.1 + i*0.03}s` }}
//                           >
//                             <div className="ord-card-glow" />

//                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
//                               <div style={{
//                                 fontFamily: "'Inter', system-ui, sans-serif",
//                                 fontSize: 17, fontWeight: 500, letterSpacing: "-0.02em"
//                               }}>
//                                 #{order.orderId || order._id.slice(-6)}
//                               </div>

//                               <StatusBadge status={order.status} />
//                             </div>

//                             <div style={{ fontSize: 14, fontWeight: 400, marginBottom: 4 }}>
//                               {order.customerName}
//                             </div>

//                             <div style={{
//                               fontSize: 12, color: "rgba(255,255,255,0.5)",
//                               display: "flex", alignItems: "center", gap: 6, marginBottom: 12
//                             }}>
//                               <Phone size={13} />
//                               {order.phone}
//                             </div>

//                             <div style={{
//                               display: "flex", justifyContent: "space-between", alignItems: "center",
//                               paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)"
//                             }}>
//                               <div style={{
//                                 fontFamily: "'Inter', system-ui, sans-serif",
//                                 fontSize: 20, fontWeight: 600, letterSpacing: "-0.04em"
//                               }}>
//                                 ₹{order.total?.toFixed(2) || '0.00'}
//                               </div>

//                               <div style={{
//                                 display: "flex", alignItems: "center", gap: 12,
//                                 fontSize: 11, color: "rgba(255,255,255,0.4)"
//                               }}>
//                                 <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                                 <Eye size={15} />
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//         </div>

//         <AdminFooter />

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




// app/admin/orders/page.js → MOBILE-FRIENDLY LUXURY VERSION (Horizontal Status Badges + Filter)
// All logic preserved | Dynamic badges | Click to filter by status | No scrollbar visible

"use client";

import { useState, useEffect } from 'react';
import {
  ShoppingBag, Clock, Truck, CheckCircle2,
  Search, Download, Eye, Phone, MapPin,
  Filter, ChevronDown, AlertCircle, X
} from 'lucide-react';
import OrderModal from '../components/OrderModal';
import AdminFooter from '../../components/footer';
import toast from 'react-hot-toast';

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
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
        border hover:scale-105 active:scale-95
        ${isActive ? 'ring-2 ring-offset-2 ring-offset-[#080b10] ring-white/30' : 'hover:bg-white/5'}
      `}
      style={{
        background: c.bg,
        color: c.color,
        borderColor: c.border,
      }}
    >
      <span>{c.label}</span>
      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
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
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all'); // NEW: status filter state

  useEffect(() => {
    fetchBranches();
    fetchOrders();
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBranches(data.branches || []);
    } catch {
      toast.error('Failed to load branches');
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = '/api/admin/orders';
      if (selectedBranch !== 'all') url += `?branchId=${selectedBranch}`;
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .orders-page {
          font-family: 'Inter', system-ui, sans-serif;
          background: #080b10;
          color: white;
          min-height: 100vh;
        }

        .status-scroll {
          display: flex;
          overflow-x: auto;
          gap: 12px;
          padding: 12px 0;
          scrollbar-width: none; /* Firefox */
        }

        .status-scroll::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Edge */
        }

        .order-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.25s;
        }

        .order-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }
      `}</style>

      <div className="orders-page">

        {/* ── TOPBAR ── */}
        <div className="sticky top-0 z-50 bg-[#0a0e16]/90 backdrop-blur-xl border-b border-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Orders</h1>
            <button
              onClick={exportCSV}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 transition"
            >
              <Download size={20} />
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search order ID, name, phone..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">All Branches</option>
              {branches.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── HORIZONTAL SCROLLABLE STATUS BADGES ── */}
        <div className="px-4 pt-4 pb-2 overflow-hidden">
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

        {/* ── ORDERS LIST (vertical on mobile) ── */}
        <div className="px-4 pb-20">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 text-white/50">
              No orders found for this filter
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order._id}
                  className="order-card cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-white">#{order.orderId || order._id.slice(-6)}</p>
                      <p className="text-sm text-white/70 mt-1">{order.customerName}</p>
                    </div>
                    <StatusBadge status={order.status} count={null} isActive={false} />
                  </div>

                  <div className="flex items-center gap-3 text-sm text-white/60 mb-3">
                    <Phone size={14} />
                    {order.phone}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-amber-400">₹{order.total?.toFixed(2)}</span>
                    <span className="text-white/50">
                      {new Date(order.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <AdminFooter />

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

// // app/admin/orders/page.js → FINAL Kanban Dashboard (branch-separated)

// "use client";

// import { useState, useEffect } from 'react';
// import {
//   ShoppingBag, Clock, Truck, CheckCircle2,
//   Search, Download, Eye, Phone, MapPin,
//   Filter, ChevronDown, AlertCircle, X
// } from 'lucide-react';
// import OrderModal from '../components/OrderModal';
// import AdminFooter from '../../components/footer';
// import toast from 'react-hot-toast';

// const statusColumns = [
//   { id: 'pending', title: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
//   { id: 'confirmed', title: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
//   { id: 'preparing', title: 'Preparing', color: 'bg-indigo-100 text-indigo-800' },
//   { id: 'on-the-way', title: 'On The Way', color: 'bg-purple-100 text-purple-800' },
//   { id: 'delivered', title: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
//   { id: 'cancelled', title: 'Cancelled', color: 'bg-red-100 text-red-800' },
// ];

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   useEffect(() => {
//     fetchBranches();
//     fetchOrders();
//   }, [selectedBranch]);

//   const fetchBranches = async () => {
//     try {
//       const res = await fetch('/api/branches');
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setBranches(data.branches || []);
//     } catch {
//       toast.error('Failed to load branches');
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       let url = '/api/admin/orders';
//       if (selectedBranch !== 'all') {
//         url += `?branchId=${selectedBranch}`;
//       }
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

//   const filteredOrders = orders.filter(order =>
//     searchQuery === "" ||
//     order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     order.phone?.includes(searchQuery)
//   );

//   const getColumnOrders = (status) => filteredOrders.filter(o => o.status === status);

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
//     a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Sticky Header */}
//       <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
//         <div className="p-4 max-w-7xl mx-auto">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Orders Dashboard</h1>
//               <p className="text-sm text-gray-500">{filteredOrders.length} orders found</p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={exportCSV}
//                 className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
//               >
//                 <Download size={18} />
//                 Export CSV
//               </button>
//             </div>
//           </div>

//           {/* Branch Filter + Search */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//                 placeholder="Search orders..."
//                 className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-black/10"
//               />
//             </div>

//             <div className="relative min-w-[200px]">
//               <select
//                 value={selectedBranch}
//                 onChange={e => setSelectedBranch(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 appearance-none"
//               >
//                 <option value="all">All Branches</option>
//                 {branches.map(b => (
//                   <option key={b._id} value={b._id}>
//                     {b.name} ({b.code})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Kanban Board */}
//       <div className="flex-1 overflow-x-auto p-4">
//         <div className="flex gap-6 min-w-max pb-6">
//           {statusColumns.map(column => {
//             const columnOrders = getColumnOrders(column.id);
//             return (
//               <div key={column.id} className="w-80 flex-shrink-0 bg-gray-100 rounded-xl p-4">
//                 <div className={`p-3 rounded-lg mb-4 ${column.color}`}>
//                   <h3 className="font-bold text-lg">{column.title}</h3>
//                   <p className="text-sm opacity-80">{columnOrders.length} orders</p>
//                 </div>

//                 <div className="space-y-3 min-h-[200px]">
//                   {columnOrders.map(order => (
//                     <div
//                       key={order._id}
//                       className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition cursor-pointer"
//                       onClick={() => setSelectedOrder(order)}
//                     >
//                       <div className="flex justify-between items-start mb-2">
//                         <div className="font-bold text-gray-900">{order.orderId || order._id.slice(-6)}</div>
//                         <span className="text-sm text-gray-500">
//                           {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                         </span>
//                       </div>

//                       <p className="font-medium text-gray-800 truncate">{order.customerName}</p>
//                       <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
//                         <Phone size={14} /> {order.phone}
//                       </div>

//                       <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
//                         <span className="font-bold text-lg">{order.total?.toFixed(2) || '0.00'}</span>
//                         <button className="text-blue-600 hover:text-blue-800">
//                           <Eye size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Footer */}
//       <AdminFooter />

//       {/* Order Detail Modal */}
//       {selectedOrder && (
//         <OrderModal
//           order={selectedOrder}
//           onClose={() => setSelectedOrder(null)}
//           onUpdate={fetchOrders}
//         />
//       )}
//     </div>
//   );
// }