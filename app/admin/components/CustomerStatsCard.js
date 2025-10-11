"use client";

const CustomerStatsCard = ({ title, value, icon: Icon, color, percentage }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {percentage && (
          <span className={`text-sm font-medium ${percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {percentage > 0 ? '+' : ''}{percentage}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-500 text-sm">{title}</p>
    </div>
  );
};

export default CustomerStatsCard;