// components/ProfileIcon.jsx → FINAL CLEAN 2025 VERSION (NO BACKGROUND)

"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { User, LogIn, UserPlus, Settings, Package, LogOut } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfileIcon() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user;

  return (
    <div className="relative select-none">
      {/* MAIN BUTTON — ONLY ICON, NO BACKGROUND */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
      >
        {user ? (
          /* LOGGED IN — GREEN RING + INITIAL */
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-xl text-gray-900 shadow-xl ring-4 ring-emerald-500/30">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-3 border-white rounded-full shadow-lg"></span>
          </div>
        ) : (
          /* NOT LOGGED IN — CLEAN USER ICON */
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            <User size={26} className="text-gray-700" />
          </div>
        )}
      </button>

      {/* DROPDOWN MENU */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50">
            {user ? (
              <>
                {/* User Header */}
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-gray-100">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-bold text-2xl text-gray-900 shadow-xl ring-4 ring-emerald-500/30">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-3 border-white rounded-full shadow-lg"></span>
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-3">
                  <Link href="/user/profile" onClick={() => setOpen(false)} className="flex items-center gap-4 px-7 py-4 hover:bg-gray-50 transition">
                    <User size={22} className="text-gray-700" />
                    <span className="font-medium text-gray-800">My Profile</span>
                  </Link>
                  <Link href="/user/orders" onClick={() => setOpen(false)} className="flex items-center gap-4 px-7 py-4 hover:bg-gray-50 transition">
                    <Package size={22} className="text-gray-700" />
                    <span className="font-medium text-gray-800">My Orders</span>
                  </Link>
                  <Link href="/user/settings" onClick={() => setOpen(false)} className="flex items-center gap-4 px-7 py-4 hover:bg-gray-50 transition">
                    <Settings size={22} className="text-gray-700" />
                    <span className="font-medium text-gray-800">Settings</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      toast.success("Logged out");
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-4 px-7 py-4 text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    <LogOut size={22} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              /* GUEST VIEW */
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gray-100">
                  <User size={48} className="text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h3>
                <p className="text-gray-600 mb-8">Sign in to continue</p>

                <div className="space-y-4">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="w-full block py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 transition shadow-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="w-full block py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-2xl font-medium hover:bg-gray-50 transition shadow-lg"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}