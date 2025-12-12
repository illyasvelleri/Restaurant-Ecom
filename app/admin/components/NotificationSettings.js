// components/NotificationSettings.js → FINAL 2025 MOBILE-FIRST LUXURY (WHATSAPP-FIRST)

"use client";

import { MessageCircle, Bell, Smartphone, Check } from 'lucide-react';

export default function NotificationSettings({ notificationSettings, setNotificationSettings }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">Choose how you want to be notified</p>
        </div>
      </div>

      {/* MAIN CHANNELS — MOBILE CARDS */}
      <div className="px-4 py-6 space-y-5">

        {/* WhatsApp — PRIMARY & HIGHLIGHTED */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                <MessageCircle className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">WhatsApp Alerts</h3>
                <p className="text-green-700 font-medium">Recommended • Instant delivery</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.whatsappNotifications || true}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, whatsappNotifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Bell className="text-white" size={30} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Push Notifications</h3>
                <p className="text-gray-600">On this device</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>

        {/* SMS */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Smartphone className="text-white" size={30} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">SMS Alerts</h3>
                <p className="text-gray-600">Extra cost may apply</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* NOTIFICATION TYPES */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5">What to notify me about</h2>
        <div className="space-y-4">
          {[
            { key: 'orderNotifications', label: 'New Orders', desc: 'Instant alert when someone places an order' },
            { key: 'customerNotifications', label: 'Customer Messages', desc: 'When customers message you on WhatsApp' },
            { key: 'inventoryAlerts', label: 'Low Stock Alert', desc: 'When items are running low' },
            { key: 'reportEmails', label: 'Daily Report', desc: 'End-of-day summary at 11 PM' }
          ].map((item) => (
            <label key={item.key} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:shadow-md transition">
              <input
                type="checkbox"
                checked={notificationSettings[item.key]}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                className="w-6 h-6 text-orange-600 rounded focus:ring-orange-500 border-gray-300 mt-1"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
              {notificationSettings[item.key] && (
                <Check className="text-emerald-600" size={24} />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* FIXED SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
        <button className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl hover:shadow-xl transition shadow-lg flex items-center justify-center gap-3">
          <Bell size={24} />
          Save Preferences
        </button>
      </div>
    </div>
  );
}