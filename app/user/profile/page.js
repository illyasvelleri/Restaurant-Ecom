// app/user/profile/page.js → WhatsApp-First + Free City + Zero Errors (2025 Ready)

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  User,
  MessageCircle,
  Mail,
  MapPin,
  Home,
  Building2,
  Save,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    address: "",
    building: "",
    floor: "",
    apartment: "",
    neighborhood: "",
    city: "",
    pincode: "",
    notes: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();

        setForm({
          name: data.name || session.user.name || session.user.username || "User",
          whatsapp: data.whatsapp || session.user.whatsapp || "",
          email: data.email || "",
          address: data.address || "",
          building: data.building || "",
          floor: data.floor || "",
          apartment: data.apartment || "",
          neighborhood: data.neighborhood || "",
          city: data.city || "",
          pincode: data.pincode || "",
          notes: data.notes || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session]);

  const handleSave = async () => {
    if (!form.whatsapp) {
      toast.error("WhatsApp number is required for delivery updates");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
        await update({
          user: {
            ...session?.user,
            name: form.name,
            whatsapp: form.whatsapp,
          },
        });
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save profile");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
              {form.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-4xl font-bold text-gray-900">My Delivery Profile</h1>
            <p className="text-gray-600 mt-3 text-lg">
              Works in any city worldwide — Riyadh, Dubai, Cairo...
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Full Name */}
            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">
                <User size={22} /> Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition text-lg"
                placeholder="Mohammed Ahmed"
                required
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">
                <MessageCircle size={22} className="text-green-600" /> WhatsApp Number{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) =>
                  setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, "") })
                }
                className="w-full px-6 py-4 border-2 border-green-200 rounded-2xl focus:ring-4 focus:ring-green-300 focus:border-green-500 transition text-lg font-mono"
                placeholder="966501234567"
                maxLength="15"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                We'll send order updates here
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">
                <Mail size={22} /> Email (Optional)
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-300"
                placeholder="you@example.com"
              />
            </div>

            {/* City - Free Text */}
            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">
                <MapPin size={22} /> City / Governorate <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-orange-300"
                placeholder="Riyadh, Dubai, Cairo, Amman..."
                required
              />
            </div>

            {/* Neighborhood */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">
                <Home size={22} /> Neighborhood / Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.neighborhood}
                onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-orange-300"
                placeholder="Al Olaya, Downtown, Zamalek..."
                required
              />
            </div>

            {/* Street Address */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">
                <MapPin size={22} /> Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl resize-none focus:ring-4 focus:ring-orange-300"
                placeholder="King Fahd Road, near Kingdom Tower..."
                required
              />
            </div>

            {/* Building & Floor */}
            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">
                <Building2 size={22} /> Building / Villa
              </label>
              <input
                type="text"
                value={form.building}
                onChange={(e) => setForm({ ...form, building: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl"
                placeholder="Building 45"
              />
            </div>

            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">Floor</label>
              <input
                type="text"
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl"
                placeholder="3rd Floor"
              />
            </div>

            {/* Apartment & Postal Code */}
            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">Apartment No.</label>
              <input
                type="text"
                value={form.apartment}
                onChange={(e) => setForm({ ...form, apartment: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl"
                placeholder="Apt 501"
              />
            </div>

            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">Postal Code (Optional)</label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl"
                placeholder="13321"
              />
            </div>

            {/* Extra Notes */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-3">Extra Notes (Optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl resize-none"
                placeholder="Gate code: 1234, call on arrival..."
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-12 text-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-4 px-16 py-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xl rounded-3xl hover:shadow-2xl transition-all hover:scale-105 disabled:opacity-70 shadow-xl"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={36} />
              ) : (
                <Save size={36} />
              )}
              {saving ? "Saving..." : "Save Delivery Info"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}