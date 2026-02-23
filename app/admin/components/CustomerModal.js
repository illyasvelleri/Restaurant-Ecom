// // components/CustomerModal.js → FINAL 2025 LUXURY MOBILE MODAL

// "use client";

// import { X, Phone, Mail, MapPin, Home, Building2, Calendar, MessageCircle, User } from 'lucide-react';

// export default function CustomerModal({ customer, onClose }) {
//   if (!customer) return null;

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-SA', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Customer Profile</h2>
//           <button 
//             onClick={onClose}
//             className="p-3 hover:bg-gray-100 rounded-full transition"
//           >
//             <X size={28} />
//           </button>
//         </div>

//         <div className="p-6 space-y-7">

//           {/* Avatar + Name */}
//           <div className="flex items-center gap-5">
//             <div className="relative">
//               <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
//                 {customer.name?.[0]?.toUpperCase() || customer.username?.[0]?.toUpperCase() || "U"}
//               </div>
//               <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
//                 <Phone className="w-6 h-6 text-white mx-auto" />
//               </div>
//             </div>
//             <div>
//               <h3 className="text-3xl font-bold text-gray-900">
//                 {customer.name || customer.username}
//               </h3>
//               <p className="text-gray-600 flex items-center gap-2 mt-1">
//                 <Calendar size={18} />
//                 Member since {formatDate(customer.createdAt)}
//               </p>
//             </div>
//           </div>

//           {/* Contact Info */}
//           <div className="space-y-4">
//             {/* WhatsApp — Primary */}
//             {customer.whatsapp ? (
//               <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
//                 <MessageCircle className="text-green-600" size={28} />
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-600">WhatsApp (Primary)</p>
//                   <p className="text-xl font-bold text-gray-900 mt-1">+{customer.whatsapp}</p>
//                 </div>
//                 <a
//                   href={`https://wa.me/${customer.whatsapp}`}
//                   target="_blank"
//                   className="px-5 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg"
//                 >
//                   Message
//                 </a>
//               </div>
//             ) : (
//               <div className="p-5 bg-gray-100 rounded-2xl text-center">
//                 <p className="text-gray-500">No WhatsApp number</p>
//               </div>
//             )}

//             {/* Email */}
//             {customer.email && (
//               <div className="flex items-center gap-5 p-5 bg-blue-50 rounded-2xl border border-blue-200">
//                 <Mail className="text-blue-600" size={26} />
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Email</p>
//                   <p className="text-lg font-bold text-gray-900">{customer.email}</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Full Saudi Delivery Address */}
//           {(customer.address || customer.city || customer.neighborhood) && (
//             <div>
//               <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
//                 <MapPin size={24} className="text-orange-600" />
//                 Delivery Address
//               </h4>
//               <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 space-y-3">
//                 {customer.city && (
//                   <div className="flex items-center gap-3">
//                     <Home size={20} className="text-gray-500" />
//                     <div>
//                       <p className="font-semibold text-gray-900 text-lg">{customer.city}</p>
//                       {customer.neighborhood && <p className="text-gray-600">{customer.neighborhood} District</p>}
//                     </div>
//                   </div>
//                 )}
//                 {customer.address && (
//                   <div className="flex items-start gap-3">
//                     <MapPin size={20} className="text-gray-500 mt-1" />
//                     <p className="font-medium text-gray-900">{customer.address}</p>
//                   </div>
//                 )}
//                 {(customer.building || customer.floor || customer.apartment) && (
//                   <div className="flex items-center gap-3">
//                     <Building2 size={20} className="text-gray-500" />
//                     <div>
//                       {customer.building && <span className="font-medium">Building {customer.building}</span>}
//                       {customer.floor && <span className="text-gray-600"> • Floor {customer.floor}</span>}
//                       {customer.apartment && <span className="text-gray-600"> • Apt {customer.apartment}</span>}
//                     </div>
//                   </div>
//                 )}
//                 {customer.pincode && (
//                   <p className="text-sm text-gray-500">Postal Code: {customer.pincode}</p>
//                 )}
//                 {customer.notes && (
//                   <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
//                     <p className="text-sm font-medium text-amber-800">Notes:</p>
//                     <p className="text-gray-800 italic">"{customer.notes}"</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Extra Info */}
//           <div className="grid grid-cols-2 gap-4 pt-4">
//             <div className="bg-gray-50 rounded-2xl p-5 text-center">
//               <User className="mx-auto text-gray-400 mb-2" size={32} />
//               <p className="text-sm text-gray-600">Account</p>
//               <p className="font-bold text-gray-900">{customer.username}</p>
//             </div>
//             <div className="bg-gray-50 rounded-2xl p-5 text-center">
//               <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
//               <p className="text-sm text-gray-600">Last Active</p>
//               <p className="font-bold text-gray-900">
//                 {customer.updatedAt ? formatDate(customer.updatedAt) : "N/A"}
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


