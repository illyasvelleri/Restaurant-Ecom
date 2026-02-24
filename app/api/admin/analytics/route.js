// // app/api/admin/analytics/route.js → FULL ADVANCED READY-TO-USE API WITH GPT INSIGHTS

// import connectDB from "@/lib/db";
// import Order from "@/models/Orders";
// import Product from "@/models/Product";
// import OpenAI from "openai";

// export const dynamic = 'force-dynamic';

// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const range = searchParams.get("range") || "7days";

//     // DATE RANGE
//     const now = new Date();
//     let startDate = new Date();
//     switch (range) {
//       case "today":
//         startDate.setHours(0, 0, 0, 0);
//         break;
//       case "7days":
//         startDate.setDate(now.getDate() - 7);
//         break;
//       case "30days":
//         startDate.setDate(now.getDate() - 30);
//         break;
//       case "90days":
//         startDate.setMonth(now.getMonth() - 3);
//         break;
//       case "year":
//         startDate.setFullYear(now.getFullYear() - 1);
//         break;
//       case "all":
//         startDate = new Date(0); // beginning of time
//         break;
//       default:
//         startDate.setDate(now.getDate() - 7);
//     }

//     // REVENUE BY DAY
//     const revenueByDay = await Order.aggregate([
//       { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           revenue: { $sum: "$total" },
//           orders: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     const revenueData = revenueByDay.map(d => ({
//       name: new Date(d._id).toLocaleDateString('en', { weekday: 'short' }),
//       revenue: Math.round(d.revenue),
//       orders: d.orders
//     }));

//     // SALES BY CATEGORY
//     const categorySales = await Order.aggregate([
//       { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
//       { $unwind: "$items" },
//       {
//         $lookup: {
//           from: "products",
//           localField: "items.name",
//           foreignField: "name",
//           as: "product"
//         }
//       },
//       { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
//       {
//         $group: {
//           _id: "$product.category",
//           value: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
//         }
//       },
//       { $sort: { value: -1 } }
//     ]);

//     const categoryData = categorySales.map((c, i) => ({
//       name: c._id || "Other",
//       value: Math.round(c.value),
//     }));

//     // TOP PRODUCTS
//     const topProductsRaw = await Order.aggregate([
//       { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
//       { $unwind: "$items" },
//       {
//         $group: {
//           _id: "$items.name",
//           name: { $first: "$items.name" },
//           sales: { $sum: "$items.quantity" },
//           revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
//         }
//       },
//       { $sort: { sales: -1 } },
//       { $limit: 10 }
//     ]);

//     const topProducts = topProductsRaw.map(p => ({
//       name: p.name,
//       sales: p.sales,
//       revenue: Math.round(p.revenue).toLocaleString()
//     }));

//     // LOW PRODUCTS (bottom 5)
//     const lowProductsRaw = await Order.aggregate([
//       { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
//       { $unwind: "$items" },
//       {
//         $group: {
//           _id: "$items.name",
//           name: { $first: "$items.name" },
//           sales: { $sum: "$items.quantity" },
//           revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
//         }
//       },
//       { $sort: { sales: 1 } },
//       { $limit: 5 }
//     ]);

//     const lowProducts = lowProductsRaw.map(p => ({
//       name: p.name,
//       sales: p.sales,
//       revenue: Math.round(p.revenue).toLocaleString()
//     }));

//     // HOURLY ORDERS
//     const hourlyRaw = await Order.aggregate([
//       { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
//       {
//         $group: {
//           _id: { $hour: "$createdAt" },
//           orders: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     const hourlyData = Array.from({ length: 24 }, (_, i) => {
//       const hourData = hourlyRaw.find(h => h._id === i);
//       return {
//         hour: i < 12 ? `${i === 0 ? 12 : i}AM` : `${i === 12 ? 12 : i - 12}PM`,
//         orders: hourData?.orders || 0
//       };
//     });

//     // DAILY METRICS (today)
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);
//     const today = await Order.aggregate([
//       { $match: { createdAt: { $gte: todayStart }, status: { $ne: "cancelled" } } },
//       { $group: { _id: null, revenue: { $sum: "$total" }, orders: { $sum: 1 }, avg: { $avg: "$total" } } }
//     ]);

//     // MONTHLY METRICS
//     const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     const currentMonth = await Order.aggregate([
//       { $match: { createdAt: { $gte: currentMonthStart }, status: { $ne: "cancelled" } } },
//       { $group: { _id: null, revenue: { $sum: "$total" } } }
//     ]);
//     const lastMonth = await Order.aggregate([
//       { $match: { createdAt: { $gte: lastMonthStart, $lt: currentMonthStart }, status: { $ne: "cancelled" } } },
//       { $group: { _id: null, revenue: { $sum: "$total" } } }
//     ]);

