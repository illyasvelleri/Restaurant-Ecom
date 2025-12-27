// app/user/settings/page.js

"use client";

import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { Bell, Shield, MapPin, Save, Loader2 } from "lucide-react";

export default function UserSettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications, location })
      });
      toast.success("Settings saved!");
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 py-28">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-center mb-4">Settings</h1>
        <p className="text-center text-gray-600 mb-12">Manage your preferences</p>

        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Bell size={24} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Get updates about your orders</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full transition-all ${notifications ? 'bg-orange-500' : 'bg-gray-300'} relative`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-1 transition-all ${notifications ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <MapPin size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Location Access</h3>
                  <p className="text-sm text-gray-600">For faster delivery</p>
                </div>
              </div>
              <button
                onClick={() => setLocation(!location)}
                className={`w-14 h-8 rounded-full transition-all ${location ? 'bg-green-500' : 'bg-gray-300'} relative`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-1 transition-all ${location ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="pt-8 text-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl transition-all hover:scale-105 disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}