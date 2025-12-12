// components/ProfileSettings.js → FINAL 2025 MOBILE-FIRST (NO ROLE, NO ERRORS)

"use client";

import { Camera, Mail, Phone, MapPin, User } from 'lucide-react';
import Image from 'next/image';

export default function ProfileSettings({ profileData, setProfileData }) {
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Update your personal details</p>
        </div>
      </div>

      {/* AVATAR + NAME */}
      <div className="px-4 py-8 bg-white border-b border-gray-100">
        <div className="flex items-center gap-5">
          <div className="relative">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-orange-100 shadow-2xl bg-gray-200">
              {profileData.avatar ? (
                <Image
                  src={profileData.avatar}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profileData.fullName?.[0]?.toUpperCase() || "A"}
                </div>
              )}
            </div>

            {/* Camera Button */}
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:bg-gray-800 transition">
              <Camera size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profileData.fullName || "Admin"}
            </h2>
            <p className="text-gray-600 mt-1">Restaurant Owner</p>
          </div>
        </div>
      </div>

      {/* FORM FIELDS — MOBILE PERFECT */}
      <div className="px-4 py-6 space-y-5">

        {/* Full Name */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <User className="text-gray-500" size={22} />
            <label className="text-sm font-medium text-gray-700">Full Name</label>
          </div>
          <input
            type="text"
            value={profileData.fullName || ""}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        {/* Email */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <Mail className="text-gray-500" size={22} />
            <label className="text-sm font-medium text-gray-700">Email Address</label>
          </div>
          <input
            type="email"
            value={profileData.email || ""}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
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
            value={profileData.phone || ""}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+966 50 123 4567"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <MapPin className="text-gray-500" size={22} />
            <label className="text-sm font-medium text-gray-700">Delivery Address</label>
          </div>
          <textarea
            value={profileData.address || ""}
            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Street, Building, Floor, Apartment..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none"
          />
        </div>
      </div>

      {/* FIXED SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
        <button className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl hover:shadow-xl transition shadow-lg">
          Save Changes
        </button>
      </div>
    </div>
  );
}