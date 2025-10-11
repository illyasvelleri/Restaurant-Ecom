"use client";

import { useState } from 'react';
import { DollarSign, ShoppingCart, Target, Percent, Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import RevenueOverview from '../components/RevenueOverview';
import SalesByCategory from '../components/SalesByCategory';
import OrdersByHour from '../components/OrdersByHour';
import TopProducts from '../components/TopProducts';
import QuickStats from '../components/QuickStats';

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('analytics');
  const [timeRange, setTimeRange] = useState('7days');
  const user = { username: "Admin1", role: "admin" };

  const revenueData = [
    { name: 'Mon', revenue: 4200, orders: 45 },
    { name: 'Tue', revenue: 5100, orders: 52 },
    { name: 'Wed', revenue: 4800, orders: 48 },
    { name: 'Thu', revenue: 6200, orders: 65 },
    { name: 'Fri', revenue: 7500, orders: 78 },
    { name: 'Sat', revenue: 8900, orders: 92 },
    { name: 'Sun', revenue: 8200, orders: 85 },
  ];

  const categorySales = [
    { name: 'Pizza', value: 4500, color: '#ef4444' },
    { name: 'Burgers', value: 3200, color: '#f97316' },
    { name: 'Pasta', value: 2800, color: '#eab308' },
    { name: 'Salads', value: 1900, color: '#22c55e' },
    { name: 'Desserts', value: 1500, color: '#3b82f6' },
    { name: 'Beverages', value: 2100, color: '#a855f7' },
  ];

  const topProducts = [
    { name: 'Margherita Pizza', sales: 234, revenue: '$3,041' },
    { name: 'Chicken Burger', sales: 189, revenue: '$1,699' },
    { name: 'Pasta Carbonara', sales: 167, revenue: '$2,001' },
    { name: 'Caesar Salad', sales: 145, revenue: '$1,158' },
    { name: 'Pepperoni Pizza', sales: 128, revenue: '$1,919' },
  ];

  const hourlyData = [
    { hour: '8AM', orders: 12 },
    { hour: '9AM', orders: 18 },
    { hour: '10AM', orders: 25 },
    { hour: '11AM', orders: 35 },
    { hour: '12PM', orders: 52 },
    { hour: '1PM', orders: 48 },
    { hour: '2PM', orders: 38 },
    { hour: '3PM', orders: 28 },
    { hour: '4PM', orders: 22 },
    { hour: '5PM', orders: 32 },
    { hour: '6PM', orders: 55 },
    { hour: '7PM', orders: 62 },
    { hour: '8PM', orders: 58 },
    { hour: '9PM', orders: 42 },
  ];

  const metrics = [
    { title: 'Total Revenue', value: '$45,231', change: 12.5, icon: DollarSign, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { title: 'Total Orders', value: '1,284', change: 8.2, icon: ShoppingCart, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { title: 'Avg. Order Value', value: '$35.24', change: 5.7, icon: Target, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { title: 'Conversion Rate', value: '3.24%', change: -2.1, icon: Percent, color: 'bg-gradient-to-br from-orange-400 to-red-600' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activePage={activePage} setActivePage={setActivePage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setIsOpen={setSidebarOpen} user={user} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
                <p className="text-gray-600">Track your restaurant's key metrics and insights</p>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="year">This Year</option>
                </select>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all">
                  <Download size={18} />
                  <span className="text-sm font-medium">Export Report</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <RevenueOverview revenueData={revenueData} />
              <SalesByCategory categorySales={categorySales} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <OrdersByHour hourlyData={hourlyData} />
              <TopProducts topProducts={topProducts} />
            </div>

            <QuickStats />
          </div>
        </main>
      </div>
    </div>
  );
}