//     // KEY METRICS
//     const metricsRaw = await Order.aggregate([
//       { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$total" },
//           totalOrders: { $sum: 1 },
//           avgOrderValue: { $avg: "$total" }
//         }
//       }
//     ]);

//     const metrics = metricsRaw[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };

//     // GROWTH
//     const duration = now.getTime() - startDate.getTime();
//     const prevStart = new Date(startDate.getTime() - duration);
//     const prevRevenue = await Order.aggregate([
//       { $match: { createdAt: { $gte: prevStart, $lt: startDate }, status: { $ne: "cancelled" } } },
//       { $group: { _id: null, revenue: { $sum: "$total" } } }
//     ]);
//     const oldRev = prevRevenue[0]?.revenue || 0;
//     const growth = oldRev > 0 ? ((metrics.totalRevenue - oldRev) / oldRev * 100).toFixed(1) : 0;

//     // GPT INSIGHTS
//     let insights = "";
//     if (process.env.OPENAI_API_KEY) {
//       const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//       try {
//         const completion = await openai.chat.completions.create({
//           model: "gpt-4o-mini",
//           messages: [
//             { role: "system", content: "You are a restaurant analytics advisor. Provide 2-3 concise, actionable insights based on the data." },
//             { role: "user", content: `Revenue: $${metrics.totalRevenue.toLocaleString()}\nOrders: ${metrics.totalOrders}\nTop Product: ${topProducts[0]?.name || 'N/A'}\nPeak Hour: ${hourlyData.reduce((max, h) => h.orders > max.orders ? h : max, {orders: 0}).hour || 'N/A'}\nGrowth: ${growth}%` }
//           ]
//         });
//         insights = completion.choices[0].message.content.trim();
//       } catch (err) {
//         console.error("GPT error:", err);
//       }
//     }

//     return Response.json({
//       revenue: revenueData,
//       categories: categoryData,
//       topProducts,
//       lowProducts,
//       hourly: hourlyData,
//       daily: {
//         todayRevenue: today[0]?.revenue?.toLocaleString() || "0",
//         todayOrders: today[0]?.orders || 0,
//         todayAvg: today[0]?.avg?.toFixed(2) || "0"
//       },
//       monthly: {
//         currentRevenue: currentMonth[0]?.revenue?.toLocaleString() || "0",
//         lastRevenue: lastMonth[0]?.revenue?.toLocaleString() || "0",
//         growth
//       },
//       metrics: {
//         revenue: metrics.totalRevenue.toLocaleString(),
//         orders: metrics.totalOrders,
//         avgOrder: metrics.avgOrderValue.toFixed(2),
//         growth
//       },
//       insights
//     });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }


// app/api/admin/analytics/route.js → FULL ADVANCED READY-TO-USE API WITH GPT INSIGHTS
// UPDATED: uses restaurant timezone from PublicSetting (no lines removed)

