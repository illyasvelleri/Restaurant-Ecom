"use client";

import { useState } from 'react';
import { Users, Activity, UserPlus, DollarSign, Filter, Download, Eye } from 'lucide-react';
import CustomerStatsCard from '../components/CustomerStatsCard';
import CustomerModal from '../components/CustomerModal';
import CustomerCard from '../components/CustomerCard';

export default function CustomersPage() {
  const [activePage, setActivePage] = useState('customers');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [filterStatus, setFilterStatus] = useState('all');
  const user = { username: "Admin1", role: "admin" };

  const customers = [
    { id: 1, name: 'John Doe', email: 'john.doe@email.com', phone: '+1 234-567-8901', orders: 45, spent: '$1,234', status: 'Active', joined: 'Jan 2024', points: 450 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', phone: '+1 234-567-8902', orders: 32, spent: '$892', status: 'Active', joined: 'Feb 2024', points: 320 },
    { id: 3, name: 'Mike Johnson', email: 'mike.j@email.com', phone: '+1 234-567-8903', orders: 28, spent: '$756', status: 'Active', joined: 'Mar 2024', points: 280 },
    { id: 4, name: 'Sarah Williams', email: 'sarah.w@email.com', phone: '+1 234-567-8904', orders: 67, spent: '$2,145', status: 'Active', joined: 'Dec 2023', points: 670 },
    { id: 5, name: 'David Brown', email: 'david.b@email.com', phone: '+1 234-567-8905', orders: 15, spent: '$432', status: 'Active', joined: 'May 2024', points: 150 },
    { id: 6, name: 'Emma Davis', email: 'emma.d@email.com', phone: '+1 234-567-8906', orders: 8, spent: '$234', status: 'Inactive', joined: 'Aug 2024', points: 80 },
    { id: 7, name: 'Robert Wilson', email: 'robert.w@email.com', phone: '+1 234-567-8907', orders: 52, spent: '$1,567', status: 'Active', joined: 'Nov 2023', points: 520 },
    { id: 8, name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '+1 234-567-8908', orders: 39, spent: '$1,023', status: 'Active', joined: 'Jan 2024', points: 390 },
  ];

  const stats = [
    { title: 'Total Customers', value: '856', icon: Users, color: 'bg-gradient-to-br from-blue-400 to-blue-600', percentage: 12.5 },
    { title: 'Active Customers', value: '743', icon: Activity, color: 'bg-gradient-to-br from-green-400 to-green-600', percentage: 8.2 },
    { title: 'New This Month', value: '48', icon: UserPlus, color: 'bg-gradient-to-br from-purple-400 to-purple-600', percentage: 15.3 },
    { title: 'Avg. Order Value', value: '$32.50', icon: DollarSign, color: 'bg-gradient-to-br from-orange-400 to-red-600', percentage: 5.7 },
  ];

  const filteredCustomers = filterStatus === 'all' 
    ? customers 
    : customers.filter(customer => customer.status.toLowerCase() === filterStatus);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">   
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers Management</h1>
              <p className="text-gray-600">Manage and track your customer relationships</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <CustomerStatsCard key={stat.title} {...stat} />
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        filterStatus === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      All Customers
                    </button>
                    <button
                      onClick={() => setFilterStatus('active')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        filterStatus === 'active' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setFilterStatus('inactive')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        filterStatus === 'inactive' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Filter size={18} />
                      <span className="text-sm font-medium">{viewMode === 'table' ? 'Grid View' : 'Table View'}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all">
                      <Download size={18} />
                      <span className="text-sm font-medium">Export</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === 'table' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{customer.orders}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{customer.spent}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {customer.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.joined}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onView={setSelectedCustomer}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedCustomer && (
        <CustomerModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  );
}