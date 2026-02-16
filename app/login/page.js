// app/login/page.js → READABLE PRO LUXURY
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, ChevronLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState("username");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const identifier = formData.get("identifier")?.trim();
    const password = formData.get("password");

    const res = await signIn("credentials", {
      [loginMode === "whatsapp" ? "whatsapp" : "username"]: loginMode === "whatsapp" ? identifier.replace(/\D/g, "") : identifier,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Access Denied");
      setLoading(false);
    } else {
      toast.success("Identity Verified");
      router.push("/user/menu");
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      
      {/* LEFT SIDE: ATMOSPHERE (Visible only on PC) */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative p-20 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-white/10 blur-[120px] rounded-full" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
          <Link href="/" className="text-white text-sm font-bold tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity flex items-center gap-3">
            <ChevronLeft size={18} /> Back to Home
          </Link>
        </motion.div>

        <div className="relative z-10">
          <h2 className="text-8xl font-light text-white tracking-tighter leading-tight">
            Fine <br />
            <span className="font-serif italic text-white/30">Dining.</span>
          </h2>
        </div>
        <div className="relative z-10 text-xs font-bold text-white/20 tracking-[0.5em] uppercase">
          SECURE ACCESS PORTAL
        </div>
      </div>

      {/* RIGHT SIDE: INTERFACE (Mobile + PC) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#fdfdfd]">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile Back Button */}
          <Link href="/" className="lg:hidden flex items-center gap-2 text-sm font-bold tracking-wide text-gray-500 mb-10 uppercase">
            <ChevronLeft size={16} /> Back
          </Link>

          <header className="mb-12">
            <h1 className="text-5xl font-light tracking-tight text-black mb-4">
              Sign <span className="font-serif italic text-gray-400">In</span>
            </h1>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Identify yourself to proceed</p>
          </header>

          {/* TOGGLE - Clean & Visible */}
          <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-10 relative border border-gray-200/50">
            {["username", "whatsapp"].map((mode) => (
              <button
                key={mode}
                onClick={() => setLoginMode(mode)}
                className={`relative z-10 flex-1 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  loginMode === mode ? "text-black" : "text-gray-500"
                }`}
              >
                {mode}
              </button>
            ))}
            <motion.div 
              className="absolute top-1.5 bottom-1.5 left-1.5 bg-white rounded-xl shadow-md"
              initial={false}
              animate={{ width: "calc(50% - 6px)", x: loginMode === "username" ? "0%" : "100%" }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Input 1 */}
            <div className="group space-y-3">
              <label className="text-xs font-bold tracking-widest text-gray-500 uppercase ml-1 group-focus-within:text-black transition-colors">
                {loginMode === "username" ? "Your Username" : "WhatsApp Number"}
              </label>
              <input
                name="identifier"
                type={loginMode === "whatsapp" ? "tel" : "text"}
                required
                placeholder={loginMode === "whatsapp" ? "+966 ••• •••" : "e.g. alex_chef"}
                className="w-full bg-white border border-gray-200 rounded-2xl py-5 px-6 text-[16px] text-black placeholder:text-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm"
              />
            </div>

            {/* Input 2 */}
            <div className="group space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold tracking-widest text-gray-500 uppercase group-focus-within:text-black transition-colors">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-gray-400 hover:text-black transition-colors underline underline-offset-4">Forgot?</Link>
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 rounded-2xl py-5 px-6 text-[16px] text-black placeholder:text-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-black text-white rounded-2xl py-5 text-sm font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Authorize <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <footer className="mt-12 text-center">
            <p className="text-sm font-medium text-gray-500">
              New here?{" "}
              <Link href="/register" className="text-black font-bold underline underline-offset-4 hover:text-gray-600 ml-1 transition-colors">
                Create Account
              </Link>
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}