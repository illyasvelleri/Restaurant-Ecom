// components/CustomerModal.js → FINAL 2025 LUXURY MOBILE MODAL

"use client";

import { X, Phone, Mail, MapPin, Home, Building2, Calendar, MessageCircle, User } from 'lucide-react';

export default function CustomerModal({ customer, onClose }) {
  if (!customer) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Customer Profile</h2>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-6 space-y-7">

          {/* Avatar + Name */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                {customer.name?.[0]?.toUpperCase() || customer.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Phone className="w-6 h-6 text-white mx-auto" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {customer.name || customer.username}
              </h3>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Calendar size={18} />
                Member since {formatDate(customer.createdAt)}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {/* WhatsApp — Primary */}
            {customer.whatsapp ? (
              <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <MessageCircle className="text-green-600" size={28} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">WhatsApp (Primary)</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">+{customer.whatsapp}</p>
                </div>
                <a
                  href={`https://wa.me/${customer.whatsapp}`}
                  target="_blank"
                  className="px-5 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg"
                >
                  Message
                </a>
              </div>
            ) : (
              <div className="p-5 bg-gray-100 rounded-2xl text-center">
                <p className="text-gray-500">No WhatsApp number</p>
              </div>
            )}

            {/* Email */}
            {customer.email && (
              <div className="flex items-center gap-5 p-5 bg-blue-50 rounded-2xl border border-blue-200">
                <Mail className="text-blue-600" size={26} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-lg font-bold text-gray-900">{customer.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Full Saudi Delivery Address */}
          {(customer.address || customer.city || customer.neighborhood) && (
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <MapPin size={24} className="text-orange-600" />
                Delivery Address
              </h4>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 space-y-3">
                {customer.city && (
                  <div className="flex items-center gap-3">
                    <Home size={20} className="text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{customer.city}</p>
                      {customer.neighborhood && <p className="text-gray-600">{customer.neighborhood} District</p>}
                    </div>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-gray-500 mt-1" />
                    <p className="font-medium text-gray-900">{customer.address}</p>
                  </div>
                )}
                {(customer.building || customer.floor || customer.apartment) && (
                  <div className="flex items-center gap-3">
                    <Building2 size={20} className="text-gray-500" />
                    <div>
                      {customer.building && <span className="font-medium">Building {customer.building}</span>}
                      {customer.floor && <span className="text-gray-600"> • Floor {customer.floor}</span>}
                      {customer.apartment && <span className="text-gray-600"> • Apt {customer.apartment}</span>}
                    </div>
                  </div>
                )}
                {customer.pincode && (
                  <p className="text-sm text-gray-500">Postal Code: {customer.pincode}</p>
                )}
                {customer.notes && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-sm font-medium text-amber-800">Notes:</p>
                    <p className="text-gray-800 italic">"{customer.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Extra Info */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-gray-50 rounded-2xl p-5 text-center">
              <User className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-600">Account</p>
              <p className="font-bold text-gray-900">{customer.username}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 text-center">
              <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-600">Last Active</p>
              <p className="font-bold text-gray-900">
                {customer.updatedAt ? formatDate(customer.updatedAt) : "N/A"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}