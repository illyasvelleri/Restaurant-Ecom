"use client";

import { ArrowUp, ArrowDown } from 'lucide-react';

const MetricCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xs text-gray-400 mt-2">vs last month</p>
    </div>
  );
};

export default MetricCard;