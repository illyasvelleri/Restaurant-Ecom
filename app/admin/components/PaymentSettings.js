// components/PaymentSettings.js → FINAL 2025 MOBILE-FIRST LUXURY

"use client";

import { CreditCard, Plus } from 'lucide-react';

export default function PaymentSettings() {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500 mt-1">Manage how you get paid</p>
        </div>
      </div>

      {/* PAYMENT CARDS — MOBILE CARD STYLE */}
      <div className="px-4 py-6 space-y-5">

        {/* PRIMARY CARD — HIGHLIGHTED */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-400 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <CreditCard className="text-white" size={36} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">Visa •••• 4242</p>
                <p className="text-gray-700 font-medium">Expires 12/2025</p>
                <span className="inline-block mt-2 px-4 py-1.5 bg-white text-orange-600 text-sm font-bold rounded-full shadow">
                  Primary Payment Method
                </span>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition shadow">
              Edit
            </button>
          </div>
        </div>

        {/* SECONDARY CARD */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <CreditCard className="text-white" size={36} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">Mastercard •••• 8888</p>
                <p className="text-gray-700 font-medium">Expires 06/2026</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">
              Edit
            </button>
          </div>
        </div>

        {/* ADD NEW CARD */}
        <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-300 hover:border-orange-400 transition-all cursor-pointer">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Plus className="text-orange-600" size={40} />
            </div>
            <p className="text-xl font-bold text-gray-900">Add Payment Method</p>
            <p className="text-gray-600 mt-2">Connect bank account or card</p>
          </div>
        </div>
      </div>

      {/* FIXED SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
        <button className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl hover:shadow-xl transition shadow-lg flex items-center justify-center gap-3">
          <CreditCard size={24} />
          Save Payment Settings
        </button>
      </div>
    </div>
  );
}