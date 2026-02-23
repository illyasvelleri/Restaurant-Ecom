// // app/admin/customers/page.js → FINAL 2025 LUXURY MOBILE ADMIN

// "use client";

// import { useState, useEffect } from 'react';
// import {
//   Users, Phone, MapPin, Calendar, Search, Download,
//   Mail, ShoppingCart, DollarSign, Star, Eye
// } from 'lucide-react';
// import CustomerModal from '../components/CustomerModal';
// import AdminFooter from '../../components/footer';
// import toast from 'react-hot-toast';

// export default function CustomersPage() {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState(null);


//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (searchQuery) params.set("search", searchQuery);

//       const res = await fetch(`/api/admin/customers?${params}`);
//       if (!res.ok) throw new Error();
//       const data = await res.json();

//       setCustomers(data.customers || []);
//     } catch (err) {
//       toast.error('Failed to load customers');
//       setCustomers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

  // const filtered = customers.filter(c =>
  //   c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   c.whatsapp?.includes(searchQuery) ||
  //   c.email?.toLowerCase().includes(searchQuery)
  // );

//   // STATS
//   const stats = [
//     { label: "Total", value: customers.length },
//     { label: "With WhatsApp", value: customers.filter(c => c.whatsapp).length },
//     { label: "With Address", value: customers.filter(c => c.address).length },
//     {
//       label: "Active Today", value: customers.filter(c => {
//         const today = new Date().toDateString();
//         return new Date(c.updatedAt).toDateString() === today;
//       }).length
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* HEADER */}
//       <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
//         <div className="px-4 py-4">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
//               <p className="text-sm text-gray-500">{customers.length} total</p>
//             </div>
//             <button className="p-3 bg-black text-white rounded-xl shadow-lg">
//               <Download size={20} />
//             </button>
//           </div>

//           {/* SEARCH */}
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by name, WhatsApp, email..."
//               className="w-full pl-12 pr-5 py-4 bg-gray-100 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-black/10"
//             />
//           </div>
//         </div>
//       </div>

//       {/* STATS */}
//       <div className="px-4 py-5 bg-white border-b border-gray-100">
//         <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
//           {stats.map((stat) => (
//             <div key={stat.label} className="text-center min-w-[80px]">
//               <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
//               <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* CUSTOMERS LIST */}
//       <div className="pb-32">
//         {loading ? (
//           <div className="py-32 text-center">
//             <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-32">
//             <Users className="mx-auto text-gray-300 mb-4" size={64} />
//             <p className="text-gray-500 text-lg">No customers found</p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-100">
//             {filtered.map((customer) => (
//               <button
//                 key={customer._id}
//                 onClick={() => setSelectedCustomer(customer)}
//                 className="w-full text-left bg-white hover:bg-gray-50 transition"
//               >
//                 <div className="px-5 py-5 flex items-center justify-between">
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-4 mb-2">
//                       <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
//                         {customer.name?.[0] || "U"}
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-gray-900">{customer.name || customer.username}</h3>
//                         {customer.whatsapp && (
//                           <p className="text-sm text-gray-600 flex items-center gap-1">
//                             <Phone size={14} /> {customer.whatsapp}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4 text-sm text-gray-600">
//                       {customer.email && (
//                         <span className="flex items-center gap-1">
//                           <Mail size={14} /> {customer.email}
//                         </span>
//                       )}
//                       {customer.city && (
//                         <span className="flex items-center gap-1">
//                           <MapPin size={14} /> {customer.city}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between mt-3">
//                       <p className="text-xs text-gray-500">
//                         Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                   <Eye className="text-gray-400 ml-4" size={22} />
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//       <AdminFooter />
//       {/* MODAL */}
//       {selectedCustomer && (
//         <CustomerModal
//           customer={selectedCustomer}
//           onClose={() => setSelectedCustomer(null)}
//         />
//       )}
//     </div>
//   );
// }


// app/admin/customers/page.js → PREMIUM DARK LUXURY REDESIGN 2025 (matching admin suite)
// Inter font | Dark glass theme | Glows/Hovers/Skeletons | Fully Responsive

"use client";

