// components/OrderModal.js → FINAL WITH STATUS UPDATE

"use client";

import { useState } from 'react';
import { X, Phone, MapPin, Clock, Package, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "preparing", label: "Preparing", color: "bg-indigo-100 text-indigo-800" },
  { value: "on-the-way", label: "On The Way", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Delivered", color: "bg-emerald-100 text-emerald-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function OrderModal({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const updateStatus = async () => {
    if (status === order.status) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();
      toast.success("Status updated!");
      onUpdate?.(); // Refresh list
    } catch {
      toast.error("Failed to update");
      setStatus(order.status);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full">
            <X size={28} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-2xl font-bold">{order.orderNumber}</p>
            </div>

            {/* STATUS SELECTOR */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />

              {/* Save Button */}
              {status !== order.status && (
                <button
                  onClick={updateStatus}
                  disabled={saving}
                  className="mt-3 w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition"
                >
                  {saving ? "Saving..." : "Update Status"}
                </button>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2"><Phone size={16} /> Customer</p>
              <p className="font-bold text-lg">{order.customerName}</p>
              <p className="text-gray-600">{order.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2"><Clock size={16} /> Time</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-2 mb-2"><MapPin size={16} /> Delivery</p>
            <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
            {order.notes && <p className="text-sm text-gray-600 mt-2 italic">"{order.notes}"</p>}
          </div>

          {/* Items */}
          <div>
            <p className="font-bold text-lg mb-3 flex items-center gap-2"><Package size={20} /> Items ({order.items.length})</p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="font-medium">{item.quantity} × {item.name}</p>
                    {item.note && <p className="text-sm text-gray-500 italic">{item.note}</p>}
                  </div>
                  <p className="font-bold">{(item.price * item.quantity).toFixed(2)} SAR</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-6">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>{order.total.toFixed(2)} SAR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}