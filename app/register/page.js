// app/register/page.js → CINEMATIC PRO LUXURY 2026
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, ChevronLeft, UserPlus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [usernameStatus, setUsernameStatus] = useState({ loading: false, available: null });
  const [whatsappStatus, setWhatsappStatus] = useState({ loading: false, available: null });
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  // Add this function inside RegisterPage
  const checkUsername = async (name) => {
    if (name.length < 3) {
      setUsernameStatus({ loading: false, available: null });
      return;
    }

    setUsernameStatus({ loading: true, available: null });
    try {
      const res = await fetch(`/api/auth/check-availability?username=${name}`);
      const data = await res.json();
      setUsernameStatus({ loading: false, available: data.available });
    } catch (err) {
      setUsernameStatus({ loading: false, available: null });
    }
  };


  // 2. Add this function inside your component
  const checkWhatsappLive = async (number) => {
    const cleanNumber = number.replace(/\D/g, "");

    if (cleanNumber.length < 9) {
      setWhatsappStatus({ loading: false, available: null });
      return;
    }

    setWhatsappStatus({ loading: true, available: null });
    try {
      const res = await fetch(`/api/auth/check-availability?whatsapp=${cleanNumber}`);
      const data = await res.json();
      setWhatsappStatus({ loading: false, available: data.available });
    } catch (err) {
      setWhatsappStatus({ loading: false, available: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      username: formData.get("username"),
      whatsapp: formData.get("whatsapp")?.trim() || "",
      password: formData.get("password"),
    };

    if (data.whatsapp) {
      data.whatsapp = data.whatsapp.replace(/\D/g, "");
      if (data.whatsapp.length < 9) {
        toast.error("Invalid WhatsApp number");
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

      if (res.ok) {
        toast.success("Membership Confirmed");
        router.push("/login");
      } else {
        const result = await res.json();
        toast.error(result.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">

      {/* LEFT SIDE: THE ATMOSPHERE (Visible only on PC) */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative p-20 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-white/10 blur-[120px] rounded-full" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
          <Link href="/" className="text-white text-sm font-bold tracking-[0.3em] uppercase opacity-70 hover:opacity-100 transition-opacity flex items-center gap-3">
            <ChevronLeft size={20} /> Return to Maison
          </Link>
        </motion.div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl font-light text-white tracking-tighter leading-none"
          >
            Join <br />
            <span className="font-serif italic text-white/30">The Elite.</span>
          </motion.h2>
          <p className="mt-10 text-white/40 text-sm font-medium tracking-[0.2em] uppercase max-w-sm leading-relaxed">
            Unlock priority reservations and tailor-made culinary experiences.
          </p>
        </div>

        <div className="relative z-10 text-xs font-bold text-white/20 tracking-[0.6em] uppercase">
          EST. 2026 • CREATING IDENTITY
        </div>
      </div>

      {/* RIGHT SIDE: THE INTERFACE (Mobile + PC) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#fdfdfd] lg:bg-white overflow-y-auto">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] py-12"
        >
          {/* Mobile Back Button */}
          <Link href="/" className="lg:hidden flex items-center gap-2 text-sm font-bold tracking-wide text-gray-500 mb-10 uppercase">
            <ChevronLeft size={18} /> Back
          </Link>

          <header className="mb-12">
            <h1 className="text-5xl font-light tracking-tight text-black mb-4">
              Create <span className="font-serif italic text-gray-400">Account</span>
            </h1>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Provide your credentials below</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Username */}
            <div className="group space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold tracking-widest text-gray-500 uppercase group-focus-within:text-black transition-colors">
                  Username
                </label>
                {usernameStatus.available === false && (
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Already Taken</span>
                )}
                {usernameStatus.available === true && (
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Available</span>
                )}
              </div>
              <input
                name="username"
                type="text"
                required
                onChange={(e) => checkUsername(e.target.value)} // Trigger the check
                placeholder="e.g. alex_chef"
                className={`w-full bg-white border ${usernameStatus.available === false ? "border-red-200" : "border-gray-200"
                  } rounded-2xl py-5 px-6 text-[16px] text-black focus:outline-none focus:border-black transition-all shadow-sm`}
              />
            </div>

            {/* WhatsApp */}
            {/* WhatsApp */}
            <div className="group space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold tracking-widest text-gray-500 uppercase group-focus-within:text-black transition-colors">
                  WhatsApp Number
                </label>
                <div className="flex gap-2 items-center">
                  {whatsappStatus.available === false && (
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Already Linked</span>
                  )}
                  {whatsappStatus.available === true && (
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">New Number</span>
                  )}
                  <span className="text-[11px] font-bold text-gray-300 uppercase tracking-tighter italic">Optional</span>
                </div>
              </div>
              <input
                name="whatsapp"
                type="tel"
                onChange={(e) => checkWhatsappLive(e.target.value)}
                placeholder="966 ••• ••• •••"
                className={`w-full bg-white border ${whatsappStatus.available === false ? "border-red-200" : "border-gray-200"
                  } rounded-2xl py-5 px-6 text-[16px] text-black focus:outline-none focus:border-black transition-all shadow-sm`}
              />
            </div>

            {/* Password */}
            <div className="group space-y-3">
              <label className="text-xs font-bold tracking-widest text-gray-500 uppercase ml-1 group-focus-within:text-black transition-colors">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength="6"
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 rounded-2xl py-5 px-6 text-[16px] text-black placeholder:text-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-black text-white rounded-2xl py-6 text-sm font-bold tracking-[0.3em] uppercase hover:bg-neutral-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Register Identity <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <footer className="mt-16 text-center">
            <p className="text-sm font-medium text-gray-500">
              Already a member?{" "}
              <Link href="/login" className="text-black font-bold underline underline-offset-4 hover:text-gray-600 ml-1 transition-colors">
                Sign In
              </Link>
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}