// components/CustomerModal.js → PREMIUM DARK LUXURY REDESIGN 2025 (Fully Responsive + Mobile Optimized)
// Inter font | Dark glass theme | Glows/Hovers | 100% ORIGINAL LOGIC PRESERVED

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes dbUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }

        .cust-modal-overlay {
          font-family: 'Inter', system-ui, sans-serif;
        }

        .cust-modal-content {
          background: rgba(10,14,22,0.98);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          box-shadow: 0 20px 70px rgba(0,0,0,0.7);
          animation: dbUp 0.45s ease both;
        }

        .cust-modal-header {
          background: rgba(8,11,16,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .cust-avatar {
          width: clamp(80px, 20vw, 110px);
          height: clamp(80px, 20vw, 110px);
          font-size: clamp(32px, 8vw, 44px);
        }

        .contact-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.25s;
        }

        .contact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }

        .address-block {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px;
        }
      `}</style>

      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 cust-modal-overlay overflow-y-auto">
        <div className="cust-modal-content w-full max-w-lg sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl shadow-2xl">
          
          {/* Sticky Header */}
          <div className="cust-modal-header sticky top-0 z-10 px-5 sm:px-8 py-5 sm:py-6 flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Customer Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-white/80 hover:text-white"
            >
              <X size={22} className="sm:size-28" />
            </button>
          </div>

          <div className="p-5 sm:p-8 space-y-6 sm:space-y-8 text-white/90">

            {/* Avatar + Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              <div className="relative flex-shrink-0">
                <div className="cust-avatar rounded-full flex items-center justify-center text-white font-bold shadow-2xl bg-gradient-to-br from-amber-500 to-red-600">
                  {customer.name?.[0]?.toUpperCase() || customer.username?.[0]?.toUpperCase() || "U"}
                </div>
                {customer.whatsapp && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-full border-4 border-black flex items-center justify-center shadow-lg">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {customer.name || customer.username || "Unknown Customer"}
                </h3>
                <p className="text-sm sm:text-base text-white/60 mt-2 flex items-center justify-center sm:justify-start gap-2">
                  <Calendar size={16} className="sm:size-18" />
                  Member since {formatDate(customer.createdAt)}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-5">
              {/* WhatsApp */}
              {customer.whatsapp ? (
                <div className="contact-card flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-emerald-400" size={28} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm text-white/60">WhatsApp (Primary)</p>
                    <p className="text-xl sm:text-2xl font-bold text-white mt-1">+{customer.whatsapp}</p>
                  </div>
                  <a
                    href={`https://wa.me/${customer.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition shadow-lg w-full sm:w-auto text-center"
                  >
                    Message Now
                  </a>
                </div>
              ) : (
                <div className="contact-card text-center py-6">
                  <p className="text-white/50">No WhatsApp registered</p>
                </div>
              )}

              {/* Email */}
              {customer.email && (
                <div className="contact-card flex items-center gap-4 sm:gap-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-400" size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/60">Email Address</p>
                    <p className="text-lg sm:text-xl font-bold text-white break-all mt-1">{customer.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Address */}
            {(customer.address || customer.city || customer.neighborhood) && (
              <div className="address-block">
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-5 flex items-center gap-3">
                  <MapPin size={24} className="text-amber-400" />
                  Delivery Address
                </h4>

                <div className="space-y-4 text-white/90">
                  {customer.city && (
                    <div className="flex items-start gap-3">
                      <Home size={20} className="text-white/60 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-lg">{customer.city}</p>
                        {customer.neighborhood && (
                          <p className="text-white/70">{customer.neighborhood} District</p>
                        )}
                      </div>
                    </div>
                  )}

                  {customer.address && (
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-white/60 mt-1 flex-shrink-0" />
                      <p className="font-medium leading-relaxed">{customer.address}</p>
                    </div>
                  )}

                  {(customer.building || customer.floor || customer.apartment) && (
                    <div className="flex items-center gap-3 flex-wrap">
                      <Building2 size={20} className="text-white/60 flex-shrink-0" />
                      <div className="text-white/90">
                        {customer.building && <span className="font-medium">Building {customer.building}</span>}
                        {customer.floor && <span> • Floor {customer.floor}</span>}
                        {customer.apartment && <span> • Apt {customer.apartment}</span>}
                      </div>
                    </div>
                  )}

                  {customer.pincode && (
                    <p className="text-sm text-white/60">
                      Postal Code: <span className="font-medium text-white">{customer.pincode}</span>
                    </p>
                  )}

                  {customer.notes && (
                    <div className="mt-4 p-4 bg-amber-900/20 rounded-xl border border-amber-500/20">
                      <p className="text-sm font-medium text-amber-300 mb-1">Delivery Notes:</p>
                      <p className="text-white/90 italic">"{customer.notes}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Extra Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
              <div className="bg-white/5 rounded-xl p-5 sm:p-6 text-center border border-white/10">
                <User className="mx-auto text-white/50 mb-3" size={32} />
                <p className="text-sm text-white/60">Account</p>
                <p className="font-semibold text-white mt-1">{customer.username || "—"}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-5 sm:p-6 text-center border border-white/10">
                <Calendar className="mx-auto text-white/50 mb-3" size={32} />
                <p className="text-sm text-white/60">Last Active</p>
                <p className="font-semibold text-white mt-1">
                  {customer.updatedAt ? formatDate(customer.updatedAt) : "N/A"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}