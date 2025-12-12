// app/admin/settings/page.js → FINAL 2025 MOBILE-FIRST LUXURY (LIKE YOUR SAMPLE)

"use client";

import { useState, useEffect } from 'react';
import {
  User, Home, Lock, Bell, CreditCard, Truck,
  Save, CheckCircle
} from 'lucide-react';
import ProfileSettings from '../components/ProfileSettings';
import RestaurantSettings from '../components/RestaurantSettings';
import SecuritySettings from '../components/SecuritySettings';
import NotificationSettings from '../components/NotificationSettings';
import PaymentSettings from '../components/PaymentSettings';
import DeliverySettings from '../components/DeliverySettings';
import AdminFooter from '../../components/footer';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Admin");

  const [profileData, setProfileData] = useState({ fullName: '', email: '', phone: '', address: '' });
  const [restaurantData, setRestaurantData] = useState({ name: '', email: '', phone: '', whatsapp: '', address: '', website: '' });
  const [notificationSettings, setNotificationSettings] = useState({ whatsappNotifications: true, pushNotifications: true, smsNotifications: false });
  const [deliverySettings, setDeliverySettings] = useState({ deliveryEnabled: true, deliveryFee: '5.00', minOrderAmount: '15.00' });

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, settingsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/admin/settings')
        ]);

        if (userRes.ok) {
          const data = await userRes.json();
          setUsername(data.user?.username || "Admin");
        }

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data.profile) setProfileData(data.profile);
          if (data.restaurant) setRestaurantData(prev => ({ ...prev, ...data.restaurant }));
          if (data.notifications) setNotificationSettings(data.notifications);
          if (data.delivery) setDeliverySettings(data.delivery);
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: profileData,
          restaurant: restaurantData,
          notifications: notificationSettings,
          delivery: deliverySettings,
        }),
      });

      if (!res.ok) throw new Error();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'restaurant', label: 'Restaurant', icon: Home },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'delivery', label: 'Delivery', icon: Truck },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-5 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">{username} • Manage your account</p>
      </div>

      {/* SUCCESS MESSAGE */}
      {saveSuccess && (
        <div className="mx-4 mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
          <p className="font-medium text-emerald-800 text-sm">All changes saved!</p>
        </div>
      )}

      {/* MOBILE-FIRST TABS — EXACTLY LIKE YOUR SAMPLE */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="overflow-x-auto hide-scrollbar px-4 py-4">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5
                    rounded-full font-medium whitespace-nowrap
                    transition-all duration-300
                    ${active
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'profile' && <ProfileSettings profileData={profileData} setProfileData={setProfileData} />}
          {activeTab === 'restaurant' && <RestaurantSettings restaurantData={restaurantData} setRestaurantData={setRestaurantData} />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'notifications' && (
            <NotificationSettings
              notificationSettings={notificationSettings}
              setNotificationSettings={setNotificationSettings}
            />
          )}
          {activeTab === 'payment' && <PaymentSettings />}
          {activeTab === 'delivery' && (
            <DeliverySettings
              deliverySettings={deliverySettings}
              setDeliverySettings={setDeliverySettings}
            />
          )}
        </div>
      </div>

      {/* FIXED SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold text-base hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg"
        >
          <Save size={20} />
          Save All Changes
        </button>
      </div>
      <AdminFooter />
      {/* HIDE SCROLLBAR — REQUIRED */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}