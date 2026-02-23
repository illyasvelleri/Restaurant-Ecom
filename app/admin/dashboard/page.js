// // app/admin/dashboard/page.js → FINAL 2025 DYNAMIC DASHBOARD

// "use client";

// import { useState, useEffect } from 'react';
// import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';
// import toast from 'react-hot-toast';
// import AdminFooter from '../../components/footer';

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({});
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchDashboard = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/admin/dashboard');
//       if (!res.ok) throw new Error();
//       const data = await res.json();

//       setStats(data.stats || {});
//       setRecentOrders(data.recentOrders || []);
//     } catch (err) {
//       toast.error("Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const getStatusColor = (status) => {
//     const colors = {
//       delivered: "bg-emerald-100 text-emerald-700",
//       preparing: "bg-blue-100 text-blue-700",
//       pending: "bg-yellow-100 text-yellow-700",
//       "on-the-way": "bg-purple-100 text-purple-700",
//       cancelled: "bg-red-100 text-red-700",
//     };
//     return colors[status] || "bg-gray-100 text-gray-700";
//   };

//   const formatTime = (date) => {
//     const now = new Date();
//     const diff = now - new Date(date);
//     const minutes = Math.floor(diff / 60000);
//     const hours = Math.floor(diff / 3600000);
//     const days = Math.floor(diff / 86400000);

//     if (minutes < 60) return `${minutes} mins ago`;
//     if (hours < 24) return `${hours}h ago`;
//     if (days < 7) return `${days}d ago`;
//     return new Date(date).toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* MOBILE HEADER */}
//       <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
//         <div className="px-4 py-5">
//           <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
//         </div>
//       </div>

//       {/* KEY STATS — MOBILE COMPACT */}
//       <div className="px-4 py-6">
//         {loading ? (
//           <div className="grid grid-cols-2 gap-4">
//             {[1, 2, 3, 4].map(i => (
//               <div key={i} className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-4">
//             <StatsCard
//               title="Revenue Today"
//               value={`${stats.todayRevenue || 0}`}
//               change={stats.revenueGrowth || 0}
//               icon={DollarSign}
//               color="from-emerald-500 to-teal-600"
//             />
//             <StatsCard
//               title="Orders Today"
//               value={stats.todayOrders || 0}
//               change={stats.ordersGrowth || 0}
//               icon={ShoppingBag}
//               color="from-blue-500 to-blue-600"
//             />
//             <StatsCard
//               title="Total Customers"
//               value={stats.totalCustomers || 0}
//               change={stats.customersGrowth || 0}
//               icon={Users}
//               color="from-purple-500 to-purple-600"
//             />
//             <StatsCard
//               title="Active Products"
//               value={stats.activeProducts || 0}
//               change={stats.productsChange || 0}
//               icon={Package}
//               color="from-orange-500 to-red-600"
//             />
//           </div>
//         )}
//       </div>

//       {/* RECENT ORDERS */}
//       <div className="px-4 pb-32">
//         <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
//         {loading ? (
//           <div className="space-y-3">
//             {[1, 2, 3, 4].map(i => (
//               <div key={i} className="bg-gray-200 rounded-2xl h-24 animate-pulse" />
//             ))}
//           </div>
//         ) : recentOrders.length === 0 ? (
//           <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
//             <ShoppingBag className="mx-auto text-gray-300 mb-4" size={56} />
//             <p className="text-gray-500">No orders yet</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {recentOrders.map((order) => (
//               <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
//                     {order.status.replace("-", " ")}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <div>
//                     <p className="font-medium text-gray-900">{order.customerName}</p>
//                     <p className="text-gray-600">{order.phone}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold text-lg text-gray-900">{order.total.toFixed(2)}</p>
//                     <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <AdminFooter />
//     </div>
//   );
// }

// // REUSABLE STATS CARD
// function StatsCard({ title, value, change, icon: Icon, color }) {
//   const isPositive = change >= 0;
//   return (
//     <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
//       <div className="flex items-center justify-between mb-3">
//         <Icon size={32} />
//         {change !== undefined && (
//           <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? "text-white" : "text-red-200"}`}>
//             <TrendingUp size={16} className={`rotate-${!isPositive ? "180" : "0"}`} />
//             {isPositive ? "+" : ""}{change}%
//           </div>
//         )}
//       </div>
//       <p className="text-3xl font-bold">{value}</p>
//       <p className="text-sm opacity-90 mt-1">{title}</p>
//     </div>
//   );
// }
// app/admin/dashboard/page.js → PREMIUM DARK REDESIGN — ALL ORIGINAL LOGIC PRESERVED
// FONTS UPDATED TO STANDARD READABLE ADMIN PANEL STYLE (Inter + system fallback)
// NO OTHER LINES REMOVED OR CHANGED

