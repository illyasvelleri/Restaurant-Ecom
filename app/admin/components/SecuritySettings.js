// components/SecuritySettings.js → FINAL 2025 MOBILE-FIRST LUXURY

"use client";

import { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, Lock } from 'lucide-react';

export default function SecuritySettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Security</h1>
          <p className="text-sm text-gray-500 mt-1">Keep your account safe</p>
        </div>
      </div>

      {/* 2FA CARD — PREMIUM LOOK */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Shield className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-gray-600 mt-1">Add an extra layer of security with 2FA via WhatsApp or Authenticator app</p>
            </div>
          </div>
          <button className="mt-5 w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg">
            Enable 2FA
          </button>
        </div>
      </div>

      {/* CHANGE PASSWORD SECTION */}
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-3">
          <Lock size={24} className="text-orange-600" />
          Change Password
        </h2>

        <div className="space-y-5">

          {/* Current Password */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrent ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter strong password"
                className="w-full px-5 py-4 bg-gray-50 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNew ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Use 8+ characters with letters, numbers & symbols</p>
          </div>

          {/* Confirm Password */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat new password"
                className="w-full px-5 py-4 bg-gray-50 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* FIXED SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
        <button className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl hover:shadow-xl transition shadow-lg flex items-center justify-center gap-3">
          <Lock size={24} />
          Update Password
        </button>
      </div>
    </div>
  );
}