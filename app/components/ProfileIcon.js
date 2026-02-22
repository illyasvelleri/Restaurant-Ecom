// // components/ProfileIcon.jsx → FINAL CLEAN 2025 VERSION (NO BACKGROUND)
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Settings, Package, LogOut, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ProfileIcon() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user;

  return (
    <div className="relative select-none">
      {/* TRIGGER: MINIMALIST AVATAR */}
      <button
        onClick={() => setOpen(!open)}
        className="relative group focus:outline-none"
      >
        <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-500 group-hover:border-black group-active:scale-95 overflow-hidden bg-white">
          {user ? (
            <span className="text-sm font-bold tracking-tighter text-black">
              {user.name?.split(" ")[0].toUpperCase().substring(0, 2)}
            </span>
          ) : (
            <User size={20} className="text-gray-400 group-hover:text-black transition-colors" />
          )}
        </div>
        {user && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-black rounded-full border-2 border-white shadow-sm" />
        )}
      </button>

      {/* DROPDOWN INTERFACE */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "circOut" }}
              className="absolute right-0 mt-6 w-72 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 origin-top-right"
            >
              {user ? (
                <div className="flex flex-col">
                  {/* AUTHENTICATED HEADER */}
                  <div className="p-8 pb-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black text-white flex items-center justify-center text-xl font-light tracking-tighter shadow-xl">
                      {user.name?.charAt(0)}
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-black flex items-center justify-center gap-1">
                      {user.name} <ShieldCheck size={14} className="text-gray-400" />
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mt-1 font-bold">Verified Member</p>
                  </div>

                  {/* NAV LINKS */}
                  <div className="px-3 py-4 space-y-1">
                    <MenuLink href="/user/profile" icon={<User size={18}/>} label="Account Detail" onClick={() => setOpen(false)} />
                    <MenuLink href="/user/orders" icon={<Package size={18}/>} label="Order History" onClick={() => setOpen(false)} />
                    <MenuLink href="/user/settings" icon={<Settings size={18}/>} label="Preferences" onClick={() => setOpen(false)} />
                  </div>

                  {/* LOGOUT */}
                  <div className="p-3 bg-gray-50/50">
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        toast.success("Identity Cleared");
                        setOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-white border border-gray-100 text-red-500 hover:text-red-600 hover:shadow-md transition-all font-bold text-[10px] uppercase tracking-[0.2em]"
                    >
                      Disconnect Portal <LogOut size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                /* GUEST INTERFACE */
                <div className="p-10 text-center">
                  <header className="mb-8">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                       <User size={24} />
                    </div>
                    <h3 className="text-xl font-light tracking-tight text-black">Guest <span className="font-serif italic text-gray-400">Access</span></h3>
                  </header>

                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="w-full block py-4 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-lg active:scale-95"
                    >
                      Authenticate
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="w-full block py-4 bg-white text-black border border-gray-200 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:border-black transition-all active:scale-95"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// SUB-COMPONENT FOR CLEANER CODE
function MenuLink({ href, icon, label, onClick }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center justify-between px-6 py-3.5 rounded-2xl text-gray-500 hover:text-black hover:bg-gray-50 transition-all group"
    >
      <div className="flex items-center gap-4">
        <span className="group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.1em]">{label}</span>
      </div>
      <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}