"use client";

import { X } from 'lucide-react';

const OrderModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-lg font-bold text-gray-900">{order.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
              order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Customer</p>
              <p className="font-semibold text-gray-900">{order.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="font-semibold text-gray-900">{order.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="font-semibold text-gray-900">{order.payment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="font-semibold text-gray-900 text-lg">{order.total}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items.split(', ').map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item}</span>
                  <span className="font-semibold text-gray-900">x1</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
            <p className="text-gray-600">123 Main Street, Apt 4B<br/>New York, NY 10001</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;