"use client";

import { X, Mail, Phone, MapPin, Calendar, ShoppingCart, DollarSign, Award, Star } from 'lucide-react';

const CustomerModal = ({ customer, onClose }) => {
  if (!customer) return null;

  const recentOrders = [
    { id: '#ORD-2024-001', date: 'Oct 10, 2024', items: 'Pizza, Coke', total: '$28.50', status: 'Delivered' },
    { id: '#ORD-2024-015', date: 'Oct 8, 2024', items: 'Burger Combo', total: '$45.00', status: 'Delivered' },
    { id: '#ORD-2024-032', date: 'Oct 5, 2024', items: 'Pasta Carbonara', total: '$22.00', status: 'Delivered' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {customer.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{customer.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {customer.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} />
                      {customer.phone}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {customer.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart size={18} className="text-blue-600" />
                    <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{customer.orders}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={18} className="text-green-600" />
                    <p className="text-sm text-green-600 font-medium">Total Spent</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{customer.spent}</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={18} className="text-yellow-600" />
                    <p className="text-sm text-yellow-600 font-medium">Loyalty Points</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{customer.points}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">123 Main Street, Apt 4B</p>
                    <p className="font-medium text-gray-900">New York, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">{customer.joined}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Preferences</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Favorite Category</span>
                  <span className="font-semibold text-gray-900">Pizza</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Average Order Value</span>
                  <span className="font-semibold text-gray-900">$32.50</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Customer Rating</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                    <span className="font-semibold text-gray-900">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recent Orders</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.items}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{order.total}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;