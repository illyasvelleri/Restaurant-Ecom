// app/api/admin/dashboard/route.js → 100% DYNAMIC

import connectDB from "@/lib/db";
import Order from "@/models/Orders";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // TODAY'S STATS
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      status: { $ne: "cancelled" }
    }).lean();

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const todayOrdersCount = todayOrders.length;

    // YESTERDAY FOR COMPARISON
    const yesterdayOrders = await Order.find({
      createdAt: { $gte: yesterday, $lt: today },
      status: { $ne: "cancelled" }
    }).lean();

    const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.total, 0);

    // OVERALL
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const totalCustomers = await User.countDocuments({ role: "user" });
    const activeProducts = await Product.countDocuments({ status: "active" });

    const revenueGrowth = yesterdayRevenue > 0 
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
      : 0;

    const ordersGrowth = yesterdayOrders.length > 0
      ? ((todayOrdersCount - yesterdayOrders.length) / yesterdayOrders.length) * 100
      : 0;

    // RECENT ORDERS (last 10)
    const recentOrders = await Order.find({ status: { $ne: "cancelled" } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name whatsapp")
      .lean();

    const formattedOrders = recentOrders.map(o => ({
      _id: o._id,
      orderNumber: o.orderNumber,
      customerName: o.customerName || o.userId?.name || "Guest",
      phone: o.whatsapp || o.userId?.whatsapp || o.phone || "N/A",
      total: o.total,
      status: o.status,
      createdAt: o.createdAt
    }));

    return Response.json({
      stats: {
        todayRevenue: Math.round(todayRevenue).toLocaleString(),
        todayOrders: todayOrdersCount,
        totalCustomers,
        activeProducts,
        revenueGrowth: revenueGrowth.toFixed(1),
        ordersGrowth: ordersGrowth.toFixed(1),
      },
      recentOrders: formattedOrders
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}