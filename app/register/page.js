// app/register/page.js → WhatsApp Version (Perfect & Production-Ready)

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
      whatsapp: formData.get("whatsapp") || "", // optional
      password: formData.get("password"),
    };

    // Optional: clean WhatsApp number (remove spaces, dashes, etc.)
    if (data.whatsapp) {
      data.whatsapp = data.whatsapp.replace(/\D/g, ""); // keep only digits
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
        toast.success("Account created! Welcome to Indulge!");
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8">
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl">
              <UserPlus size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Join Indulge</h1>
            <p className="text-gray-600 mt-2">Create your account in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                name="username"
                type="text"
                required
                minLength="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Choose a username"
              />
            </div>

            {/* WhatsApp Number - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <input
                  name="whatsapp"
                  type="tel"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="966 50 123 4567"
                  pattern="[0-9\s\-+]*"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll send order updates via WhatsApp
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Create a strong password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={24} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}