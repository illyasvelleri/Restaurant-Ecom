// app/user/orders/page.js

"use client";

import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/user/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="text-yellow-500" />;
      case "confirmed": return <CheckCircle className="text-green-500" />;
      case "cancelled": return <XCircle className="text-red-500" />;
      default: return <Package className="text-orange-500" />;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">Loading your orders...</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 py-28">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-4xl font-extrabold text-center mb-4">My Orders</h1>
        <p className="text-center text-gray-600 mb-12">Track your recent WhatsApp orders</p>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={80} className="mx-auto mb-6 text-gray-300" />
            <p className="text-2xl text-gray-600">No orders yet</p>
            <p className="text-gray-500 mt-2">Your WhatsApp orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <span className="font-bold capitalize">{order.status}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-gray-700">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{item.price} SAR</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-bold text-xl">Total: {order.total} SAR</span>
                  <a
                    href={`https://wa.me/${order.whatsapp}?text=${encodeURIComponent("Hi, regarding my order from " + new Date(order.createdAt).toLocaleDateString())}`}
                    target="_blank"
                    className="px-5 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <Send size={18} />
                    Contact Restaurant
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}