import connectDB from "@/lib/db";
import Order from "@/models/Orders";
import Product from "@/models/Product";
import PublicSetting from "@/models/PublicSetting"; // ← NEW: trusted restaurant timezone
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7days";

    // ── NEW: Fetch trusted restaurant timezone from PublicSetting (admin-controlled) ──
    let timezone = "Asia/Riyadh"; // fallback
    try {
      const settings = await PublicSetting.findOne({}).lean();
      if (settings?.timezone && Intl.supportedValuesOf('timeZone').includes(settings.timezone)) {
        timezone = settings.timezone;
      }
    } catch (err) {
      console.warn("Failed to load restaurant timezone, using fallback:", err.message);
    }
    // ------------------------------------------------------------------------------------

    const now = new Date();

    // DATE RANGE — now timezone-aware
    let startDate = new Date();
    switch (range) {
      case "today":
        // Start of today in restaurant timezone
        const todayStartStr = now.toLocaleString('en-US', {
          timeZone: timezone,
          year: 'numeric', month: 'numeric', day: 'numeric',
          hour: 'numeric', minute: 'numeric', second: 'numeric',
          hour12: false
        });
        startDate = new Date(todayStartStr.split(',')[0] + ' 00:00:00');
        break;
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        startDate = new Date(0); // beginning of time
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // REVENUE BY DAY — use restaurant timezone for date string
    const revenueByDay = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone } }, // ← NEW: timezone param
          revenue: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const revenueData = revenueByDay.map(d => ({
      name: new Date(d._id).toLocaleDateString('en', { weekday: 'short' }),
      revenue: Math.round(d.revenue),
      orders: d.orders
    }));

    // SALES BY CATEGORY — unchanged
    const categorySales = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.name",
          foreignField: "name",
          as: "product"
        }
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$product.category",
          value: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { value: -1 } }
    ]);

    const categoryData = categorySales.map((c, i) => ({
      name: c._id || "Other",
      value: Math.round(c.value),
    }));

    // TOP PRODUCTS — unchanged
    const topProductsRaw = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          name: { $first: "$items.name" },
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 10 }
    ]);

    const topProducts = topProductsRaw.map(p => ({
      name: p.name,
      sales: p.sales,
      revenue: Math.round(p.revenue).toLocaleString()
    }));

    // LOW PRODUCTS (bottom 5) — unchanged
    const lowProductsRaw = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          name: { $first: "$items.name" },
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { sales: 1 } },
      { $limit: 5 }
    ]);

    const lowProducts = lowProductsRaw.map(p => ({
      name: p.name,
      sales: p.sales,
      revenue: Math.round(p.revenue).toLocaleString()
    }));

    // HOURLY ORDERS — now grouped by restaurant local hour
    const hourlyRaw = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $hour: { date: "$createdAt", timezone } }, // ← NEW: timezone-aware hour
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hourData = hourlyRaw.find(h => h._id === i);
      return {
        hour: i < 12 ? `${i === 0 ? 12 : i}AM` : `${i === 12 ? 12 : i - 12}PM`,
        orders: hourData?.orders || 0
      };
    });

    // DAILY METRICS (today) — today in restaurant timezone
    const todayStart = new Date(now.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    }).split(',')[0] + ' 00:00:00');

    const today = await Order.aggregate([
      { $match: { createdAt: { $gte: todayStart }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, revenue: { $sum: "$total" }, orders: { $sum: 1 }, avg: { $avg: "$total" } } }
    ]);

    // MONTHLY METRICS — current & last month in restaurant timezone
    const currentMonthStartStr = now.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric', month: 'numeric', day: 'numeric'
    }).split(',')[0] + ' 01 00:00:00';
    const currentMonthStart = new Date(currentMonthStartStr);

    const lastMonthStart = new Date(currentMonthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    const currentMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: currentMonthStart }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, revenue: { $sum: "$total" } } }
    ]);
    const lastMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: lastMonthStart, $lt: currentMonthStart }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, revenue: { $sum: "$total" } } }
    ]);

    // KEY METRICS — unchanged
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

    // GROWTH — unchanged
    const duration = now.getTime() - startDate.getTime();
    const prevStart = new Date(startDate.getTime() - duration);
    const prevRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: prevStart, $lt: startDate }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, revenue: { $sum: "$total" } } }
    ]);
    const oldRev = prevRevenue[0]?.revenue || 0;
    const growth = oldRev > 0 ? ((metrics.totalRevenue - oldRev) / oldRev * 100).toFixed(1) : 0;

    // GPT INSIGHTS — unchanged
    let insights = "";
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a restaurant analytics advisor. Provide 2-3 concise, actionable insights based on the data." },
            { role: "user", content: `Revenue: $${metrics.totalRevenue.toLocaleString()}\nOrders: ${metrics.totalOrders}\nTop Product: ${topProducts[0]?.name || 'N/A'}\nPeak Hour: ${hourlyData.reduce((max, h) => h.orders > max.orders ? h : max, {orders: 0}).hour || 'N/A'}\nGrowth: ${growth}%` }
          ]
        });
        insights = completion.choices[0].message.content.trim();
      } catch (err) {
        console.error("GPT error:", err);
      }
    }

    return Response.json({
      revenue: revenueData,
      categories: categoryData,
      topProducts,
      lowProducts,
      hourly: hourlyData,
      daily: {
        todayRevenue: today[0]?.revenue?.toLocaleString() || "0",
        todayOrders: today[0]?.orders || 0,
        todayAvg: today[0]?.avg?.toFixed(2) || "0"
      },
      monthly: {
        currentRevenue: currentMonth[0]?.revenue?.toLocaleString() || "0",
        lastRevenue: lastMonth[0]?.revenue?.toLocaleString() || "0",
        growth
      },
      metrics: {
        revenue: metrics.totalRevenue.toLocaleString(),
        orders: metrics.totalOrders,
        avgOrder: metrics.avgOrderValue.toFixed(2),
        growth
      },
      insights
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}