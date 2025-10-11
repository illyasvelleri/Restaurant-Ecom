"use client";

import { useState } from 'react';
import { User, Home, Lock, Bell, CreditCard, Truck, CheckCircle, Save } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProfileSettings from '../components/ProfileSettings';
import RestaurantSettings from '../components/RestaurantSettings';
import SecuritySettings from '../components/SecuritySettings';
import NotificationSettings from '../components/NotificationSettings';
import PaymentSettings from '../components/PaymentSettings';
import DeliverySettings from '../components/DeliverySettings';

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('settings');
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const user = { username: "Admin1", role: "admin" };

  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'admin@restaurantpro.com',
    phone: '+1 234-567-8901',
    address: '123 Main Street, New York, NY 10001'
  });

  const [restaurantData, setRestaurantData] = useState({
    name: 'RestaurantPro',
    description: 'Premium restaurant management system',
    email: 'contact@restaurantpro.com',
    phone: '+1 234-567-8900',
    address: '456 Business Ave, New York, NY 10002',
    website: 'www.restaurantpro.com',
    timezone: 'America/New_York',
    currency: 'USD'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    customerNotifications: true,
    inventoryAlerts: true,
    reportEmails: true
  });

  const [deliverySettings, setDeliverySettings] = useState({
    deliveryEnabled: true,
    deliveryRadius: '10',
    deliveryFee: '5.00',
    minOrderAmount: '15.00',
    estimatedTime: '30-45'
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'restaurant', label: 'Restaurant', icon: Home },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'delivery', label: 'Delivery', icon: Truck },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activePage={activePage} setActivePage={setActivePage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setIsOpen={setSidebarOpen} user={user} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account and restaurant preferences</p>
            </div>

            {saveSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <p className="text-green-800 font-medium">Settings saved successfully!</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-orange-600 border-b-2 border-orange-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'profile' && (
                  <ProfileSettings profileData={profileData} setProfileData={setProfileData} user={user} />
                )}
                {activeTab === 'restaurant' && (
                  <RestaurantSettings restaurantData={restaurantData} setRestaurantData={setRestaurantData} />
                )}
                {activeTab === 'security' && (
                  <SecuritySettings />
                )}
                {activeTab === 'notifications' && (
                  <NotificationSettings notificationSettings={notificationSettings} setNotificationSettings={setNotificationSettings} />
                )}
                {activeTab === 'payment' && (
                  <PaymentSettings />
                )}
                {activeTab === 'delivery' && (
                  <DeliverySettings deliverySettings={deliverySettings} setDeliverySettings={setDeliverySettings} />
                )}
                <div className="pt-6">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}