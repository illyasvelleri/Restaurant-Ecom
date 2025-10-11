import { Clock, Users, TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';

const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-blue-100 text-sm">Avg. Prep Time</p>
            <h3 className="text-2xl font-bold">18 min</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ArrowDown size={14} />
          <span>2 min faster than last week</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-green-100 text-sm">Customer Satisfaction</p>
            <h3 className="text-2xl font-bold">4.8/5.0</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ArrowUp size={14} />
          <span>0.3 points increase</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-purple-100 text-sm">Peak Hours</p>
            <h3 className="text-2xl font-bold">6-8 PM</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>62% of daily orders</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;