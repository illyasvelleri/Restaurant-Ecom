// app/admin/customers/page.js → FINAL 2025 LUXURY MOBILE ADMIN

"use client";

import { useState, useEffect } from 'react';
import {
  Users, Phone, MapPin, Calendar, Search, Download,
  Mail, ShoppingCart, DollarSign, Star, Eye
} from 'lucide-react';
import CustomerModal from '../components/CustomerModal';
import AdminFooter from '../../components/footer';
import toast from 'react-hot-toast';

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
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.whatsapp?.includes(searchQuery) ||
    c.email?.toLowerCase().includes(searchQuery)
  );

  // STATS
  const stats = [
    { label: "Total", value: customers.length },
    { label: "With WhatsApp", value: customers.filter(c => c.whatsapp).length },
    { label: "With Address", value: customers.filter(c => c.address).length },
    {
      label: "Active Today", value: customers.filter(c => {
        const today = new Date().toDateString();
        return new Date(c.updatedAt).toDateString() === today;
      }).length
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
              <p className="text-sm text-gray-500">{customers.length} total</p>
            </div>
            <button className="p-3 bg-black text-white rounded-xl shadow-lg">
              <Download size={20} />
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, WhatsApp, email..."
              className="w-full pl-12 pr-5 py-4 bg-gray-100 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="px-4 py-5 bg-white border-b border-gray-100">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center min-w-[80px]">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMERS LIST */}
      <div className="pb-32">
        {loading ? (
          <div className="py-32 text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <Users className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No customers found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((customer) => (
              <button
                key={customer._id}
                onClick={() => setSelectedCustomer(customer)}
                className="w-full text-left bg-white hover:bg-gray-50 transition"
              >
                <div className="px-5 py-5 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {customer.name?.[0] || "U"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{customer.name || customer.username}</h3>
                        {customer.whatsapp && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone size={14} /> {customer.whatsapp}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {customer.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={14} /> {customer.email}
                        </span>
                      )}
                      {customer.city && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {customer.city}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-500">
                        Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <Eye className="text-gray-400 ml-4" size={22} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <AdminFooter />
      {/* MODAL */}
      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}