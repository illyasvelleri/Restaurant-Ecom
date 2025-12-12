// app/admin/orders/page.js → FINAL 2025 MOBILE ADMIN (100% PURE JS)

"use client";

import { useState, useEffect } from 'react';
import {
    ShoppingBag, Clock, Truck, CheckCircle2,
    Search, Download, Eye, Phone, MapPin,
    Filter, ChevronDown
} from 'lucide-react';
import OrderModal from '../components/OrderModal';
import toast from 'react-hot-toast';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/orders');
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // FILTERED ORDERS
    const filtered = orders.filter(order => {
        const matchesSearch = searchQuery === "" ||
            (order.orderNumber && order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order.phone && order.phone.includes(searchQuery));

        const matchesFilter = filterStatus === "all" || order.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    // STATS
    const stats = [
        { label: "Total", value: orders.length },
        { label: "Pending", value: orders.filter(o => o.status === "pending").length },
        { label: "Preparing", value: orders.filter(o => o.status === "preparing").length },
        { label: "On Way", value: orders.filter(o => o.status === "on-the-way").length },
        { label: "Delivered", value: orders.filter(o => o.status === "delivered").length },
    ];

    // LABELS
    const statusLabels = {
        all: "All Orders",
        pending: "Pending",
        confirmed: "Confirmed",
        preparing: "Preparing",
        "on-the-way": "On The Way",
        delivered: "Delivered",
        cancelled: "Cancelled"
    };

    // STATUS BADGE
    const getStatusBadge = (status) => {
        const map = {
            pending: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-blue-100 text-blue-800",
            preparing: "bg-indigo-100 text-indigo-800",
            "on-the-way": "bg-purple-100 text-purple-800",
            delivered: "bg-emerald-100 text-emerald-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return map[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                            <p className="text-sm text-gray-500">{orders.length} total</p>
                        </div>
                        <button className="p-3 bg-black text-white rounded-xl shadow-lg">
                            <Download size={20} />
                        </button>
                    </div>



                    {/* REPLACE YOUR ENTIRE FILTER SECTION WITH THIS — ULTRA COMPACT & RESPONSIVE */}

                    <div className="px-4 py-3 bg-white border-b border-gray-100">
                        <div className="flex items-center justify-between gap-4">
                            {/* SEARCH (Compact) */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-3 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                                />
                            </div>

                            {/* COMPACT FILTER DROPDOWN */}
                            <div className="relative">
                                <button
                                    onClick={() => setFilterOpen(!filterOpen)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
                                >
                                    <Filter size={16} />
                                    <span className="hidden sm:inline">
                                        {statusLabels[filterStatus]}
                                    </span>
                                    <span className="sm:hidden">
                                        {filterStatus === "all" ? "All" : statusLabels[filterStatus].split(" ")[0]}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
                                </button>

                                {/* DROPDOWN MENU */}
                                {filterOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                                            {Object.keys(statusLabels).map((key) => {
                                                const count = key === "all" ? orders.length : orders.filter(o => o.status === key).length;
                                                const active = filterStatus === key;

                                                return (
                                                    <button
                                                        key={key}
                                                        onClick={() => {
                                                            setFilterStatus(key);
                                                            setFilterOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-3 text-left flex items-center justify-between text-sm transition-all ${active
                                                                ? "bg-black text-white"
                                                                : "hover:bg-gray-50 text-gray-800"
                                                            }`}
                                                    >
                                                        <span>{statusLabels[key]}</span>
                                                        <span className={`font-bold ${active ? "text-white" : "text-gray-500"}`}>
                                                            {count}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="px-4 py-5 bg-white border-b border-gray-100">
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center min-w-[80px]">
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ORDERS LIST */}
            <div className="pb-32">
                {loading ? (
                    <div className="py-32 text-center">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-32">
                        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                        <p className="text-gray-500 text-lg">No orders found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filtered.map((order) => (
                            <button
                                key={order._id}
                                onClick={() => setSelectedOrder(order)}
                                className="w-full text-left bg-white hover:bg-gray-50 transition"
                            >
                                <div className="px-5 py-5 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}>
                                                {order.status.replace("-", " ")}
                                            </span>
                                        </div>
                                        <p className="font-medium text-gray-900 truncate">{order.customerName}</p>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Phone size={14} /> {order.phone}
                                            </span>
                                            <span className="flex items-center gap-1 truncate">
                                                <MapPin size={14} /> {order.deliveryAddress ? order.deliveryAddress.split(",")[0] : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <p className="text-lg font-bold text-gray-900">{order.total ? order.total.toFixed(2) : "0.00"} SAR</p>
                                            <p className="text-xs text-gray-500">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"} • {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <Eye className="text-gray-400 ml-4" size={22} />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL */}
            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={fetchOrders}
                />
            )}
        </div>
    );
}