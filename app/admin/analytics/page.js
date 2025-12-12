// "use client";

// import { useState } from 'react';
// import { DollarSign, ShoppingCart, Target, Percent, Download } from 'lucide-react';
// import MetricCard from '../components/MetricCard';
// import RevenueOverview from '../components/RevenueOverview';
// import SalesByCategory from '../components/SalesByCategory';
// import OrdersByHour from '../components/OrdersByHour';
// import TopProducts from '../components/TopProducts';
// import QuickStats from '../components/QuickStats';

// export default function AnalyticsPage() {
//     const [activePage, setActivePage] = useState('analytics');
//     const [timeRange, setTimeRange] = useState('7days');
//     const user = { username: "Admin1", role: "admin" };

//     const revenueData = [
//         { name: 'Mon', revenue: 4200, orders: 45 },
//         { name: 'Tue', revenue: 5100, orders: 52 },
//         { name: 'Wed', revenue: 4800, orders: 48 },
//         { name: 'Thu', revenue: 6200, orders: 65 },
//         { name: 'Fri', revenue: 7500, orders: 78 },
//         { name: 'Sat', revenue: 8900, orders: 92 },
//         { name: 'Sun', revenue: 8200, orders: 85 },
//     ];

//     const categorySales = [
//         { name: 'Pizza', value: 4500, color: '#ef4444' },
//         { name: 'Burgers', value: 3200, color: '#f97316' },
//         { name: 'Pasta', value: 2800, color: '#eab308' },
//         { name: 'Salads', value: 1900, color: '#22c55e' },
//         { name: 'Desserts', value: 1500, color: '#3b82f6' },
//         { name: 'Beverages', value: 2100, color: '#a855f7' },
//     ];

//     const topProducts = [
//         { name: 'Margherita Pizza', sales: 234, revenue: '$3,041' },
//         { name: 'Chicken Burger', sales: 189, revenue: '$1,699' },
//         { name: 'Pasta Carbonara', sales: 167, revenue: '$2,001' },
//         { name: 'Caesar Salad', sales: 145, revenue: '$1,158' },
//         { name: 'Pepperoni Pizza', sales: 128, revenue: '$1,919' },
//     ];

//     const hourlyData = [
//         { hour: '8AM', orders: 12 },
//         { hour: '9AM', orders: 18 },
//         { hour: '10AM', orders: 25 },
//         { hour: '11AM', orders: 35 },
//         { hour: '12PM', orders: 52 },
//         { hour: '1PM', orders: 48 },
//         { hour: '2PM', orders: 38 },
//         { hour: '3PM', orders: 28 },
//         { hour: '4PM', orders: 22 },
//         { hour: '5PM', orders: 32 },
//         { hour: '6PM', orders: 55 },
//         { hour: '7PM', orders: 62 },
//         { hour: '8PM', orders: 58 },
//         { hour: '9PM', orders: 42 },
//     ];

//     const metrics = [
//         { title: 'Total Revenue', value: '$45,231', change: 12.5, icon: DollarSign, color: 'bg-gradient-to-br from-green-400 to-green-600' },
//         { title: 'Total Orders', value: '1,284', change: 8.2, icon: ShoppingCart, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
//         { title: 'Avg. Order Value', value: '$35.24', change: 5.7, icon: Target, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
//         { title: 'Conversion Rate', value: '3.24%', change: -2.1, icon: Percent, color: 'bg-gradient-to-br from-orange-400 to-red-600' },
//     ];

//     return (
//         <div className="flex h-screen bg-gray-50">
//             <div className="flex-1 flex flex-col overflow-hidden">

//                 <main className="flex-1 overflow-y-auto p-6">
//                     <div className="max-w-7xl mx-auto">
//                         <div className="flex items-center justify-between mb-8">
//                             <div>
//                                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
//                                 <p className="text-gray-600">Track your restaurant&apos;s key metrics and insights</p>
//                             </div>

//                             <div className="flex gap-3">
//                                 <select
//                                     value={timeRange}
//                                     onChange={(e) => setTimeRange(e.target.value)}
//                                     className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                                 >
//                                     <option value="7days">Last 7 Days</option>
//                                     <option value="30days">Last 30 Days</option>
//                                     <option value="90days">Last 90 Days</option>
//                                     <option value="year">This Year</option>
//                                 </select>

//                                 <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all">
//                                     <Download size={18} />
//                                     <span className="text-sm font-medium">Export Report</span>
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                             {metrics.map((metric) => (
//                                 <MetricCard key={metric.title} {...metric} />
//                             ))}
//                         </div>

//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                             <RevenueOverview revenueData={revenueData} />
//                             <SalesByCategory categorySales={categorySales} />
//                         </div>

//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//                             <OrdersByHour hourlyData={hourlyData} />
//                             <TopProducts topProducts={topProducts} />
//                         </div>

//                         <QuickStats />
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// }

// app/admin/analytics/page.js → FINAL 2025 MOBILE-FIRST ANALYTICS (PURE JS)

// app/admin/analytics/page.js → FINAL 2025 (100% FIXED & WORKING)

"use client";

import { useState, useEffect } from 'react';
import {
    DollarSign, ShoppingCart, Clock, TrendingUp, Star, Download,
    Calendar
} from 'lucide-react';

// CORRECT RECHARTS IMPORTS (THIS WAS THE BUG!)
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import AdminFooter from '../../components/footer';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("7days");
    const [revenueData, setRevenueData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [hourlyData, setHourlyData] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/analytics?range=${timeRange}`);
            if (!res.ok) throw new Error();
            const data = await res.json();

            setRevenueData(data.revenue || []);
            setCategoryData(data.categories || []);
            setTopProducts(data.topProducts || []);
            setHourlyData(data.hourly || []);
            setMetrics(data.metrics || {});
        } catch (err) {
            toast.error("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                            <p className="text-sm text-gray-500">Real-time performance</p>
                        </div>
                        <button className="p-3 bg-black text-white rounded-xl shadow-lg">
                            <Download size={20} />
                        </button>
                    </div>

                    {/* TIME RANGE */}
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-100 rounded-2xl text-base"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            {/* KEY METRICS */}
            <div className="px-4 py-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
                        <DollarSign size={32} className="mb-2" />
                        <p className="text-3xl font-bold">{metrics.revenue || "0"} SAR</p>
                        <p className="text-sm opacity-90">Revenue</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
                        <ShoppingCart size={32} className="mb-2" />
                        <p className="text-3xl font-bold">{metrics.orders || "0"}</p>
                        <p className="text-sm opacity-90">Orders</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
                        <Clock size={32} className="mb-2" />
                        <p className="text-3xl font-bold">{metrics.avgOrder || "0"} SAR</p>
                        <p className="text-sm opacity-90">Avg Order</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white">
                        <TrendingUp size={32} className="mb-2" />
                        <p className="text-3xl font-bold">{metrics.growth || "0"}%</p>
                        <p className="text-sm opacity-90">Growth</p>
                    </div>
                </div>
            </div>

            {/* REVENUE CHART */}
            <div className="px-4 py-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="#fed7aa" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* CATEGORY + TOP PRODUCTS */}
            <div className="px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Sales by Category</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products</h2>
                    <div className="space-y-3">
                        {topProducts.slice(0, 6).map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center text-white font-bold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.sales} sales</p>
                                    </div>
                                </div>
                                <p className="font-bold text-gray-900">{item.revenue}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* HOURLY ORDERS */}
            <div className="px-4 py-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Peak Hours</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={hourlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="hour" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#f97316" radius={[12, 12, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <AdminFooter />
        </div>
    );
}