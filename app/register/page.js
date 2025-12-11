// app/register/page.js → FINAL 2025 LUXURY REGISTER PAGE

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserPlus, Loader2, ChevronLeft, MessageCircle } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.target);
  const data = {
    username: formData.get("username"),
    whatsapp: formData.get("whatsapp") || "",
    password: formData.get("password"),
  };

  if (data.whatsapp) {
    data.whatsapp = data.whatsapp.replace(/\D/g, "");
    if (data.whatsapp.length < 9) {
      toast.error("Please enter a valid WhatsApp number");
      setLoading(false);
      return;
    }
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("Account created! Welcome aboard", { style: { background: "#111", color: "#fff" } });
      router.push("/login");
    } else {
      toast.error(result.error || "Registration failed");
    }
  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12 lg:py-20 mb-32">
      <div className="w-full max-w-md">

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-900 mb-12 text-lg font-medium transition"
        >
          <ChevronLeft size={24} />
          Back to Home
        </Link>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 lg:p-12">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gray-900 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <UserPlus size={40} className="text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">
              Join Us
            </h1>
            <p className="mt-4 text-lg text-gray-600 font-light">
              Create your account in seconds
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Username */}
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">
                Username
              </label>
              <input
                name="username"
                type="text"
                required
                minLength="3"
                placeholder="Choose a username"
                className="w-full px-6 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-amber-100/50 transition-all duration-300"
              />
            </div>

            {/* WhatsApp Number — Optional */}
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">
                WhatsApp Number{" "}
                <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
                  <MessageCircle size={24} />
                </div>
                <input
                  name="whatsapp"
                  type="tel"
                  placeholder="966501234567"
                  pattern="[0-9\s\-+]*"
                  className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-amber-100/50 transition-all duration-300"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">
                We'll send order updates via WhatsApp
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength="6"
                placeholder="Create a strong password"
                className="w-full px-6 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-amber-100/50 transition-all duration-300"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-gray-900 text-white rounded-3xl font-bold text-xl hover:bg-gray-800 hover:shadow-amber-600/30 transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={28} />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={28} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="mt-10 text-center">
            <p className="text-lg text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-gray-900 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}