"use client";

import { useState } from 'react';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RecentOrders from '../components/RecentOrders';

export default function AdminDashboard() {
  const user = { username: "Admin1", role: "admin" };

  const stats = [
    { title: "Total Revenue", value: "$45,231", change: 12.5, icon: DollarSign, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { title: "Total Orders", value: "1,284", change: 8.2, icon: ShoppingBag, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { title: "Total Customers", value: "856", change: 15.3, icon: Users, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { title: "Active Products", value: "124", change: -2.4, icon: Package, color: 'bg-gradient-to-br from-orange-400 to-red-600' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back, {user.username}! Here&apos;s what&apos;s happening today.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <StatsCard key={stat.title} {...stat} />
              ))}
            </div>

            <RecentOrders />
          </div>
        </main>
      </div>
    </div>
  );
}