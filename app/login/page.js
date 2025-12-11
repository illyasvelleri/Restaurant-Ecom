// app/login/page.js → FINAL 2025 LUXURY LOGIN PAGE

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogIn, Loader2, ChevronLeft, User, MessageCircle } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginMode, setLoginMode] = useState("username"); // "username" or "whatsapp"
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const identifier = formData.get("identifier")?.trim();
    const password = formData.get("password");

    if (!identifier || !password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    const cleanValue = loginMode === "whatsapp" ? identifier.replace(/\D/g, "") : identifier;
    const field = loginMode === "whatsapp" ? "whatsapp" : "username";

    const res = await signIn("credentials", {
      [field]: cleanValue,
      password,
      redirect: false,
      callbackUrl: "/user/menu",
    });

    if (res?.error) {
      toast.error("Invalid credentials");
      setLoading(false);
    } else {
      if (rememberMe) {
        document.cookie = "remember-me=true; path=/; max-age=31536000";
      }
      toast.success("Welcome back!", { style: { background: "#111", color: "#fff" } });
      router.push("/user/menu");
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
              <LogIn size={40} className="text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-4 text-lg text-gray-600 font-light">
              Sign in to continue your journey
            </p>
          </div>

          {/* Toggle: Username / WhatsApp */}
          <div className="flex mb-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <button
              type="button"
              onClick={() => setLoginMode("username")}
              className={`flex-1 py-5 px-6 font-medium text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                loginMode === "username"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <User size={22} />
              Username
            </button>
            <button
              type="button"
              onClick={() => setLoginMode("whatsapp")}
              className={`flex-1 py-5 px-6 font-medium text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                loginMode === "whatsapp"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MessageCircle size={22} />
              WhatsApp
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">
                {loginMode === "whatsapp" ? "WhatsApp Number" : "Username"}
              </label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
                  {loginMode === "whatsapp" ? <MessageCircle size={24} /> : <User size={24} />}
                </div>
                <input
                  name="identifier"
                  type={loginMode === "whatsapp" ? "tel" : "text"}
                  required
                  placeholder={loginMode === "whatsapp" ? "966501234567" : "Enter your username"}
                  className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-amber-100/50 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="w-full px-6 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-amber-100/50 transition-all duration-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-6 h-6 rounded border-gray-300 text-gray-900 focus:ring-amber-500"
                />
                <span className="text-base font-medium text-gray-700">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-base text-gray-900 hover:underline font-medium">
                Forgot password?
              </Link>
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
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={28} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* REGISTER LINK */}
          <div className="mt-10 text-center">
            <p className="text-lg text-gray-600">
              New here?{" "}
              <Link
                href="/register"
                className="font-bold text-gray-900 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}