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
      if (!session?.user) return setLoading(false);

      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();

        setForm({
          name: data.name || session.user.name || "User",
          whatsapp: data.whatsapp || "",
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
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    loadProfile();
  }, [session]);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.whatsapp) return toast.error("WhatsApp number required");

    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Profile updated!");
        await update({
          user: {
            ...session?.user,
            name: form.name,
            whatsapp: form.whatsapp,
          },
        });
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save");
      }
    } catch {
      toast.error("Network error. Try again.");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={45} className="animate-spin text-orange-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-white py-28">
      <div className="max-w-4xl mx-auto px-6 pt-16">

        {/* Container */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-12">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="w-28 h-28 rounded-full bg-black text-white flex items-center justify-center text-4xl font-semibold mx-auto shadow-xl">
              {form.name.charAt(0).toUpperCase()}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mt-6 text-gray-900">
              My Delivery Profile
            </h1>

            <p className="text-gray-500 mt-2">
              Works in all cities — Riyadh · Dubai · Jeddah · Cairo · Amman
            </p>
          </div>

          {/* Form */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Name */}
            <Field
              icon={<User size={20} />}
              label="Full Name"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Mohammed Ahmed"
            />

            {/* WhatsApp */}
            <Field
              icon={<MessageCircle size={20} />}
              label="WhatsApp Number"
              required
              type="tel"
              value={form.whatsapp}
              onChange={(e) =>
                updateField("whatsapp", e.target.value.replace(/\D/g, ""))
              }
              placeholder="966501234567"
              helper="Order & delivery updates will be sent here"
            />

            {/* Email */}
            <Field
              icon={<Mail size={20} />}
              label="Email (Optional)"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@example.com"
            />

            {/* City */}
            <Field
              icon={<MapPin size={20} />}
              label="City / Governorate"
              required
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Riyadh, Dubai, Cairo..."
            />

            {/* Neighborhood */}
            <Field
              icon={<Home size={20} />}
              label="Neighborhood / Area"
              required
              className="md:col-span-2"
              value={form.neighborhood}
              onChange={(e) => updateField("neighborhood", e.target.value)}
              placeholder="Al Olaya, Downtown..."
            />

            {/* Address */}
            <FieldTextarea
              icon={<MapPin size={20} />}
              label="Street Address"
              required
              className="md:col-span-2"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="King Fahd Road, near Kingdom Tower..."
            />

            {/* Building */}
            <Field
              icon={<Building2 size={20} />}
              label="Building / Villa"
              value={form.building}
              onChange={(e) => updateField("building", e.target.value)}
              placeholder="Building 45"
            />

            {/* Floor */}
            <Field
              label="Floor"
              value={form.floor}
              onChange={(e) => updateField("floor", e.target.value)}
              placeholder="3rd Floor"
            />

            {/* Apartment */}
            <Field
              label="Apartment No."
              value={form.apartment}
              onChange={(e) => updateField("apartment", e.target.value)}
              placeholder="Apt 501"
            />

            {/* Postal */}
            <Field
              label="Postal Code (Optional)"
              value={form.pincode}
              onChange={(e) => updateField("pincode", e.target.value)}
              placeholder="13321"
            />

            {/* Notes */}
            <FieldTextarea
              label="Extra Notes (Optional)"
              className="md:col-span-2"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Gate code: 1234, call when near..."
            />
          </div>

          {/* Save Button */}
          <div className="text-center mt-14">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-3 px-14 py-5 rounded-2xl 
                         bg-black text-white text-xl font-semibold 
                         hover:bg-gray-900 transition disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={26} />}
              {saving ? "Saving..." : "Save Delivery Info"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Reusable Minimal Premium Fields    */
/* ---------------------------------- */

function Field({ icon, label, required, helper, className, ...props }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-2 mb-2 font-medium text-gray-800">
        {icon} {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        {...props}
        className="w-full px-5 py-4 border border-gray-300 rounded-2xl 
                   focus:ring-2 focus:ring-black focus:border-black 
                   transition text-lg bg-white"
      />

      {helper && <p className="text-sm text-gray-500 mt-1">{helper}</p>}
    </div>
  );
}

function FieldTextarea({ icon, label, required, className, ...props }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-2 mb-2 font-medium text-gray-800">
        {icon} {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        {...props}
        className="w-full px-5 py-4 border border-gray-300 rounded-2xl 
                   resize-none focus:ring-2 focus:ring-black 
                   focus:border-black text-lg"
      />
    </div>
  );
}
