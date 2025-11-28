// app/user/profile/page.js → ENGLISH + SAUDI DELIVERY (CLEAN & MODERN)

"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { User, Mail, Phone, MapPin, Home, Building2, Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "",
    building: "", floor: "", apartment: "", pincode: "", neighborhood: "", city: "Riyadh"
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user) return setLoading(false);
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          setForm({
            name: data.name || session.user.username || "User",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            building: data.building || "",
            floor: data.floor || "",
            apartment: data.apartment || "",
            pincode: data.pincode || "",
            neighborhood: data.neighborhood || "",
            city: data.city || "Riyadh"
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };
    loadProfile();
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        toast.success("Delivery information saved successfully!");
        await update({ user: { ...session?.user, name: form.name } });
      } else {
        toast.error("Failed to save profile");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-10">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
              {form.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Delivery Information</h1>
            <p className="text-gray-600 mt-3 text-lg">Please fill all fields accurately for smooth delivery</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2">
                <User size={22} /> Full Name <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} 
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition" 
                placeholder="Mohammed Ahmed" />
            </div>

            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2">
                <Phone size={22} /> Phone Number <span className="text-red-500">*</span>
              </label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-orange-300" 
                placeholder="+966 50 123 4567" />
            </div>

            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2">
                <MapPin size={22} /> City
              </label>
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl" placeholder="Riyadh" />
            </div>

            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2">
                <Home size={22} /> Neighborhood / District <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl" placeholder="Al Malqa" />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2">
                <MapPin size={22} /> Street Address <span className="text-red-500">*</span>
              </label>
              <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={3}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl resize-none focus:ring-4 focus:ring-orange-300"
                placeholder="Prince Turki Bin Abdulaziz Road" />
            </div>

            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2"><Building2 size={22} /> Building / Villa</label>
              <input type="text" value={form.building} onChange={e => setForm({ ...form, building: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl" placeholder="Building 45" />
            </div>

            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2">Floor</label>
              <input type="text" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl" placeholder="2nd Floor" />
            </div>
            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2">Apartment No.</label>
              <input type="text" value={form.apartment} onChange={e => setForm({ ...form, apartment: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl" placeholder="201" />
            </div>

            <div>
              <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2">Postal Code</label>
              <input type="text" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl" placeholder="12345" />
            </div>
          </div>

          <div className="mt-12 text-center">
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-4 px-14 py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl transition-all hover:scale-105 disabled:opacity-70">
              {saving ? <Loader2 className="animate-spin" size={32} /> : <Save size={32} />}
              {saving ? "Saving..." : "Save Delivery Info"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}