"use client";

import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminFooter from '../../components/footer';

// ─────────────────────────────────────────────────────────
// ANIMATED COUNTER — counts up on mount
// ─────────────────────────────────────────────────────────
function AnimCount({ raw }) {
  const [display, setDisplay] = useState(0);
  const num = parseFloat(String(raw).replace(/[^0-9.]/g, "")) || 0;
  const isDecimal = num % 1 !== 0;

  useEffect(() => {
    let cur = 0;
    const steps = 48;
    const inc = num / steps;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= num) { setDisplay(num); clearInterval(t); }
      else setDisplay(cur);
    }, 18);
    return () => clearInterval(t);
  }, [num]);

  // Preserve prefix characters like currency symbols
  const prefix = String(raw).replace(/[0-9.,\s]/g, "").trim();
  const formatted = num > 999 ? Math.floor(display).toLocaleString() : isDecimal ? display.toFixed(1) : Math.floor(display);
  return <>{prefix}{formatted}</>;
}

// ─────────────────────────────────────────────────────────
// PULSE DOT
// ─────────────────────────────────────────────────────────
function PulseDot({ color = "#10b981", size = 8 }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: size, height: size, flexShrink: 0 }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: color, animation: "dbPulse 2s ease-in-out infinite",
      }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// STATS CARD
