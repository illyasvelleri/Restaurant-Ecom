//admin/orders
"use client";

import { useState } from 'react';
import { ShoppingBag, Clock, Truck, Check, XCircle, Eye, Calendar, Download } from 'lucide-react';
import OrderStatsCard from '../components/OrderStatsCard';
import OrderModal from '../components/OrderModal';

export default function OrdersPage() {
    const [activePage, setActivePage] = useState('orders');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const user = { username: "Admin1", role: "admin" };

    const orders = [
        { id: '#ORD-2024-001', customer: 'John Doe', items: 'Pizza Margherita, Coke', total: '$28.50', status: 'Delivered', date: 'Oct 10, 2024', time: '2:30 PM', payment: 'Credit Card' },
        { id: '#ORD-2024-002', customer: 'Jane Smith', items: 'Burger Combo, Fries', total: '$45.00', status: 'Processing', date: 'Oct 11, 2024', time: '1:15 PM', payment: 'PayPal' },
        { id: '#ORD-2024-003', customer: 'Mike Johnson', items: 'Pasta Carbonara', total: '$22.00', status: 'Pending', date: 'Oct 11, 2025', time: '3:45 PM', payment: 'Cash' },
        { id: '#ORD-2024-004', customer: 'Sarah Williams', items: 'Caesar Salad, Water', total: '$18.50', status: 'Delivered', date: 'Oct 9, 2024', time: '12:00 PM', payment: 'Credit Card' },
        { id: '#ORD-2024-005', customer: 'David Brown', items: 'Sushi Platter, Green Tea', total: '$65.00', status: 'Processing', date: 'Oct 11, 2024', time: '4:20 PM', payment: 'Credit Card' },
        { id: '#ORD-2024-006', customer: 'Emma Davis', items: 'Chicken Wings, Beer', total: '$32.00', status: 'Cancelled', date: 'Oct 10, 2024', time: '6:30 PM', payment: 'Credit Card' },
    ];

    const stats = [
        { title: 'Total Orders', value: '1,284', icon: ShoppingBag, color: 'bg-gradient-to-br from-blue-400 to-blue-600', percentage: 12.5 },
        { title: 'Pending Orders', value: '45', icon: Clock, color: 'bg-gradient-to-br from-yellow-400 to-yellow-600', percentage: 8.2 },
        { title: 'Processing', value: '28', icon: Truck, color: 'bg-gradient-to-br from-purple-400 to-purple-600', percentage: -3.1 },
        { title: 'Completed Today', value: '156', icon: Check, color: 'bg-gradient-to-br from-green-400 to-green-600', percentage: 15.8 },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <Check size={16} />;
            case 'Processing': return <Truck size={16} />;
            case 'Pending': return <Clock size={16} />;
            case 'Cancelled': return <XCircle size={16} />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status.toLowerCase() === filterStatus);

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="flex-1 flex flex-col overflow-hidden">

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
                            <p className="text-gray-600">Track and manage all your restaurant orders</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat) => (
                                <OrderStatsCard key={stat.title} {...stat} />
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <h2 className="text-xl font-bold text-gray-900">All Orders</h2>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                            <button
                                                onClick={() => setFilterStatus('all')}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterStatus === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                                                    }`}
                                            >
                                                All
                                            </button>
                                            <button
                                                onClick={() => setFilterStatus('pending')}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterStatus === 'pending' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                                                    }`}
                                            >
                                                Pending
                                            </button>
                                            <button
                                                onClick={() => setFilterStatus('processing')}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterStatus === 'processing' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                                                    }`}
                                            >
                                                Processing
                                            </button>
                                            <button
                                                onClick={() => setFilterStatus('delivered')}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterStatus === 'delivered' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                                                    }`}
                                            >
                                                Delivered
                                            </button>
                                        </div>

                                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Calendar size={18} />
                                            <span className="text-sm font-medium">Filter Date</span>
                                        </button>

                                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all">
                                            <Download size={18} />
                                            <span className="text-sm font-medium">Export</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{order.items}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.total}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <div>{order.date}</div>
                                                    <div className="text-xs text-gray-500">{order.time}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
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
                    </div>
                </main>
            </div>

            {selectedOrder && (
                <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
}