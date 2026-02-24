// components/admin/StaffOrderView.js

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
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all'); // NEW: status filter state

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