// //user/orders

// "use client";

// import { useState, useEffect } from "react";
// import { Clock, CheckCircle, XCircle, Send, Calendar, Edit3 } from "lucide-react";
// import toast from "react-hot-toast";
// import Link from "next/link";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [currency, setCurrency] = useState("SAR");
//   const [loading, setLoading] = useState(true);
//   const [filterMonth, setFilterMonth] = useState("");

//   const loadOrders = async (month = "") => {
//     setLoading(true);
//     try {
//       const url = month ? `/api/user/orders?month=${month}` : '/api/user/orders';
//       const [res, settingsRes] = await Promise.all([
//         fetch(url),
//         fetch('/api/restaurantDetails')
//       ]);

//       if (res.ok) setOrders(await res.json());
//       if (settingsRes.ok) {
//         const s = await settingsRes.json();
//         setCurrency(s.currency || "SAR");
//       }
//     } catch (err) {
//       toast.error("Failed to sync orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadOrders(); }, []);

//   // Helper: Calculate seconds left since confirmation (or creation)
//   const getEditTimeLeft = (order) => {
//     const reference = order.confirmedAt ? new Date(order.confirmedAt) : new Date(order.createdAt);
//     const now = new Date();
//     const diffSeconds = Math.floor((now - reference) / 1000);
//     const maxSeconds = 5 * 60; // 5 minutes
//     return Math.max(0, maxSeconds - diffSeconds);
//   };

