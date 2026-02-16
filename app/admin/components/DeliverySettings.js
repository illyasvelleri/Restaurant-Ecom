// components/DeliverySettings.js → FINAL 2025 MOBILE-FIRST LUXURY

"use client";

import { Truck, MapPin, Clock, DollarSign, ShoppingBag } from 'lucide-react';

export default function DeliverySettings({ deliverySettings, setDeliverySettings }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Control your delivery zone & fees</p>
        </div>
      </div>

      {/* DELIVERY ENABLE TOGGLE — PREMIUM CARD */}
      <div className="px-4 py-6">
        <div className={`rounded-2xl p-6 shadow-lg border-2 transition-all ${deliverySettings.deliveryEnabled
            ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400"
            : "bg-gray-100 border-gray-300"
          }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${deliverySettings.deliveryEnabled
                  ? "bg-emerald-600"
                  : "bg-gray-400"
                }`}>
                <Truck className="text-white" size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delivery Service</h3>
                <p className={`font-medium ${deliverySettings.deliveryEnabled ? "text-emerald-700" : "text-gray-600"
                  }`}>
                  {deliverySettings.deliveryEnabled ? "Active • Customers can order delivery" : "Disabled"}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={deliverySettings.deliveryEnabled}
                onChange={(e) => setDeliverySettings(prev => ({ ...prev, deliveryEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-16 h-9 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* SETTINGS FIELDS — MOBILE CARDS */}
      <div className="px-4 py-2 space-y-5">

        {/* Delivery Radius */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <MapPin className="text-orange-600" size={26} />
            <label className="text-lg font-medium text-gray-700">Delivery Radius (km)</label>
          </div>
          <input
            type="number"
            value={deliverySettings.deliveryRadius}
            onChange={(e) => setDeliverySettings(prev => ({ ...prev, deliveryRadius: e.target.value }))}
            placeholder="10"
            className="w-full px-5 py-5 bg-gray-50 rounded-xl text-2xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
            min="1"
          />
          <p className="text-center text-sm text-gray-600 mt-3">Maximum distance for delivery</p>
        </div>

        {/* Delivery Fee */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <DollarSign className="text-emerald-600" size={26} />
            <label className="text-lg font-medium text-gray-700">Delivery Fee</label>
          </div>
          <div className="relative">
            <input
              type="number"
              value={deliverySettings.deliveryFee}
              onChange={(e) => setDeliverySettings(prev => ({ ...prev, deliveryFee: e.target.value }))}
              placeholder="5.00"
              className="w-full px-5 py-5 bg-gray-50 rounded-xl text-2xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-emerald-500 transition"
              step="0.5"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-700"></span>
          </div>
        </div>

        {/* Minimum Order */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <ShoppingBag className="text-purple-600" size={26} />
            <label className="text-lg font-medium text-gray-700">Minimum Order Amount</label>
          </div>
          <div className="relative">
            <input
              type="number"
              value={deliverySettings.minOrderAmount}
              onChange={(e) => setDeliverySettings(prev => ({ ...prev, minOrderAmount: e.target.value }))}
              placeholder="15.00"
              className="w-full px-5 py-5 bg-gray-50 rounded-xl text-2xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-purple-500 transition"
              step="0.5"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-700"></span>
          </div>
          <p className="text-center text-sm text-gray-600 mt-3">Required for delivery orders</p>
        </div>

        {/* Estimated Time */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <Clock className="text-blue-600" size={26} />
            <label className="text-lg font-medium text-gray-700">Estimated Delivery Time</label>
          </div>
          <input
            type="text"
            value={deliverySettings.estimatedTime}
            onChange={(e) => setDeliverySettings(prev => ({ ...prev, estimatedTime: e.target.value }))}
            placeholder="30-45"
            className="w-full px-5 py-5 bg-gray-50 rounded-xl text-2xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-blue-500 transition"
          />
          <p className="text-center text-sm text-gray-600 mt-3">Shown to customers</p>
        </div>
      </div>

      {/* FIXED SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
        <button className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl hover:shadow-xl transition shadow-lg flex items-center justify-center gap-3">
          <Truck size={24} />
          Save Delivery Settings
        </button>
      </div>
    </div>
  );
}