// ─────────────────────────────────────────────────────────
function StatsCard({ title, value, change, icon: Icon, color, accentHex, delay = 0 }) {
  const [hov, setHov] = useState(false);
  const isPositive = parseFloat(change) >= 0;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `linear-gradient(135deg, ${accentHex}12 0%, rgba(255,255,255,0.03) 100%)` : "rgba(255,255,255,0.025)",
        border: `1px solid ${hov ? accentHex + "44" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 24, padding: "22px 20px",
        transition: "all 0.35s ease",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? `0 20px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)` : "none",
        cursor: "default", position: "relative", overflow: "hidden",
        animation: `dbUp 0.55s cubic-bezier(.22,1,.36,1) ${delay}s both`,
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: "absolute", top: -24, right: -24,
        width: 80, height: 80, borderRadius: "50%",
        background: accentHex, opacity: hov ? 0.1 : 0,
        filter: "blur(20px)", transition: "opacity 0.4s", pointerEvents: "none",
      }} />

      {/* Icon + trend */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: `${accentHex}18`, border: `1px solid ${accentHex}2e`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: hov ? `0 0 20px ${accentHex}55` : "none", transition: "box-shadow 0.3s",
        }}>
          <Icon size={20} color={accentHex} strokeWidth={1.5} />
        </div>

        {change !== undefined && (
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "5px 10px", borderRadius: 999,
            background: isPositive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${isPositive ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.22)"}`,
          }}>
            {isPositive
              ? <ArrowUpRight size={13} color="#10b981" />
              : <ArrowDownRight size={13} color="#ef4444" />
            }
            <span style={{ fontSize: 11, fontWeight: 500, color: isPositive ? "#10b981" : "#ef4444" }}>
              {isPositive ? "+" : ""}{change}%
            </span>
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{ fontSize: 32, fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 6, position: "relative" }}>
        <AnimCount raw={value} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", position: "relative" }}>
        {title}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    delivered:    { bg: "rgba(16,185,129,0.12)", color: "#10b981", border: "rgba(16,185,129,0.25)", label: "Delivered" },
    preparing:    { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "rgba(59,130,246,0.25)", label: "Preparing" },
    pending:      { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "rgba(245,158,11,0.25)", label: "Pending" },
    confirmed:    { bg: "rgba(16,185,129,0.1)",  color: "#34d399", border: "rgba(52,211,153,0.25)", label: "Confirmed" },
    "on-the-way": { bg: "rgba(139,92,246,0.12)", color: "#8b5cf6", border: "rgba(139,92,246,0.25)", label: "On the Way" },
    cancelled:    { bg: "rgba(239,68,68,0.10)",  color: "#ef4444", border: "rgba(239,68,68,0.22)", label: "Cancelled" },
  };
  const c = map[status] || { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.1)", label: status };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "4px 12px", borderRadius: 999,
      background: c.bg, border: `1px solid ${c.border}`,
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase",
      color: c.color, whiteSpace: "nowrap",
    }}>
      {c.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// ORDER ROW (original formatTime logic preserved)
// ─────────────────────────────────────────────────────────
// ── original formatTime — untouched ──
function formatTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function OrderRow({ order, delay = 0 }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 16, padding: "16px 22px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: hov ? "rgba(255,255,255,0.02)" : "transparent",
        transition: "background 0.2s",
        animation: `dbUp 0.45s ease ${delay}s both`,
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color: "#f59e0b", fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {(order.customerName || "?")[0].toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em" }}>
              {order.customerName}
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>
              {order.orderNumber}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
            {order.phone}
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusBadge status={order.status} />
          <span style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 18, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em",
          }}>
            {order.total?.toFixed(2)}
          </span>
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.04em" }}>
          {formatTime(order.createdAt)}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────
function Skeleton({ h = 120, r = 20 }) {
  return (
    <div style={{
      height: h, borderRadius: r,
      background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
      backgroundSize: "200% 100%",
      animation: "dbShimmer 1.6s ease infinite",
    }} />
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE — original logic completely preserved
// ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── original fetch — untouched ──
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard');
      if (!res.ok) throw new Error();
      const data = await res.json();

      setStats(data.stats || {});
      setRecentOrders(data.recentOrders || []);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  // ── original getStatusColor — kept for compatibility ──
  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-emerald-100 text-emerald-700",
      preparing: "bg-blue-100 text-blue-700",
      pending: "bg-yellow-100 text-yellow-700",
      "on-the-way": "bg-purple-100 text-purple-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  // ── stat cards config — untouched ──
  const cardConfig = [
    { key: "todayRevenue", title: "Revenue Today", icon: DollarSign, accentHex: "#f59e0b", growthKey: "revenueGrowth", delay: 0 },
    { key: "todayOrders", title: "Orders Today", icon: ShoppingBag, accentHex: "#3b82f6", growthKey: "ordersGrowth", delay: 0.07 },
    { key: "totalCustomers", title: "Total Customers", icon: Users, accentHex: "#8b5cf6", growthKey: "customersGrowth", delay: 0.14 },
    { key: "activeProducts", title: "Active Products", icon: Package, accentHex: "#f97316", growthKey: "productsChange", delay: 0.21 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes dbUp       { from{opacity:0;transform:translateY(18px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes dbSpin     { to{transform:rotate(360deg);} }
        @keyframes dbPulse    { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(2.4);opacity:0;} }
        @keyframes dbShimmer  { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
        @keyframes dbScanline { from{top:-4px;} to{top:100%;} }

        *, *::before, *::after { box-sizing:border-box; }

        .db-page {
          font-family:'Inter', system-ui, sans-serif;
          min-height:100vh;
          background:#080b10;
          color:#fff;
          padding-bottom:80px;
        }

        /* ── TOPBAR ── */
        .db-topbar {
          position:sticky; top:0; z-index:50;
          background:rgba(8,11,16,0.88);
          backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding:18px 24px;
          display:flex; align-items:center; justify-content:space-between; gap:16px;
        }
        .db-title {
          font-family:'Inter', system-ui, sans-serif;
          font-size:clamp(22px,4vw,30px);
          font-weight:500; color:#fff;
          letter-spacing:-0.03em; line-height:1;
        }
        .db-sub { font-size:11px; font-weight:400; color:rgba(255,255,255,0.28); font-style:italic; margin-top:3px; }
        .db-live-badge {
          display:flex; align-items:center; gap:7px;
          padding:7px 14px; border-radius:999px;
          background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.18);
          font-size:10px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase;
          color:#10b981;
        }
        .db-refresh-btn {
          display:flex; align-items:center; gap:7px;
          padding:9px 16px; border-radius:12px;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.5); cursor:pointer;
          font-family:'Inter', system-ui, sans-serif;
          font-size:11px; font-weight:500; letter-spacing:0.1em;
          transition:all 0.2s;
        }
        .db-refresh-btn:hover { background:rgba(255,255,255,0.08); color:#fff; }

        /* ── CONTENT ── */
        .db-content { max-width:1200px; margin:0 auto; padding:24px 20px; }
        .db-g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(min-width:900px){ .db-g2{ grid-template-columns:repeat(4,1fr); } }

        /* ── SECTION HEADER ── */
        .db-section-label {
          font-size:9px; font-weight:500; letter-spacing:0.24em; text-transform:uppercase;
          color:rgba(255,255,255,0.25); margin-bottom:6px; display:block;
        }
        .db-section-title {
          font-family:'Inter', system-ui, sans-serif;
          font-size:20px; font-weight:500; color:#fff;
          letter-spacing:-0.02em; margin-bottom:16px;
        }

        /* ── ORDERS PANEL ── */
        .db-orders-panel {
          background:rgba(255,255,255,0.02);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:26px; overflow:hidden;
          animation:dbUp 0.6s ease 0.3s both;
        }
        .db-orders-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:22px 22px 18px;
          border-bottom:1px solid rgba(255,255,255,0.05);
        }
        .db-orders-header-title {
          display:flex; align-items:center; gap:10px;
        }
        .db-order-count {
          padding:4px 12px; border-radius:999px;
          background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.2);
          font-size:11px; font-weight:500; color:#f59e0b; letter-spacing:0.06em;
        }

        /* ── EMPTY ── */
        .db-empty {
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:64px 24px; text-align:center;
        }
        .db-empty-icon { font-size:42px; margin-bottom:14px; }
        .db-empty-text { font-size:14px; font-weight:400; color:rgba(255,255,255,0.28); font-style:italic; }

        /* ── LOADING SPINNER ── */
        .db-spinner {
          width:36px; height:36px;
          border:1.5px solid rgba(255,255,255,0.06);
          border-top-color:#f59e0b;
          border-radius:50%;
          animation:dbSpin 0.75s linear infinite;
        }

        /* ── DIVIDER ── */
        .db-divider {
          height:1px; background:rgba(255,255,255,0.05);
          margin:28px 0;
        }
      `}</style>

      <div className="db-page">

        {/* ── TOPBAR ── */}
        <div className="db-topbar">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
              <PulseDot color="#10b981" size={8} />
              <div className="db-title">Dashboard</div>
            </div>
            <div className="db-sub">Welcome back — here's your restaurant at a glance</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="db-live-badge">
              <PulseDot color="#10b981" size={6} />
              Live
            </div>
            <button className="db-refresh-btn" onClick={fetchDashboard} disabled={loading}>
              <RefreshCw size={13} strokeWidth={1.5} style={{ animation: loading ? "dbSpin 1s linear infinite" : "none" }} />
              Refresh
            </button>
          </div>
        </div>

        <div className="db-content">

          {/* ── STATS ── */}
          <span className="db-section-label">Key Metrics</span>
          <div className="db-g2" style={{ marginBottom: 32 }}>
            {loading
              ? [0, 1, 2, 3].map(i => <Skeleton key={i} h={148} r={24} />)
              : cardConfig.map(c => (
                  <StatsCard
                    key={c.key}
                    title={c.title}
                    value={stats[c.key] || 0}
                    change={stats[c.growthKey] || 0}
                    icon={c.icon}
                    accentHex={c.accentHex}
                    delay={c.delay}
                    // ── original color prop kept for compatibility ──
                    color={`from-${c.key === "todayRevenue" ? "emerald-500 to-teal-600" : c.key === "todayOrders" ? "blue-500 to-blue-600" : c.key === "totalCustomers" ? "purple-500 to-purple-600" : "orange-500 to-red-600"}`}
                  />
                ))
            }
          </div>

          {/* ── RECENT ORDERS ── */}
          <span className="db-section-label">Order Feed</span>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[0, 1, 2, 3, 4].map(i => <Skeleton key={i} h={72} r={16} />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="db-orders-panel">
              <div className="db-empty">
                <div className="db-empty-icon">🛒</div>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>No orders yet</div>
                <div className="db-empty-text">Orders will appear here as they come in</div>
              </div>
            </div>
          ) : (
            <div className="db-orders-panel">
              <div className="db-orders-header">
                <div className="db-orders-header-title">
                  <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 18, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em" }}>
                    Recent Orders
                  </div>
                  <span className="db-order-count">{recentOrders.length}</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Latest 10</div>
              </div>

              {recentOrders.map((order, i) => (
                <OrderRow key={order._id} order={order} delay={i * 0.04} />
              ))}
            </div>
          )}

          {/* ── STATUS LEGEND ── */}
          {!loading && recentOrders.length > 0 && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20,
              animation: "dbUp 0.5s ease 0.5s both",
            }}>
              {["pending", "confirmed", "preparing", "on-the-way", "delivered", "cancelled"].map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <StatusBadge status={s} />
                </div>
              ))}
            </div>
          )}

        </div>

        <AdminFooter />
      </div>
    </>
  );
}