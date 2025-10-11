"use client";

import { TrendingUp } from 'lucide-react';

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={14} />
              {change > 0 ? '+' : ''}{change}% vs last month
            </p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;