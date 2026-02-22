// app/admin/analytics/page.js → FULL ADVANCED READY-TO-USE PAGE WITH AI INSIGHTS

"use client";

import { useState, useEffect } from 'react';
import {
    DollarSign, ShoppingCart, Clock, TrendingUp, Star, Download,
    Calendar, BarChart3, PieChart as PieIcon, Package, AlertTriangle
} from 'lucide-react';

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
    Tooltip,
    Legend
} from 'recharts';
import AdminFooter from '../../components/footer';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("7days");
    const [tab, setTab] = useState("overview");
    const [revenueData, setRevenueData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [lowProducts, setLowProducts] = useState([]);
    const [hourlyData, setHourlyData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState({});
    const [metrics, setMetrics] = useState({});
    const [insights, setInsights] = useState("");
    const [loading, setLoading] = useState(true);
    const [showInsights, setShowInsights] = useState(false);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/analytics?range=${timeRange}`);
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();

            setRevenueData(data.revenue || []);
            setCategoryData(data.categories || []);
            setTopProducts(data.topProducts || []);
            setLowProducts(data.lowProducts || []);
            setHourlyData(data.hourly || []);
            setDailyData(data.daily || []);
            setMonthlyData(data.monthly || {});
            setMetrics(data.metrics || {});
            setInsights(data.insights || "");
        } catch (err) {
            toast.error("Failed to load analytics: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#6366f1'];

    const exportCSV = () => {
        const headers = ["Date", "Revenue", "Orders"];
        const rows = revenueData.map(d => [d.name, d.revenue, d.orders]);
        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics_${timeRange}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Restaurant Analytics</h1>
                            <p className="text-sm text-gray-500">Real-time performance & insights</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={exportCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
                            >
                                <Download size={18} /> Export CSV
                            </button>
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium border border-gray-200"
                            >
                                <option value="today">Today</option>
                                <option value="7days">Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                                <option value="90days">Last 90 Days</option>
                                <option value="year">This Year</option>
                                <option value="all">All Time</option>
                            </select>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="mt-6 flex overflow-x-auto gap-2 pb-2">
                        {["overview", "products", "time", "categories"].map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${tab === t
                                        ? "bg-black text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {t === "overview" ? "Overview" :
                                    t === "products" ? "Products" :
                                        t === "time" ? "Time & Peak" :
                                            "Categories"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black"></div>
                </div>
            ) : (
                <>
                    {/* OVERVIEW TAB */}
                    {tab === "overview" && (
                        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                            {/* KEY METRICS */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <DollarSign size={24} className="text-green-600" />
                                        <p className="text-sm text-gray-500 font-medium">Revenue</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{metrics.revenue || "$0"}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <ShoppingCart size={24} className="text-blue-600" />
                                        <p className="text-sm text-gray-500 font-medium">Orders</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{metrics.orders || "0"}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock size={24} className="text-purple-600" />
                                        <p className="text-sm text-gray-500 font-medium">Avg Order</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{metrics.avgOrder || "$0"}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp size={24} className="text-orange-600" />
                                        <p className="text-sm text-gray-500 font-medium">Growth</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{metrics.growth || "0"}%</p>
                                </div>
                            </div>

                            {/* REVENUE TREND */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
                                <ResponsiveContainer width="100%" height={320}>
                                    <AreaChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="#fed7aa" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* DAILY + MONTHLY */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Snapshot</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                            <span className="text-gray-600">Revenue Today</span>
                                            <span className="font-bold text-xl text-green-600">{dailyData.todayRevenue || "$0"}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                            <span className="text-gray-600">Orders Today</span>
                                            <span className="font-bold text-xl">{dailyData.todayOrders || "0"}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3">
                                            <span className="text-gray-600">Avg Order Today</span>
                                            <span className="font-bold text-xl">{dailyData.todayAvg || "$0"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Comparison</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                            <span className="text-gray-600">This Month Revenue</span>
                                            <span className="font-bold text-xl text-green-600">{monthlyData.currentRevenue || "$0"}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                            <span className="text-gray-600">Last Month Revenue</span>
                                            <span className="font-bold text-xl">{monthlyData.lastRevenue || "$0"}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3">
                                            <span className="text-gray-600">Growth</span>
                                            <span className={`font-bold text-xl ${monthlyData.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                                                {monthlyData.growth || "0"}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI INSIGHTS */}
                            {insights && (
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl md:text-2xl font-bold text-indigo-900 flex items-center gap-3">
                                            <Star size={24} className="text-indigo-600" />
                                            Smart Business Insights
                                        </h2>
                                        <button
                                            onClick={() => setShowInsights(!showInsights)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                                        >
                                            {showInsights ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {showInsights ? (
                                        <div className="prose prose-indigo max-w-none text-gray-800 leading-relaxed">
                                            {insights.split('\n').map((line, i) => (
                                                <p key={i} className="mb-3">{line}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 italic">Click to reveal AI-powered suggestions</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PRODUCTS TAB */}
                    {tab === "products" && (
                        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Products</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {topProducts.map((item, i) => (
                                                <tr key={i} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sales}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{item.revenue}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {lowProducts.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <AlertTriangle size={20} className="text-amber-600" />
                                        Low Performing Products
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {lowProducts.map((item, i) => (
                                                    <tr key={i} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sales}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{item.revenue}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TIME TAB */}
                    {tab === "time" && (
                        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                            {/* Peak Hours Chart – unchanged, already correct */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Peak Hours (Orders)</h2>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={hourlyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis dataKey="hour" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="orders" fill="#f97316" radius={[12, 12, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Busiest Days – FIXED: no .map(), show today's data directly */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Activity</h2>
                                {dailyData && Object.keys(dailyData).length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Orders Today</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                {dailyData.todayOrders || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Revenue Today</span>
                                            <span className="text-xl font-bold text-green-600">
                                                {dailyData.todayRevenue || "$0"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-3">
                                            <span className="text-gray-600 font-medium">Average Order Value</span>
                                            <span className="text-xl font-bold text-purple-600">
                                                {dailyData.todayAvg || "$0"}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No data available for today</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CATEGORIES TAB */}
                    {tab === "categories" && (
                        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Sales by Category (Pie)</h2>
                                    <ResponsiveContainer width="100%" height={320}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={120}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {categoryData.map((entry, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Category Revenue (Bar)</h2>
                                    <ResponsiveContainer width="100%" height={320}>
                                        <BarChart data={categoryData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                            <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={70} />
                                            <YAxis fontSize={12} />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#f97316" radius={[12, 12, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            <AdminFooter />
        </div>
    );
}