//   // Format mm:ss
//   const formatTimeLeft = (seconds) => {
//     if (seconds <= 0) return "00:00";
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}:${s.toString().padStart(2, '0')}`;
//   };

//   // Countdown component (only shows for confirmed orders within time)
//   function EditCountdown({ order }) {
//     const [timeLeft, setTimeLeft] = useState(getEditTimeLeft(order));

//     useEffect(() => {
//       if (timeLeft <= 0) return;
//       const timer = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000);
//       return () => clearInterval(timer);
//     }, [timeLeft]);

//     if (timeLeft <= 0) return null;

//     const isUrgent = timeLeft <= 60;
//     return (
//       <span className={`text-sm font-medium flex items-center gap-1.5 ${isUrgent ? "text-red-600" : "text-amber-600"}`}>
//         <Clock size={14} />
//         Edit expires in {formatTimeLeft(timeLeft)}
//       </span>
//     );
//   }

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
//         @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         *, *::before, *::after { box-sizing: border-box; }

//         .op-page {
//           font-family: 'DM Sans', sans-serif;
//           min-height: 100vh;
//           background: #f5f4f1;
//           padding: 0 0 80px;
//         }

//         /* ── TOP BAR ── */
//         .op-topbar {
//           position: sticky; top: 0; z-index: 10;
//           background: rgba(245,244,241,0.88);
//           backdrop-filter: blur(18px);
//           border-bottom: 1px solid rgba(0,0,0,0.05);
//           padding: 14px 28px;
//           display: flex; align-items: center; justify-content: space-between;
//         }
//         .op-topbar-title {
//           font-size: 12px; font-weight: 400;
//           letter-spacing: 0.22em; text-transform: uppercase; color: #b0a898;
//         }

//         /* ── HERO ── */
//         .op-hero {
//           padding: 48px 28px 36px;
//           max-width: 1100px;
//           margin: 0 auto;
//           display: flex;
//           flex-direction: column;
//           gap: 24px;
//           animation: fadeUp 0.5s ease both;
//         }
//         @media (min-width: 768px) {
//           .op-hero { flex-direction: row; align-items: flex-end; justify-content: space-between; }
//         }
//         .op-hero-text {}
//         .op-hero-eyebrow {
//           font-size: 10px; font-weight: 400;
//           letter-spacing: 0.24em; text-transform: uppercase;
//           color: #c0b4a4; margin-bottom: 10px; display: block;
//         }
//         .op-hero-title {
//           font-size: clamp(36px, 8vw, 64px);
//           font-weight: 200;
//           color: #1a1a1a;
//           letter-spacing: -0.04em;
//           line-height: 1;
//           margin: 0 0 8px;
//         }
//         .op-hero-sub {
//           font-size: 14px; font-weight: 300;
//           color: #b0a898; font-style: italic;
//         }

//         /* ── FILTER ── */
//         .op-filter-wrap {
//           display: flex; align-items: center; gap: 10px;
//           background: #fff;
//           border: 1px solid #eceae5;
//           border-radius: 16px;
//           padding: 10px 16px;
//           flex-shrink: 0;
//         }
//         .op-filter-icon { color: #c0b4a4; flex-shrink: 0; }
//         .op-filter-select {
//           font-family: 'DM Sans', sans-serif;
//           font-size: 13px; font-weight: 300;
//           color: #1a1a1a;
//           background: transparent;
//           border: none; outline: none;
//           cursor: pointer;
//           padding-right: 4px;
//           appearance: none;
//           min-width: 90px;
//         }

//         /* ── CONTENT ── */
//         .op-content {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 0 16px;
//         }

//         /* ── LOADING ── */
//         .op-loading {
//           display: flex; flex-direction: column;
//           align-items: center; justify-content: center;
//           padding: 80px 0; gap: 16px;
//         }
//         .op-loading-spinner {
//           width: 36px; height: 36px;
//           border: 1.5px solid #e0ddd8;
//           border-top-color: #1a1a1a;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }
//         .op-loading-text {
//           font-size: 11px; font-weight: 400;
//           letter-spacing: 0.24em; text-transform: uppercase; color: #c0b4a4;
//         }

//         /* ── EMPTY ── */
//         .op-empty {
//           padding: 64px 32px;
//           text-align: center;
//           background: #fff;
//           border: 1px solid #eceae5;
//           border-radius: 28px;
//         }
//         .op-empty-icon { font-size: 42px; margin-bottom: 16px; }
//         .op-empty-text {
//           font-size: 15px; font-weight: 300;
//           color: #b0a898; font-style: italic;
//         }

//         /* ── ORDER CARD ── */
//         .op-order-card {
//           background: #fff;
//           border: 1px solid #eceae5;
//           border-radius: 28px;
//           padding: 28px;
//           margin-bottom: 14px;
//           transition: border-color 0.3s, box-shadow 0.4s, transform 0.3s;
//           animation: fadeUp 0.4s ease both;
//         }
//         @media (min-width: 640px) { .op-order-card { padding: 36px; } }
//         .op-order-card:hover {
//           border-color: #d8d4cc;
//           box-shadow: 0 16px 48px rgba(0,0,0,0.06);
//           transform: translateY(-1px);
//         }

//         /* ── CARD INNER LAYOUT ── */
//         .op-card-inner {
//           display: flex;
//           flex-direction: column;
//           gap: 24px;
//         }
//         @media (min-width: 768px) {
//           .op-card-inner { flex-direction: row; justify-content: space-between; align-items: flex-start; }
//         }

//         /* ── CARD LEFT ── */
//         .op-card-left { flex: 1; }

//         .op-card-meta {
//           display: flex; align-items: center; gap: 12px;
//           flex-wrap: wrap; margin-bottom: 20px;
//         }
//         .op-card-date {
//           font-size: 12px; font-weight: 300;
//           color: #b0a898; letter-spacing: 0.02em;
//         }
//         .op-card-divider {
//           width: 1px; height: 14px;
//           background: #ddd; flex-shrink: 0;
//         }
//         .op-card-id {
//           font-size: 11px; font-weight: 400;
//           letter-spacing: 0.1em; color: #c8c0b4;
//           font-style: italic;
//         }

//         /* ── ITEMS LIST ── */
//         .op-items-list { display: flex; flex-direction: column; gap: 10px; }
//         .op-item-row { display: flex; align-items: baseline; gap: 10px; }
//         .op-item-qty {
//           font-size: 13px; font-weight: 300;
//           color: #c8c0b4; min-width: 24px; text-align: right;
//           flex-shrink: 0;
//         }
//         .op-item-name {
//           font-size: 18px; font-weight: 200;
//           color: #1a1a1a; letter-spacing: -0.02em;
//           line-height: 1.2;
//         }
//         @media (min-width: 640px) { .op-item-name { font-size: 22px; } }

//         /* ── CARD RIGHT ── */
//         .op-card-right {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//           gap: 20px;
//           flex-shrink: 0;
//         }
//         @media (min-width: 768px) {
//           .op-card-right { align-items: flex-end; min-width: 180px; }
//         }

//         /* ── TOTAL ── */
//         .op-total-label {
//           font-size: 9px; font-weight: 400;
//           letter-spacing: 0.22em; text-transform: uppercase;
//           color: #c0b4a4; margin-bottom: 4px;
//         }
//         .op-total-value-wrap { display: flex; align-items: baseline; gap: 5px; }
//         .op-total-value {
//           font-size: 36px; font-weight: 200;
//           color: #1a1a1a; letter-spacing: -0.04em; line-height: 1;
//         }
//         @media (min-width: 640px) { .op-total-value { font-size: 42px; } }
//         .op-total-currency {
//           font-size: 10px; font-weight: 400;
//           color: #c0b4a4; letter-spacing: 0.12em; text-transform: uppercase;
//         }

//         /* ── ACTION BUTTONS ── */
//         .op-actions { display: flex; flex-direction: column; gap: 8px; width: 100%; }
//         @media (min-width: 768px) { .op-actions { align-items: flex-end; } }

//         .op-countdown-wrap {
//           display: flex; align-items: center; gap: 6px;
//           padding: 7px 14px;
//           border-radius: 999px;
//           font-size: 12px; font-weight: 300;
//           letter-spacing: 0.02em;
//         }
//         .op-countdown-normal { background: #fffbeb; color: #d97706; }
//         .op-countdown-urgent { background: #fff1f0; color: #dc2626; }

//         .op-btn {
//           display: inline-flex; align-items: center; gap: 8px;
//           padding: 12px 22px;
//           border-radius: 14px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 11px; font-weight: 400;
//           letter-spacing: 0.14em; text-transform: uppercase;
//           cursor: pointer; border: none;
//           text-decoration: none;
//           transition: background 0.2s, transform 0.15s;
//           white-space: nowrap;
//         }
//         .op-btn:active { transform: scale(0.97); }
//         .op-btn-edit {
//           background: #f5f4f1;
//           color: #1a1a1a;
//           border: 1px solid #e8e5e0;
//         }
//         .op-btn-edit:hover { background: #eceae5; }
//         .op-btn-support {
//           background: #1a1a1a;
//           color: #fff;
//         }
//         .op-btn-support:hover { background: #000; }
//       `}</style>

