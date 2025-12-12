// components/RestaurantSettings.js → FINAL 2025 MOBILE-FIRST LUXURY

"use client";

import { 
  Store, Phone, Mail, Globe, MapPin, MessageCircle 
} from 'lucide-react';

export default function RestaurantSettings({ restaurantData, setRestaurantData }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Info</h1>
          <p className="text-sm text-gray-500 mt-1">Update your business details</p>
        </div>
      </div>

      {/* FORM FIELDS — ULTRA MOBILE PERFECT */}
      <div className="px-4 py-6 space-y-5">

        {/* Restaurant Name */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <Store className="text-orange-600" size={24} />
            <label className="text-sm font-medium text-gray-700">Restaurant Name</label>
          </div>
          <input
            type="text"
            value={restaurantData.name || ""}
            onChange={(e) => setRestaurantData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Al Tazaj, Herfy, Shawarmer"
            className="w-full px-5 py-4 bg-gray-50 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        {/* WhatsApp — Highlighted */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
          <div className="flex items-center gap-4 mb-3">
            <MessageCircle className="text-green-600" size={24} />
            <label className="text-sm font-medium text-gray-700">WhatsApp Number (Primary)</label>
          </div>
          <input
            type="tel"
            value={restaurantData.whatsapp || ""}
            onChange={(e) => setRestaurantData(prev => ({ ...prev, whatsapp: e.target.value }))}
            placeholder="+966 50 123 4567"
            className="w-full px-5 py-4 bg-white rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <p className="text-xs text-green-700 mt-2 text-center font-medium">
            Customers will contact you here
          </p>
        </div>

        {/* Email */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <Mail className="text-gray-500" size={22} />
            <label className="text-sm font-medium text-gray-700">Email Address</label>
          </div>
          <input
            type="email"
            value={restaurantData.email || ""}
            onChange={(e) => setRestaurantData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="info@restaurant.com"
            className="w-full px-5 py-4 bg-gray-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        {/* Phone */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <Phone className="text-gray-500" size={22} />
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
          </div>
          <input
            type="tel"
            value={restaurantData.phone || ""}
            onChange={(e) => setRestaurantData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+966 11 234 5678"
            className="w-full px-5 py-4 bg-gray-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <MapPin className="text-gray-500" size={22} />
            <label className="text-sm font-medium text-gray-700">Restaurant Address</label>
          </div>
          <textarea
            value={restaurantData.address || ""}
            onChange={(e) => setRestaurantData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Street, Building, Riyadh"
            className="w-full px-5 py-4 bg-gray-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none"
            rows={3}
          />
        </div>

        {/* Website */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <Globe className="text-gray-500" size={22} />
            <label className="text-sm font-medium text-gray-700">Website (Optional)</label>
          </div>
          <input
            type="url"
            value={restaurantData.website || ""}
            onChange={(e) => setRestaurantData(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://yourrestaurant.com"
            className="w-full px-5 py-4 bg-gray-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>
      </div>

      {/* FIXED SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
        <button className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl hover:shadow-xl transition shadow-lg">
          Save Restaurant Info
        </button>
      </div>
    </div>
  );
}