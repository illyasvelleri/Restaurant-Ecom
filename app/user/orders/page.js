"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Send, Calendar, Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [currency, setCurrency] = useState("SAR");
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
      }
    } catch (err) {
      toast.error("Failed to sync orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const isEditable = (createdAt) => {
    const diff = (new Date() - new Date(createdAt)) / 1000 / 60;
    return diff < 5; // 5 minute window
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-32">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 tracking-tighter mb-4">
              Your Journey
            </h1>
            <p className="text-xl text-gray-400 font-light">Track and manage your orders</p>
          </div>

          {/* Monthly Filter */}
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-[2rem] border border-gray-100">
            <Calendar className="ml-4 text-gray-400" size={20} />
            <select 
              value={filterMonth}
              onChange={(e) => { setFilterMonth(e.target.value); loadOrders(e.target.value); }}
              className="bg-transparent border-none focus:ring-0 text-gray-900 pr-8 font-medium"
            >
              <option value="">All Time</option>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
           <div className="py-20 text-center text-gray-400 animate-pulse tracking-[0.3em]">FETCHING HISTORY...</div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400">No orders found for this period.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {orders.map((order) => (
              <div key={order._id} className="group bg-white border border-gray-100 rounded-[3rem] p-8 md:p-12 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  {/* Left: Info */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-6">
                      <StatusBadge status={order.status} />
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500 font-light">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="space-y-4 mb-8">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 text-2xl font-light text-gray-900">
                          <span className="text-gray-300">{item.quantity}×</span>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col items-end justify-between min-w-[200px]">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Total Amount</p>
                      <p className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tighter">
                        {order.total} <span className="text-lg font-light text-gray-400">{currency}</span>
                      </p>
                    </div>

                    <div className="flex gap-3 mt-8">
                      {isEditable(order.createdAt) && order.status === "pending" && (
                        <Link 
                          href={`/user/cart?edit=${order.orderId}`}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-colors font-medium"
                        >
                          <Edit3 size={18} /> Edit
                        </Link>
                      )}
                      <a 
                        href={`https://wa.me/${order.whatsapp}`}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-black transition-colors font-medium shadow-xl"
                      >
                        <Send size={18} /> Support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
    confirmed: "bg-green-50 text-green-600 border-green-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span className={`px-4 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${styles[status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
      {status}
    </span>
  );
}