//       <div className="op-page">

//         {/* TOP BAR */}
//         <div className="op-topbar">
//           <span className="op-topbar-title">My Orders</span>
//           <div style={{ width: 80 }} />
//         </div>

//         {/* HERO + FILTER */}
//         <div className="op-hero">
//           <div className="op-hero-text">
//             <span className="op-hero-eyebrow">Order History</span>
//             <h1 className="op-hero-title">Your Journey</h1>
//             <p className="op-hero-sub">Track and manage your orders</p>
//           </div>

//           {/* Filter — all original logic intact */}
//           <div className="op-filter-wrap">
//             <Calendar className="op-filter-icon" size={16} />
//             <select
//               value={filterMonth}
//               onChange={(e) => { setFilterMonth(e.target.value); loadOrders(e.target.value); }}
//               className="op-filter-select"
//             >
//               <option value="">All Time</option>
//               {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
//                 <option key={m} value={i}>{m}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="op-content">

//           {/* LOADING */}
//           {loading ? (
//             <div className="op-loading">
//               <div className="op-loading-spinner" />
//               <p className="op-loading-text">Fetching your history</p>
//             </div>

//           /* EMPTY */
//           ) : orders.length === 0 ? (
//             <div className="op-empty">
//               <div className="op-empty-icon">📋</div>
//               <p className="op-empty-text">No orders found for this period.</p>
//             </div>

//           /* ORDER LIST */
//           ) : (
//             <div>
//               {orders.map((order, orderIdx) => {
//                 const timeLeft = getEditTimeLeft(order);
//                 const isPending = order.status === "pending";
//                 const isConfirmedWithinTime = order.status === "confirmed" && timeLeft > 0;
//                 const canEdit = isPending || isConfirmedWithinTime;

//                 return (
//                   <div
//                     key={order._id}
//                     className="op-order-card"
//                     style={{ animationDelay: `${orderIdx * 0.06}s` }}
//                   >
//                     <div className="op-card-inner">

//                       {/* LEFT */}
//                       <div className="op-card-left">
//                         {/* Meta row */}
//                         <div className="op-card-meta">
//                           <StatusBadge status={order.status} />
//                           <div className="op-card-divider" />
//                           <span className="op-card-date">
//                             {new Date(order.createdAt).toLocaleDateString('en-GB', {
//                               day: 'numeric', month: 'short',
//                               hour: '2-digit', minute: '2-digit'
//                             })}
//                           </span>
//                           {order.orderId && (
//                             <>
//                               <div className="op-card-divider" />
//                               <span className="op-card-id">{order.orderId}</span>
//                             </>
//                           )}
//                         </div>

