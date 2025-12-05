// app/login/page.js → Best UX in Saudi Arabia (2025 Standard)

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

    // Clean number if WhatsApp mode
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
      } else {
        document.cookie = "remember-me=; path=/; max-age=0";
      }
      toast.success("Welcome back!");
      router.push("/user/menu");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-8">
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl">
              <LogIn size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Login to continue ordering</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setLoginMode("username")}
              className={`flex-1 py-3 px-4 rounded-l-xl font-medium transition-all ${
                loginMode === "username"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <User className="w-5 h-5 inline mr-2" />
              Username
            </button>
            <button
              type="button"
              onClick={() => setLoginMode("whatsapp")}
              className={`flex-1 py-3 px-4 rounded-r-xl font-medium transition-all ${
                loginMode === "whatsapp"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <MessageCircle className="w-5 h-5 inline mr-2" />
              WhatsApp
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {loginMode === "whatsapp" ? "WhatsApp Number" : "Username"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  {loginMode === "whatsapp" ? (
                    <MessageCircle size={20} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <input
                  name="identifier"
                  type={loginMode === "whatsapp" ? "tel" : "text"}
                  required
                  placeholder={
                    loginMode === "whatsapp" ? "966 50 123 4567" : "Enter username"
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  autoComplete={loginMode === "whatsapp" ? "tel" : "username"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Remember me</span>
              </label>
              <Link href="/user/reset-password" className="text-sm text-orange-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={24} />
                  Login with {loginMode === "whatsapp" ? "WhatsApp" : "Username"}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-orange-600 font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}