"use client";

import { Eye } from 'lucide-react';

const CustomerCard = ({ customer, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>
        <button
          onClick={() => onView(customer)}
          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
        >
          <Eye size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Orders</p>
          <p className="font-bold text-gray-900">{customer.orders}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Spent</p>
          <p className="font-bold text-gray-900">{customer.spent}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Points</p>
          <p className="font-bold text-gray-900">{customer.points}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className={`px-3 py-1 rounded-full font-medium ${
          customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {customer.status}
        </span>
        <span className="text-gray-500">{customer.joined}</span>
      </div>
    </div>
  );
};

export default CustomerCard;