"use client";

import { Truck } from 'lucide-react';

const DeliverySettings = ({ deliverySettings, setDeliverySettings }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Settings</h3>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Truck className="text-gray-600" size={20} />
          <div>
            <p className="font-medium text-gray-900">Delivery Service</p>
            <p className="text-sm text-gray-600">Enable or disable delivery for your restaurant</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={deliverySettings.deliveryEnabled}
            onChange={(e) => setDeliverySettings({...deliverySettings, deliveryEnabled: e.target.checked})}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Radius (miles)</label>
          <input
            type="number"
            value={deliverySettings.deliveryRadius}
            onChange={(e) => setDeliverySettings({...deliverySettings, deliveryRadius: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            min="0"
            step="0.1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee ($)</label>
          <input
            type="number"
            value={deliverySettings.deliveryFee}
            onChange={(e) => setDeliverySettings({...deliverySettings, deliveryFee: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount ($)</label>
          <input
            type="number"
            value={deliverySettings.minOrderAmount}
            onChange={(e) => setDeliverySettings({...deliverySettings, minOrderAmount: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery Time (minutes)</label>
          <input
            type="text"
            value={deliverySettings.estimatedTime}
            onChange={(e) => setDeliverySettings({...deliverySettings, estimatedTime: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., 30-45"
          />
        </div>
      </div>
    </div>
  );
};

export default DeliverySettings;