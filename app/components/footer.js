"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Clock,
  Mail,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  const [settings, setSettings] = useState({
    name: "Restaurant",
    description: "Premium dining experience with authentic flavors.",
    logo: null,
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
    workingHours: "Daily: 11:00 AM - 11:00 PM",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/restaurantDetails");
        if (res.ok) {
          const data = await res.json();
          const r = data.restaurant || {};

          setSettings({
            name: r.name || "Restaurant",
            description:
              r.description ||
              "Premium dining experience with authentic flavors.",
            logo: r.logo || null,
            whatsapp: r.whatsapp || "",
            phone: r.phone || "",
            email: r.email || "",
            address: r.address || "",
            facebook: r.facebook || "",
            instagram: r.instagram || "",
            twitter: r.twitter || "",
            workingHours: r.workingHours || "Daily: 11:00 AM - 11:00 PM",
          });
        }
      } catch (err) {
        console.error("Failed to load footer settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <footer className="bg-black py-12">
        <div className="text-center text-gray-400">Loading...</div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* BRAND */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <Image
                src={settings.logo}
                alt={settings.name}
                width={48}
                height={48}
                className="rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-xl">
                  {settings.name.charAt(0)}
                </span>
              </div>
            )}

            <span className="text-2xl font-extrabold tracking-tight">
              {settings.name}
            </span>
          </div>

          <p className="text-white/60 leading-relaxed max-w-xs">
            {settings.description}
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <Facebook size={18} />
              </a>
            )}
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <Instagram size={18} />
              </a>
            )}
            {settings.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <Twitter size={18} />
              </a>
            )}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-5 tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {[
              { href: "/", label: "Home" },
              { href: "/user/menu", label: "Menu" },
              { href: "/user/popular", label: "Popular" },
              { href: "/user/combos", label: "Offers" },
              { href: "/user/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/60 hover:text-white flex items-center gap-2 group"
                >
                  <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-all"
                  />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-5 tracking-wide">
            Contact
          </h3>

          <ul className="space-y-4 text-white/70">
            {settings.address && (
              <li className="flex gap-3">
                <MapPin size={18} className="text-white" />
                <span>{settings.address}</span>
              </li>
            )}

            {settings.phone && (
              <li className="flex gap-3">
                <Phone size={18} className="text-white" />
                <a href={`tel:${settings.phone}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}

            {settings.whatsapp && (
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-xs text-white font-semibold">W</span>
                </div>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  className="hover:text-white"
                >
                  WhatsApp Order
                </a>
              </li>
            )}

            {settings.email && (
              <li className="flex gap-3">
                <Mail size={18} className="text-white" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* WORKING HOURS */}
        <div>
          <h3 className="text-lg font-semibold mb-5 tracking-wide">
            Working Hours
          </h3>

          <div className="flex gap-3 text-white/70 whitespace-pre-line">
            <Clock size={18} className="text-white" />
            {settings.workingHours}
          </div>

          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-sm font-semibold text-white">
              Delivery Available
            </p>
            <p className="text-xs text-white/60 mt-1">
              Fast & reliable delivery across the city.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-6 text-center text-white/50 text-sm">
        © {new Date().getFullYear()} {settings.name}.  
        <span className="block text-xs mt-1">
          Powered with love • Not specific to any country • Food crafted for everyone
        </span>
      </div>
    </footer>
  );
}
