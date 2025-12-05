"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  User,
  LogIn,
  UserPlus,
  Settings,
  Package,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfileIcon() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;

  return (
    <div className="relative select-none">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all shadow-sm backdrop-blur-md"
      >
        {status === "loading" ? (
          <div className="w-10 h-10 bg-gray-300/20 rounded-full animate-pulse" />
        ) : user ? (
          <>
            {/* Profile Initial */}
            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg border border-white/20 shadow">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <span className="hidden md:block text-white/80 font-medium">
              {user.name}
            </span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/20">
              <User size={20} className="text-white/60" />
            </div>

            <span className="hidden md:block text-white/70 font-medium">
              Login
            </span>
          </>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <>
          {/* Overlay to close */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 mt-3 w-72 bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

            {/* LOGGED-IN VIEW */}
            {user ? (
              <>
                {/* Header */}
                <div className="px-5 py-4 bg-white/5 border-b border-white/10">
                  <p className="text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-white/50">
                    {user.email || "user@restaurant.com"}
                  </p>
                </div>

                {/* Links */}
                <div className="py-2 text-white/80">
                  <Link
                    href="/user/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all"
                  >
                    <User size={18} />
                    My Profile
                  </Link>

                  <Link
                    href="/user/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all"
                  >
                    <Package size={18} />
                    My Orders
                  </Link>

                  <Link
                    href="/user/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-white/10">
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      toast.success("Logged out");
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              /* LOGGED-OUT VIEW */
              <div className="py-2 text-white/80">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all font-medium"
                >
                  <LogIn size={18} className="text-white" />
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all font-medium"
                >
                  <UserPlus size={18} className="text-white" />
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
