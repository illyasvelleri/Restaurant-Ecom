// app/api/admin/analytics/route.js → FINAL 2025 DYNAMIC ANALYTICS API

import connectDB from "@/lib/db";
import Order from "@/models/Orders";
import Product from "@/models/Product";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const range = searchParams.get("range") || "7days";

        // DATE RANGE CALCULATION
        const now = new Date();
        let startDate;

        switch (range) {
            case "7days":
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case "30days":
                startDate = new Date(now.setDate(now.getDate() - 30));
                break;
            case "90days":
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case "year":
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(now.setDate(now.getDate() - 7));
        }

        // 1. DAILY REVENUE + ORDERS
        const revenueByDay = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$total" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format for chart
        const revenueData = revenueByDay.map(d => ({
            name: new Date(d._id).toLocaleDateString('en', { weekday: 'short' }),
            revenue: Math.round(d.revenue),
            orders: d.orders
        }));

        // 2. SALES BY CATEGORY
        const categorySales = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$product.category",
                    value: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            { $sort: { value: -1 } }
        ]);

        const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#6366f1'];
        const categoryData = categorySales.map((c, i) => ({
            name: c._id || "Unknown",
            value: Math.round(c.value),
            color: COLORS[i % COLORS.length]
        }));

        // 3. TOP 6 PRODUCTS
        const topProductsRaw = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    name: { $first: "$items.name" },
                    sales: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            { $sort: { sales: -1 } },
            { $limit: 6 }
        ]);

        const topProducts = topProductsRaw.map(p => ({
            name: p.name,
            sales: p.sales,
            revenue: Math.round(p.revenue).toLocaleString() + ""
        }));

        // 4. HOURLY ORDERS (TODAY)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const hourlyRaw = await Order.aggregate([
            [
                { $match: { createdAt: { $gte: today }, status: { $ne: "cancelled" } } },
                {
                    $group: {
                        _id: { $hour: "$createdAt" },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]]);

        const hourlyData = Array.from({ length: 24 }, (_, i) => {
            const hour = hourlyRaw.find(h => h._id === i);
            return {
                hour: i < 12 ? `${i === 0 ? 12 : i}AM` : `${i === 12 ? 12 : i - 12}PM`,
                orders: hour?.orders || 0
            };
        }).slice(8, 22); // Only show 8AM - 10PM

        // 5. KEY METRICS
        const metricsRaw = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total" },
                    totalOrders: { $sum: 1 },
                    avgOrderValue: { $avg: "$total" }
                }
            }
        ]);

        const metrics = metricsRaw[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };

        // 6. GROWTH % (vs previous period)
        const prevStart = new Date(startDate);
        prevStart.setDate(prevStart.getDate() - (now.getDate() - startDate.getDate()));

        const prevRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: prevStart, $lt: startDate }, status: { $ne: "cancelled" } } },
            { $group: { _id: null, revenue: { $sum: "$total" } } }
        ]);

        const growth = prevRevenue[0]?.revenue
            ? ((metrics.totalRevenue - prevRevenue[0].revenue) / prevRevenue[0].revenue) * 100
            : 0;

        return Response.json({
            revenue: revenueData,
            categories: categoryData,
            topProducts,
            hourly: hourlyData,
            metrics: {
                revenue: Math.round(metrics.totalRevenue).toLocaleString(),
                orders: metrics.totalOrders,
                avgOrder: metrics.avgOrderValue.toFixed(2),
                growth: growth.toFixed(1)
            }
        });

    } catch (error) {
        console.error("Analytics API error:", error);
        return Response.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}