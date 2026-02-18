// // app/admin/orders/page.js → FINAL 2025 MOBILE ADMIN (WITH FOOTER + PRODUCTS PAGE DESIGN)

// "use client";

// import { useState, useEffect } from 'react';
// import {
//     ShoppingBag, Clock, Truck, CheckCircle2,
//     Search, Download, Eye, Phone, MapPin,
//     Filter, ChevronDown, AlertCircle, X
// } from 'lucide-react';
// import OrderModal from '../components/OrderModal';
// import AdminFooter from '../../components/footer'; // ← YOUR FOOTER
// import toast from 'react-hot-toast';

// export default function OrdersPage() {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filterStatus, setFilterStatus] = useState("all");
//     const [filterOpen, setFilterOpen] = useState(false);
//     const [selectedOrder, setSelectedOrder] = useState(null);

//     const fetchOrders = async () => {
//         try {
//             setLoading(true);
//             const res = await fetch('/api/admin/orders');
//             if (!res.ok) throw new Error();
//             const data = await res.json();
//             setOrders(data.orders || []);
//         } catch (err) {
//             toast.error('Failed to load orders');
//             setOrders([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchOrders(); }, []);

//     const filtered = orders.filter(order => {
//         const matchesSearch = searchQuery === "" ||
//             order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             order.phone?.includes(searchQuery);

//         const matchesFilter = filterStatus === "all" || order.status === filterStatus;

//         return matchesSearch && matchesFilter;
//     });

//     const stats = {
//         total: orders.length,
//         active: orders.filter(o => o.status === "active").length,
//         lowStock: orders.filter(o => o.stock < 10 && o.stock > 0).length,
//         outOfStock: orders.filter(o => o.stock === 0).length
//     };

//     const getStatusBadge = (status) => {
//         const map = {
//             pending: "bg-yellow-100 text-yellow-800",
//             confirmed: "bg-blue-100 text-blue-800",
//             preparing: "bg-indigo-100 text-indigo-800",
//             "on-the-way": "bg-purple-100 text-purple-800",
//             delivered: "bg-emerald-100 text-emerald-800",
//             cancelled: "bg-red-100 text-red-800",
//         };
//         return map[status] || "bg-gray-100 text-gray-800";
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">

//             {/* STICKY HEADER — SAME AS PRODUCTS PAGE */}
//             <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
//                 <div className="p-4">
//                     <div className="flex items-center justify-between mb-4">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
//                             <p className="text-sm text-gray-500">{orders.length} total</p>
//                         </div>
//                         <button className="p-3 bg-black text-white rounded-xl shadow-lg">
//                             <Download size={20} />
//                         </button>
//                     </div>

//                     {/* SEARCH */}
//                     <div className="relative">
//                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                         <input
//                             type="text"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Search orders..."
//                             className="w-full pl-12 pr-5 py-4 bg-gray-100 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-black/10"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* COMPACT STATS — SAME AS PRODUCTS */}
//             <div className="px-4 py-5 bg-white border-b border-gray-100">
//                 <div className="flex gap-6 overflow-x-auto scrollbar-hide">
//                     <div className="text-center min-w-[80px]">
//                         <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
//                         <p className="text-xs text-gray-500 mt-1">Total</p>
//                     </div>
//                     <div className="text-center min-w-[80px]">
//                         <p className="text-3xl font-bold text-emerald-600">{orders.filter(o => ["pending", "preparing", "on-the-way"].includes(o.status)).length}</p>
//                         <p className="text-xs text-gray-500 mt-1">Active</p>
//                     </div>
//                     <div className="text-center min-w-[80px]">
//                         <p className="text-3xl font-bold text-orange-600">{orders.filter(o => o.status === "preparing").length}</p>
//                         <p className="text-xs text-gray-500 mt-1">Preparing</p>
//                     </div>
//                     <div className="text-center min-w-[80px]">
//                         <p className="text-3xl font-bold text-red-600">{orders.filter(o => o.status === "cancelled").length}</p>
//                         <p className="text-xs text-gray-500 mt-1">Cancelled</p>
//                     </div>
//                 </div>
//             </div>

//             {/* ULTRA-COMPACT FILTER DROPDOWN */}
//             <div className="px-4 py-3 bg-white border-b border-gray-100">
//                 <div className="flex items-center justify-between gap-4">
//                     <div className="flex-1 relative">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                         <input
//                             type="text"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Search..."
//                             className="w-full pl-10 pr-3 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
//                         />
//                     </div>

//                     <div className="relative">
//                         <button
//                             onClick={() => setFilterOpen(!filterOpen)}
//                             className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
//                         >
//                             <Filter size={16} />
//                             <span className="hidden sm:inline">
//                                 {filterStatus === "all" ? "All Orders" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1).replace("-", " ")}
//                             </span>
//                             <span className="sm:hidden">
//                                 {filterStatus === "all" ? "All" : filterStatus.slice(0, 4)}
//                             </span>
//                             <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
//                         </button>

//                         {filterOpen && (
//                             <>
//                                 <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
//                                 <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
//                                     {["all", "pending", "confirmed", "preparing", "on-the-way", "delivered", "cancelled"].map((status) => {
//                                         const count = status === "all" ? orders.length : orders.filter(o => o.status === status).length;
//                                         const active = filterStatus === status;