import { useState, useEffect } from 'react';
import {
  Users, Phone, MapPin, Calendar, Search, Download,
  Mail, ShoppingCart, DollarSign, Star, Eye
} from 'lucide-react';
import CustomerModal from '../components/CustomerModal';
import AdminFooter from '../../components/footer';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────
// PULSE DOT (same as dashboard)
// ─────────────────────────────────────────────────────────
function PulseDot({ color = "#10b981", size = 8 }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: size, height: size, flexShrink: 0 }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: color, animation: "dbPulse 2s ease-in-out infinite",
      }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(255,255,255,0.07)",
      animation: "dbUp 0.6s ease both",
    }}>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: "rgba(255,255,255,0.06)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 20, width: '60%', borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
            <div style={{ height: 14, width: '40%', borderRadius: 4, background: "rgba(255,255,255,0.04)", marginTop: 8 }} />
          </div>
        </div>
        <div style={{ height: 40, borderRadius: 12, background: "rgba(255,255,255,0.04)" }} />
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/admin/customers?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();

      setCustomers(data.customers || []);
    } catch (err) {
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery]); // Auto-refetch when search changes

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.whatsapp?.includes(searchQuery) ||
    c.email?.toLowerCase().includes(searchQuery)
  );
  
  // STATS
  const stats = [
    { label: "Total", value: customers.length, color: "#fff" },
    { label: "With WhatsApp", value: customers.filter(c => c.whatsapp).length, color: "#10b981" },
    { label: "With Address", value: customers.filter(c => c.address).length, color: "#f59e0b" },
    {
      label: "Active Today",
      value: customers.filter(c => {
        const today = new Date().toDateString();
        return new Date(c.updatedAt).toDateString() === today;
      }).length,
      color: "#3b82f6"
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes dbUp       { from{opacity:0;transform:translateY(18px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes dbPulse    { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(2.4);opacity:0;} }
        @keyframes dbShimmer  { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }

        .cust-page {
          font-family:'Inter', system-ui, sans-serif;
          min-height:100vh;
          background:#080b10;
          color:#fff;
          padding-bottom:80px;
        }

        .cust-topbar {
          position:sticky; top:0; z-index:50;
          background:rgba(8,11,16,0.88);
          backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding:18px 24px;
        }

        .cust-title {
          font-size:clamp(22px,4vw,30px);
          font-weight:500; letter-spacing:-0.02em;
        }

        .cust-search {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px;
          padding:12px 16px 12px 44px;
          color:#fff;
          font-size:14px;
        }

        .cust-search::placeholder { color:rgba(255,255,255,0.3); }

        .cust-stat-card {
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:16px;
          padding:16px 20px;
          transition:all 0.3s;
        }

        .cust-stat-card:hover {
          transform:translateY(-4px);
          box-shadow:0 12px 32px rgba(0,0,0,0.4);
        }

        .cust-card {
          background:rgba(255,255,255,0.015);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:20px;
          padding:20px;
          transition:all 0.3s ease;
        }

        .cust-card:hover {
          transform:translateY(-4px);
          box-shadow:0 16px 40px rgba(0,0,0,0.4);
        }

        .cust-empty {
          padding:120px 24px;
          text-align:center;
          color:rgba(255,255,255,0.4);
          font-style:italic;
        }
      `}</style>

      <div className="cust-page">

        {/* ── TOPBAR ── */}
        <div className="cust-topbar">
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PulseDot color="#f59e0b" size={9} />
              <h1 className="cust-title">Customers</h1>
            </div>

            <button className="p-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl shadow-lg hover:from-amber-500 hover:to-amber-400 transition flex items-center gap-2">
              <Download size={18} />
              Export
            </button>
          </div>

          {/* Search */}
          <div style={{ maxWidth: 1400, margin: '16px auto 0', position: 'relative' }}>
            <Search size={18} style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.4)'
            }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, WhatsApp, email..."
              className="cust-search w-full"
            />
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ maxWidth: 1400, margin: '32px auto', padding: '0 20px' }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className="cust-stat-card text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <p style={{ fontSize: 32, fontWeight: 500, color: stat.color || '#fff' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CUSTOMERS LIST ── */}
        <div style={{ maxWidth: 1400, margin: '32px auto', padding: '0 20px' }}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="cust-empty">
              <Users size={72} className="mx-auto mb-6 opacity-40" />
              <p style={{ fontSize: 20, fontWeight: 500 }}>
                {searchQuery ? 'No matching customers found' : 'No customers registered yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((customer) => (
                <div
                  key={customer._id}
                  className="cust-card cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 22, fontWeight: 600, flexShrink: 0
                    }}>
                      {customer.name?.[0]?.toUpperCase() || "U"}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                        {customer.name || customer.username || "Unknown"}
                      </h3>

                      {customer.whatsapp && (
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Phone size={14} className="text-emerald-400" />
                          {customer.whatsapp}
                        </p>
                      )}

                      {customer.email && (
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <Mail size={14} className="text-amber-400" />
                          {customer.email}
                        </p>
                      )}
                    </div>

                    <Eye size={20} className="text-white/60" />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                    <span>
                      Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "N/A"}
                    </span>

                    {customer.city && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={14} className="text-amber-400" />
                        {customer.city}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <AdminFooter />

        {/* ── CUSTOMER MODAL ── */}
        {selectedCustomer && (
          <CustomerModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </>
  );
}