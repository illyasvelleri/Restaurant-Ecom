// components/ProfileIcon.js  ← DROP THIS ANYWHERE (navbar, header, etc)

"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { User, LogIn, UserPlus, Settings, Package, LogOut } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfileIcon() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;

  return (
    <div className="relative">
      {/* Profile Icon Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-2 p-2 rounded-full hover:bg-orange-50 transition-all duration-200 group"
      >
        {status === "loading" ? (
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        ) : user ? (
          <>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-orange-100">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="hidden md:block font-medium text-gray-700">{user.name}</span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
              <User size={20} className="text-gray-400" />
            </div>
            <span className="hidden md:block text-gray-600 font-medium">Login</span>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {user ? (
              <>
                <div className="px-5 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email || "user@indulg.com"}</p>
                </div>

                <div className="py-2">
                  <Link
                    href="/user/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 transition"
                  >
                    <User size={18} />
                    My Profile
                  </Link>
                  <Link
                    href="/user/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50"
                  >
                    <Package size={18} />
                    My Orders
                  </Link>
                  <Link
                    href="/user/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                </div>

                <div className="border-t pt-2">
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      toast.success("Logged out");
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="py-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 transition font-medium"
                >
                  <LogIn size={18} className="text-orange-600" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-green-50 transition font-medium text-green-700"
                >
                  <UserPlus size={18} />
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