//                                         return (
//                                             <button
//                                                 key={status}
//                                                 onClick={() => {
//                                                     setFilterStatus(status);
//                                                     setFilterOpen(false);
//                                                 }}
//                                                 className={`w-full px-4 py-3 text-left flex items-center justify-between text-sm transition-all ${active ? "bg-black text-white" : "hover:bg-gray-50 text-gray-800"
//                                                     }`}
//                                             >
//                                                 <span>{status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}</span>
//                                                 <span className={`font-bold ${active ? "text-white" : "text-gray-500"}`}>{count}</span>
//                                             </button>
//                                         );
//                                     })}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* ORDERS LIST — SAME CARD STYLE AS PRODUCTS */}
//             <div className="px-4 py-2">
//                 {loading ? (
//                     <div className="py-20 text-center">
//                         <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
//                     </div>
//                 ) : filtered.length === 0 ? (
//                     <div className="text-center py-20">
//                         <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
//                         <p className="text-gray-500 text-lg">No orders found</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-3">
//                         {filtered.map((order) => (
//                             <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
//                                 <div className="flex items-center gap-4 p-4">
//                                     <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
//                                         <ShoppingBag className="text-orange-600" size={36} />
//                                     </div>

//                                     <div className="flex-1 min-w-0">
//                                         <div className="flex items-center justify-between mb-2">
//                                             <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
//                                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}>
//                                                 {order.status.replace("-", " ")}
//                                             </span>
//                                         </div>
//                                         <p className="font-medium text-gray-900 truncate">{order.customerName}</p>
//                                         <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
//                                             <span className="flex items-center gap-1">
//                                                 <Phone size={14} /> {order.phone}
//                                             </span>
//                                             <span className="flex items-center gap-1 truncate">
//                                                 <MapPin size={14} /> {order.deliveryAddress?.split(",")[0] || "N/A"}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center justify-between mt-2">
//                                             <p className="text-xl font-bold text-gray-900">{order.total?.toFixed(2) || "0.00"}</p>
//                                             <p className="text-xs text-gray-500">
//                                                 {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <button
//                                         onClick={() => setSelectedOrder(order)}
//                                         className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
//                                     >
//                                         <Eye className="text-gray-700" size={20} />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//             {/* FIXED FOOTER — SAME AS ALL ADMIN PAGES */}
//             <AdminFooter />

//             {/* MODAL */}
//             {selectedOrder && (
//                 <OrderModal
//                     order={selectedOrder}
//                     onClose={() => setSelectedOrder(null)}
//                     onUpdate={fetchOrders}
//                 />
//             )}

//         </div>

//     );
// }


// app/admin/orders/page.js → FINAL Kanban Dashboard (branch-separated)

"use client";

import { useState, useEffect } from 'react';
import {
  ShoppingBag, Clock, Truck, CheckCircle2,
  Search, Download, Eye, Phone, MapPin,
  Filter, ChevronDown, AlertCircle, X
} from 'lucide-react';
import OrderModal from '../components/OrderModal';
import AdminFooter from '../../components/footer';
import toast from 'react-hot-toast';

const statusColumns = [
  { id: 'pending', title: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'confirmed', title: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { id: 'preparing', title: 'Preparing', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'on-the-way', title: 'On The Way', color: 'bg-purple-100 text-purple-800' },
  { id: 'delivered', title: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'cancelled', title: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchBranches();
    fetchOrders();
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBranches(data.branches || []);
    } catch {
      toast.error('Failed to load branches');
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = '/api/admin/orders';
      if (selectedBranch !== 'all') {
        url += `?branchId=${selectedBranch}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    searchQuery === "" ||
    order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.phone?.includes(searchQuery)
  );

  const getColumnOrders = (status) => filteredOrders.filter(o => o.status === status);

  const exportCSV = () => {
    const csv = [
      ['Order ID', 'Customer', 'Phone', 'Branch', 'Status', 'Total', 'Date'],
      ...filteredOrders.map(o => [
        o.orderId || o._id,
        o.customerName,
        o.phone,
        o.branchId?.name || '—',
        o.status,
        o.total,
        new Date(o.createdAt).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders Dashboard</h1>
              <p className="text-sm text-gray-500">{filteredOrders.length} orders found</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Branch Filter + Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 appearance-none"
              >
                <option value="all">All Branches</option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-6 min-w-max pb-6">
          {statusColumns.map(column => {
            const columnOrders = getColumnOrders(column.id);
            return (
              <div key={column.id} className="w-80 flex-shrink-0 bg-gray-100 rounded-xl p-4">
                <div className={`p-3 rounded-lg mb-4 ${column.color}`}>
                  <h3 className="font-bold text-lg">{column.title}</h3>
                  <p className="text-sm opacity-80">{columnOrders.length} orders</p>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {columnOrders.map(order => (
                    <div
                      key={order._id}
                      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-gray-900">{order.orderId || order._id.slice(-6)}</div>
                        <span className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="font-medium text-gray-800 truncate">{order.customerName}</p>
                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <Phone size={14} /> {order.phone}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-lg">{order.total?.toFixed(2) || '0.00'}</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <AdminFooter />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={fetchOrders}
        />
      )}
    </div>
  );
}