//                         {/* Items */}
//                         <div className="op-items-list">
//                           {order.items.map((item, i) => (
//                             <div key={i} className="op-item-row">
//                               <span className="op-item-qty">{item.quantity}×</span>
//                               <span className="op-item-name">{item.name}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* RIGHT */}
//                       <div className="op-card-right">
//                         {/* Total */}
//                         <div>
//                           <div className="op-total-label">Total Amount</div>
//                           <div className="op-total-value-wrap">
//                             <span className="op-total-value">{order.total}</span>
//                             <span className="op-total-currency">{currency}</span>
//                           </div>
//                         </div>

//                         {/* Actions */}
//                         <div className="op-actions">
//                           {/* Countdown — confirmed orders within 5 min window */}
//                           {order.status === "confirmed" && timeLeft > 0 && (
//                             <EditCountdown order={order} />
//                           )}

//                           {/* Edit button — pending OR confirmed within time */}
//                           {canEdit && (
//                             <Link
//                               href={`/user/cart?edit=${order.orderId}`}
//                               className="op-btn op-btn-edit"
//                             >
//                               <Edit3 size={14} strokeWidth={1.5} />
//                               Edit Order
//                             </Link>
//                           )}

//                           {/* Support button */}
//                           <a
//                             href={`https://wa.me/${order.whatsapp}`}
//                             className="op-btn op-btn-support"
//                           >
//                             <Send size={14} strokeWidth={1.5} />
//                             Support
//                           </a>
//                         </div>
//                       </div>

//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );
// }

// function StatusBadge({ status }) {
//   const config = {
//     pending:   { bg: "#fffbeb", color: "#b45309", border: "#fde68a", label: "Pending" },
//     confirmed: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", label: "Confirmed" },
//     cancelled: { bg: "#fff1f0", color: "#dc2626", border: "#fecaca", label: "Cancelled" },
//     preparing: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", label: "Preparing" },
//     ready:     { bg: "#faf5ff", color: "#7e22ce", border: "#e9d5ff", label: "Ready" },
//     delivered: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", label: "Delivered" },
//   };
//   const c = config[status] || { bg: "#f9f9f7", color: "#888", border: "#eceae5", label: status };

//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center",
//       padding: "5px 12px",
//       borderRadius: 999,
//       background: c.bg,
//       color: c.color,
//       border: `1px solid ${c.border}`,
//       fontFamily: "'DM Sans', sans-serif",
//       fontSize: 9,
//       fontWeight: 500,
//       letterSpacing: "0.18em",
//       textTransform: "uppercase",
//     }}>
//       {c.label}
//     </span>
//   );
// }

// function EditCountdown({ order }) {
//   const [timeLeft, setTimeLeft] = useState(() => {
//     const reference = order.confirmedAt ? new Date(order.confirmedAt) : new Date(order.createdAt);
//     const diff = Math.floor((new Date() - reference) / 1000);
//     return Math.max(0, 300 - diff);
//   });

//   useEffect(() => {
//     if (timeLeft <= 0) return;
//     const timer = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   if (timeLeft <= 0) return null;

//   const min = Math.floor(timeLeft / 60);
//   const sec = timeLeft % 60;
//   const isUrgent = timeLeft <= 60;

//   return (
//     <span
//       style={{
//         display: "inline-flex", alignItems: "center", gap: 6,
//         padding: "7px 14px", borderRadius: 999,
//         fontFamily: "'DM Sans', sans-serif",
//         fontSize: 12, fontWeight: 300,
//         background: isUrgent ? "#fff1f0" : "#fffbeb",
//         color: isUrgent ? "#dc2626" : "#d97706",
//       }}
//     >
//       <Clock size={13} strokeWidth={1.5} />
//       Edit expires in {min}:{sec.toString().padStart(2, '0')}
//     </span>
//   );
// }
// app/user/orders/page.js — UPDATED: uses restaurant timezone from PublicSetting DB
// ALL ORIGINAL LOGIC PRESERVED + TIMEZONE-AWARE TIMESTAMPS & COUNTDOWN

