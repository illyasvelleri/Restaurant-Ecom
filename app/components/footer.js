// components/Footer.tsx → PROFESSIONAL, DYNAMIC & GORGEOUS

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, MapPin, Phone, Clock, Mail, ChevronRight } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState({
    name: "Indulge",
    description: "Fresh food delivered fast to your doorstep.",
    logo: null,
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
    workingHours: "Sun - Thu: 11:00 AM - 11:00 PM\nFri - Sat: 11:00 AM - 12:00 AM",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          const restaurant = data.restaurant || {};

          setSettings({
            name: restaurant.name || "Indulge",
            description: restaurant.description || "Fresh food delivered fast to your doorstep.",
            logo: restaurant.logo || null,
            whatsapp: restaurant.whatsapp || "",
            phone: restaurant.phone || "",
            email: restaurant.email || "",
            address: restaurant.address || "",
            facebook: restaurant.facebook || "",
            instagram: restaurant.instagram || "",
            twitter: restaurant.twitter || "",
            workingHours: restaurant.workingHours || "Daily: 11:00 AM - 11:00 PM",
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
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-t from-gray-50 to-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {settings.logo ? (
                <Image
                  src={settings.logo}
                  alt={settings.name}
                  width={48}
                  height={48}
                  className="rounded-2xl shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-xl">
                    {settings.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-2xl font-extrabold text-gray-900">{settings.name}</span>
            </div>

            <p className="text-gray-600 leading-relaxed max-w-xs">
              {settings.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Facebook size={18} className="text-orange-600" />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Instagram size={18} className="text-orange-600" />
                </a>
              )}
              {settings.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Twitter size={18} className="text-orange-600" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-5 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/user/menu", label: "Menu" },
                { href: "/user/popular", label: "Popular Dishes" },
                { href: "/user/combos", label: "Offers" },
                { href: "/user/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-orange-600 font-medium transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-5 text-lg">Contact Us</h3>
            <ul className="space-y-4 text-gray-600">
              {settings.address && (
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-orange-500 mt-0.5" />
                  <span className="leading-tight">{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-orange-500" />
                  <a href={`tel:${settings.phone}`} className="hover:text-orange-600">{settings.phone}</a>
                </li>
              )}
              {settings.whatsapp && (
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">W</span>
                  </div>
                  <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank"
                    className="hover:text-orange-600">WhatsApp Order</a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-orange-500" />
                  <a href={`mailto:${settings.email}`} className="hover:text-orange-600">{settings.email}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-bold text-gray-900 mb-5 text-lg">Working Hours</h3>
            <div className="flex items-start gap-3 text-gray-600">
              <Clock size={18} className="text-orange-500 mt-0.5" />
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {settings.workingHours}
              </div>
            </div>

            <div className="mt-8 p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
              <p className="text-sm font-semibold text-orange-800 mb-2">Delivery Available</p>
              <p className="text-xs text-orange-700">Fast & reliable delivery across the city</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="font-semibold text-gray-700">{settings.name}</span>. All rights reserved.
            <span className="block mt-1 text-xs">Powered with love in Saudi Arabia</span>
          </p>
        </div>
      </div>
    </footer>
  );
}