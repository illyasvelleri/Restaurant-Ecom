// app/admin/dashboard/page.js → FINAL 2025 DYNAMIC DASHBOARD

"use client";

import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminFooter from '../../components/footer';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchDashboard();
  }, []);

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

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* MOBILE HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
        </div>
      </div>

      {/* KEY STATS — MOBILE COMPACT */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <StatsCard
              title="Revenue Today"
              value={`${stats.todayRevenue || 0}`}
              change={stats.revenueGrowth || 0}
              icon={DollarSign}
              color="from-emerald-500 to-teal-600"
            />
            <StatsCard
              title="Orders Today"
              value={stats.todayOrders || 0}
              change={stats.ordersGrowth || 0}
              icon={ShoppingBag}
              color="from-blue-500 to-blue-600"
            />
            <StatsCard
              title="Total Customers"
              value={stats.totalCustomers || 0}
              change={stats.customersGrowth || 0}
              icon={Users}
              color="from-purple-500 to-purple-600"
            />
            <StatsCard
              title="Active Products"
              value={stats.activeProducts || 0}
              change={stats.productsChange || 0}
              icon={Package}
              color="from-orange-500 to-red-600"
            />
          </div>
        )}
      </div>

      {/* RECENT ORDERS */}
      <div className="px-4 pb-32">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag className="mx-auto text-gray-300 mb-4" size={56} />
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-gray-600">{order.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">{order.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AdminFooter />
    </div>
  );
}

// REUSABLE STATS CARD
function StatsCard({ title, value, change, icon: Icon, color }) {
  const isPositive = change >= 0;
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <Icon size={32} />
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? "text-white" : "text-red-200"}`}>
            <TrendingUp size={16} className={`rotate-${!isPositive ? "180" : "0"}`} />
            {isPositive ? "+" : ""}{change}%
          </div>
        )}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm opacity-90 mt-1">{title}</p>
    </div>
  );
}