"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Send, Calendar, Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [currency, setCurrency] = useState("SAR");
  const [timezone, setTimezone] = useState("Asia/Riyadh"); // ← NEW: restaurant timezone from DB
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState("");

  const loadOrders = async (month = "") => {
    setLoading(true);
    try {
      const url = month ? `/api/user/orders?month=${month}` : '/api/user/orders';
      const [res, settingsRes] = await Promise.all([
        fetch(url),
        fetch('/api/restaurantDetails')
      ]);

      if (res.ok) setOrders(await res.json());
      if (settingsRes.ok) {
        const s = await settingsRes.json();
        setCurrency(s.currency || "SAR");
        setTimezone(s.timezone || "Asia/Riyadh"); // ← NEW: load correct timezone
      }
    } catch (err) {
      toast.error("Failed to sync orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  // Helper: Calculate seconds left since confirmation (timezone-aware)
  const getEditTimeLeft = (order) => {
    const reference = order.confirmedAt ? new Date(order.confirmedAt) : new Date(order.createdAt);
    const now = new Date();
    // Convert both to restaurant timezone for fair comparison
    const refLocal = new Date(reference.toLocaleString('en-US', { timeZone: timezone }));
    const nowLocal = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const diffSeconds = Math.floor((nowLocal - refLocal) / 1000);
    const maxSeconds = 5 * 60; // 5 minutes
    return Math.max(0, maxSeconds - diffSeconds);
  };

  // Format mm:ss
  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Countdown component (only shows for confirmed orders within time)
  function EditCountdown({ order }) {
    const [timeLeft, setTimeLeft] = useState(getEditTimeLeft(order));

    useEffect(() => {
      if (timeLeft <= 0) return;
      const timer = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000);
      return () => clearInterval(timer);
    }, [timeLeft]);

    if (timeLeft <= 0) return null;

    const isUrgent = timeLeft <= 60;
    return (
      <span className={`text-sm font-medium flex items-center gap-1.5 ${isUrgent ? "text-red-600" : "text-amber-600"}`}>
        <Clock size={14} />
        Edit expires in {formatTimeLeft(timeLeft)}
      </span>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; }

        .op-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5f4f1;
          padding: 0 0 80px;
        }

        /* ── TOP BAR ── */
        .op-topbar {
          position: sticky; top: 0; z-index: 10;
          background: rgba(245,244,241,0.88);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding: 14px 28px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .op-topbar-title {
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase; color: #b0a898;
        }

        /* ── HERO ── */
        .op-hero {
          padding: 48px 28px 36px;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeUp 0.5s ease both;
        }
        @media (min-width: 768px) {
          .op-hero { flex-direction: row; align-items: flex-end; justify-content: space-between; }
        }
        .op-hero-text {}
        .op-hero-eyebrow {
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.24em; text-transform: uppercase;
          color: #c0b4a4; margin-bottom: 10px; display: block;
        }
        .op-hero-title {
          font-size: clamp(36px, 8vw, 64px);
          font-weight: 200;
          color: #1a1a1a;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0 0 8px;
        }
        .op-hero-sub {
          font-size: 14px; font-weight: 300;
          color: #b0a898; font-style: italic;
        }

        /* ── FILTER ── */
        .op-filter-wrap {
          display: flex; align-items: center; gap: 10px;
          background: #fff;
          border: 1px solid #eceae5;
          border-radius: 16px;
          padding: 10px 16px;
          flex-shrink: 0;
        }
        .op-filter-icon { color: #c0b4a4; flex-shrink: 0; }
        .op-filter-select {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 300;
          color: #1a1a1a;
          background: transparent;
          border: none; outline: none;
          cursor: pointer;
          padding-right: 4px;
          appearance: none;
          min-width: 90px;
        }

        /* ── CONTENT ── */
        .op-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* ── LOADING ── */
        .op-loading {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 80px 0; gap: 16px;
        }
        .op-loading-spinner {
          width: 36px; height: 36px;
          border: 1.5px solid #e0ddd8;
          border-top-color: #1a1a1a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .op-loading-text {
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.24em; text-transform: uppercase; color: #c0b4a4;
        }

        /* ── EMPTY ── */
        .op-empty {
          padding: 64px 32px;
          text-align: center;
          background: #fff;
          border: 1px solid #eceae5;
          border-radius: 28px;
        }
        .op-empty-icon { font-size: 42px; margin-bottom: 16px; }
        .op-empty-text {
          font-size: 15px; font-weight: 300;
          color: #b0a898; font-style: italic;
        }

        /* ── ORDER CARD ── */
        .op-order-card {
          background: #fff;
          border: 1px solid #eceae5;
          border-radius: 28px;
          padding: 28px;
          margin-bottom: 14px;
          transition: border-color 0.3s, box-shadow 0.4s, transform 0.3s;
          animation: fadeUp 0.4s ease both;
        }
        @media (min-width: 640px) { .op-order-card { padding: 36px; } }
        .op-order-card:hover {
          border-color: #d8d4cc;
          box-shadow: 0 16px 48px rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }

        /* ── CARD INNER LAYOUT ── */
        .op-card-inner {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .op-card-inner { flex-direction: row; justify-content: space-between; align-items: flex-start; }
        }

        /* ── CARD LEFT ── */
        .op-card-left { flex: 1; }

        .op-card-meta {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap; margin-bottom: 20px;
        }
        .op-card-date {
          font-size: 12px; font-weight: 300;
          color: #b0a898; letter-spacing: 0.02em;
        }
        .op-card-divider {
          width: 1px; height: 14px;
          background: #ddd; flex-shrink: 0;
        }
        .op-card-id {
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.1em; color: #c8c0b4;
          font-style: italic;
        }

        /* ── ITEMS LIST ── */
        .op-items-list { display: flex; flex-direction: column; gap: 10px; }
        .op-item-row { display: flex; align-items: baseline; gap: 10px; }
        .op-item-qty {
          font-size: 13px; font-weight: 300;
          color: #c8c0b4; min-width: 24px; text-align: right;
          flex-shrink: 0;
        }
        .op-item-name {
          font-size: 18px; font-weight: 200;
          color: #1a1a1a; letter-spacing: -0.02em;
          line-height: 1.2;
        }
        @media (min-width: 640px) { .op-item-name { font-size: 22px; } }

        /* ── CARD RIGHT ── */
        .op-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .op-card-right { align-items: flex-end; min-width: 180px; }
        }

        /* ── TOTAL ── */
        .op-total-label {
          font-size: 9px; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #c0b4a4; margin-bottom: 4px;
        }
        .op-total-value-wrap { display: flex; align-items: baseline; gap: 5px; }
        .op-total-value {
          font-size: 36px; font-weight: 200;
          color: #1a1a1a; letter-spacing: -0.04em; line-height: 1;
        }
        @media (min-width: 640px) { .op-total-value { font-size: 42px; } }
        .op-total-currency {
          font-size: 10px; font-weight: 400;
          color: #c0b4a4; letter-spacing: 0.12em; text-transform: uppercase;
        }

        /* ── ACTION BUTTONS ── */
        .op-actions { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        @media (min-width: 768px) { .op-actions { align-items: flex-end; } }

        .op-countdown-wrap {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 12px; font-weight: 300;
          letter-spacing: 0.02em;
        }
        .op-countdown-normal { background: #fffbeb; color: #d97706; }
        .op-countdown-urgent { background: #fff1f0; color: #dc2626; }

        .op-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 22px;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; border: none;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .op-btn:active { transform: scale(0.97); }
        .op-btn-edit {
          background: #f5f4f1;
          color: #1a1a1a;
          border: 1px solid #e8e5e0;
        }
        .op-btn-edit:hover { background: #eceae5; }
        .op-btn-support {
          background: #1a1a1a;
          color: #fff;
        }
        .op-btn-support:hover { background: #000; }
      `}</style>

      <div className="op-page">

        {/* TOP BAR */}
        <div className="op-topbar">
          <span className="op-topbar-title">My Orders</span>
          <div style={{ width: 80 }} />
        </div>

        {/* HERO + FILTER */}
        <div className="op-hero">
          <div className="op-hero-text">
            <span className="op-hero-eyebrow">Order History</span>
            <h1 className="op-hero-title">Your Journey</h1>
            <p className="op-hero-sub">Track and manage your orders</p>
          </div>

          {/* Filter — all original logic intact */}
          <div className="op-filter-wrap">
            <Calendar className="op-filter-icon" size={16} />
            <select
              value={filterMonth}
              onChange={(e) => { setFilterMonth(e.target.value); loadOrders(e.target.value); }}
              className="op-filter-select"
            >
              <option value="">All Time</option>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="op-content">

          {/* LOADING */}
          {loading ? (
            <div className="op-loading">
              <div className="op-loading-spinner" />
              <p className="op-loading-text">Fetching your history</p>
            </div>

          /* EMPTY */
          ) : orders.length === 0 ? (
            <div className="op-empty">
              <div className="op-empty-icon">📋</div>
              <p className="op-empty-text">No orders found for this period.</p>
            </div>

          /* ORDER LIST */
          ) : (
            <div>
              {orders.map((order, orderIdx) => {
                const timeLeft = getEditTimeLeft(order);
                const isPending = order.status === "pending";
                const isConfirmedWithinTime = order.status === "confirmed" && timeLeft > 0;
                const canEdit = isPending || isConfirmedWithinTime;

                return (
                  <div
                    key={order._id}
                    className="op-order-card"
                    style={{ animationDelay: `${orderIdx * 0.06}s` }}
                  >
                    <div className="op-card-inner">

                      {/* LEFT */}
                      <div className="op-card-left">
                        {/* Meta row */}
                        <div className="op-card-meta">
                          <StatusBadge status={order.status} />
                          <div className="op-card-divider" />
                          <span className="op-card-date">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                              timeZone: timezone, // ← NEW: correct timezone
                              day: 'numeric', month: 'short',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                          {order.orderId && (
                            <>
                              <div className="op-card-divider" />
                              <span className="op-card-id">{order.orderId}</span>
                            </>
                          )}
                        </div>

                        {/* Items */}
                        <div className="op-items-list">
                          {order.items.map((item, i) => (
                            <div key={i} className="op-item-row">
                              <span className="op-item-qty">{item.quantity}×</span>
                              <span className="op-item-name">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="op-card-right">
                        {/* Total */}
                        <div>
                          <div className="op-total-label">Total Amount</div>
                          <div className="op-total-value-wrap">
                            <span className="op-total-value">{order.total}</span>
                            <span className="op-total-currency">{currency}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="op-actions">
                          {/* Countdown — confirmed orders within 5 min window */}
                          {order.status === "confirmed" && timeLeft > 0 && (
                            <EditCountdown order={order} />
                          )}

                          {/* Edit button — pending OR confirmed within time */}
                          {canEdit && (
                            <Link
                              href={`/user/cart?edit=${order.orderId}`}
                              className="op-btn op-btn-edit"
                            >
                              <Edit3 size={14} strokeWidth={1.5} />
                              Edit Order
                            </Link>
                          )}

                          {/* Support button */}
                          <a
                            href={`https://wa.me/${order.whatsapp}`}
                            className="op-btn op-btn-support"
                          >
                            <Send size={14} strokeWidth={1.5} />
                            Support
                          </a>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending:   { bg: "#fffbeb", color: "#b45309", border: "#fde68a", label: "Pending" },
    confirmed: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", label: "Confirmed" },
    cancelled: { bg: "#fff1f0", color: "#dc2626", border: "#fecaca", label: "Cancelled" },
    preparing: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", label: "Preparing" },
    ready:     { bg: "#faf5ff", color: "#7e22ce", border: "#e9d5ff", label: "Ready" },
    delivered: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", label: "Delivered" },
  };
  const c = config[status] || { bg: "#f9f9f7", color: "#888", border: "#eceae5", label: status };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "5px 12px",
      borderRadius: 999,
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 9,
      fontWeight: 500,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
    }}>
      {c.label}
    </span>
  );
}

function EditCountdown({ order }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const reference = order.confirmedAt ? new Date(order.confirmedAt) : new Date(order.createdAt);
    const now = new Date();
    // Convert both to restaurant timezone for fair comparison
    const refLocal = new Date(reference.toLocaleString('en-US', { timeZone: timezone }));
    const nowLocal = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const diffSeconds = Math.floor((nowLocal - refLocal) / 1000);
    return Math.max(0, 300 - diffSeconds);
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (timeLeft <= 0) return null;

  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  const isUrgent = timeLeft <= 60;

  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 14px", borderRadius: 999,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12, fontWeight: 300,
        background: isUrgent ? "#fff1f0" : "#fffbeb",
        color: isUrgent ? "#dc2626" : "#d97706",
      }}
    >
      <Clock size={13} strokeWidth={1.5} />
      Edit expires in {min}:{sec.toString().padStart(2, '0')}
    </span>
  );
}