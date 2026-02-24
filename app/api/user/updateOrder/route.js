


// // app/api/user/updateOrder/route.js
// // FIXED 2025 – correct total + edit/cancel time restriction after confirmation

// import { NextResponse } from "next/server";
// import Order from "@/models/Orders";
// import connectDB from "@/lib/db";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// export async function GET(req) {
//   await connectDB();
//   const { searchParams } = new URL(req.url);
//   const orderId = searchParams.get("orderId");

//   if (!orderId) {
//     return new Response(JSON.stringify({ error: "orderId is required" }), { status: 400 });
//   }

//   try {
//     const order = await Order.findOne({ orderId });
//     if (!order) {
//       return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
//     }
//     return new Response(JSON.stringify(order), { status: 200 });
//   } catch (err) {
//     console.error("GET order failed:", err);
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }

// export async function POST(req) {
//   await connectDB();
//   const body = await req.json();

//   const {
//     orderId,
//     status,
//     items,
//     totalAmount,          // optional – we ignore it and always recalculate
//     address,
//     notes,
//     customerName,
//     customerPhone,
//     timezone = "Asia/Riyadh"  // default to your region
//   } = body;

//   if (!orderId) {
//     return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
//   }

//   try {
//     const order = await Order.findOne({ orderId });
//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     const now = new Date();


//     // ──────────────────────────────────────────────
//     // 1. FIXED TIME RESTRICTION
//     // ──────────────────────────────────────────────

//     // Only apply restriction if the order is ALREADY confirmed in the DB
//     if (order.status === "confirmed") {
//       const referenceTime = order.confirmedAt || order.createdAt;
//       const diffMinutes = (now - referenceTime) / 1000 / 60;

//       // 1a. Block Cancellation
//       if (status === "cancelled" && diffMinutes > 5) {
//         return NextResponse.json({
//           success: false,
//           error: "TIME_EXCEEDED",
//           message: "Cancellation only allowed within 5 minutes after confirmation."
//         }, { status: 403 });
//       }

//       // 1b. Block Edits (only if they are actually changing order details)
//       const isEditAttempt = items || address || customerName || customerPhone;
//       if (isEditAttempt && diffMinutes > 5) {
//         return NextResponse.json({
//           success: false,
//           error: "TIME_EXCEEDED",
//           message: "Editing only allowed within 5 minutes after confirmation."
//         }, { status: 403 });
//       }
//     }

  
//     // ──────────────────────────────────────────────
//     if (status === "confirmed" && order.status !== "confirmed") {
//       order.confirmedAt = now;
//     }

//     // ──────────────────────────────────────────────
//     // 3. Update allowed fields
//     // ──────────────────────────────────────────────
//     if (status) order.status = status;
//     if (address) order.deliveryAddress = address;
//     if (notes !== undefined) order.notes = notes;
//     if (customerName) order.customerName = customerName;
//     if (customerPhone) {
//       order.phone = customerPhone;
//       order.whatsapp = customerPhone;
//     }

//     // ──────────────────────────────────────────────
//     // 4. Always recalculate total when items are provided
//     // ──────────────────────────────────────────────
//     if (items && Array.isArray(items)) {
//       order.items = items.map(item => ({
//         name: item.name,
//         quantity: Number(item.quantity) || 1,
//         price: parseFloat(item.price || 0),
//         addons: (item.addons || []).map(a => ({
//           name: a.name,
//           price: parseFloat(a.price || 0)
//         }))
//       }));

//       let calculatedTotal = 0;
//       order.items.forEach(item => {
//         const qty = item.quantity;
//         const base = parseFloat(item.price) * qty;
//         const addonsSum = item.addons.reduce((sum, a) => sum + parseFloat(a.price), 0) * qty;
//         calculatedTotal += base + addonsSum;
//       });

//       order.total = calculatedTotal; // trusted value
//     }

//     // Save changes
//     await order.save();

//     // ──────────────────────────────────────────────
//     // 5. Return formatted local time
//     // ──────────────────────────────────────────────
//     const localOrderTime = new Intl.DateTimeFormat('en-GB', {
//       dateStyle: 'medium',
//       timeStyle: 'short',
//       timeZone: timezone
//     }).format(order.createdAt);

//     return NextResponse.json({
//       success: true,
//       localOrderTime,
//       order
//     });

//   } catch (error) {
//     console.error("Order update failed:", error);
//     return NextResponse.json({
//       success: false,
//       error: error.message || "Internal server error"
//     }, { status: 500 });
//   }
// }

// app/api/user/updateOrder/route.js → FINAL FIXED 2025 (CORRECT TOTAL + EDIT/CANCEL TIME + TIMEZONE FROM DB)
// UPDATED: uses restaurant timezone from PublicSetting (no lines removed)

import { NextResponse } from "next/server";
import Order from "@/models/Orders";
import PublicSetting from "@/models/PublicSetting"; // ← NEW: to get trusted restaurant timezone
import connectDB from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return new Response(JSON.stringify({ error: "orderId is required" }), { status: 400 });
  }

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (err) {
    console.error("GET order failed:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const {
    orderId,
    status,
    items,
    totalAmount,          // optional – we ignore it and always recalculate
    address,
    notes,
    customerName,
    customerPhone,
    timezone = "Asia/Riyadh"  // default to your region — but we override with DB value
  } = body;

  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ── NEW: Fetch trusted restaurant timezone from PublicSetting (admin-controlled) ──
    let restaurantTimezone = "Asia/Riyadh"; // fallback
    try {
      const settings = await PublicSetting.findOne({}).lean();
      if (settings?.timezone && Intl.supportedValuesOf('timeZone').includes(settings.timezone)) {
        restaurantTimezone = settings.timezone;
      }
    } catch (err) {
      console.warn("Failed to load restaurant timezone, using fallback:", err.message);
    }
    // ------------------------------------------------------------------------------------

    const now = new Date();

    // ──────────────────────────────────────────────
    // 1. FIXED TIME RESTRICTION — now timezone-aware
    // ──────────────────────────────────────────────

    // Only apply restriction if the order is ALREADY confirmed in the DB
    if (order.status === "confirmed") {
      const referenceTime = order.confirmedAt || order.createdAt;

      // Convert both times to restaurant timezone for fair comparison
      const refLocal = new Date(referenceTime.toLocaleString('en-US', { timeZone: restaurantTimezone }));
      const nowLocal = new Date(now.toLocaleString('en-US', { timeZone: restaurantTimezone }));
      const diffMinutes = (nowLocal - refLocal) / 1000 / 60;

      // 1a. Block Cancellation
      if (status === "cancelled" && diffMinutes > 5) {
        return NextResponse.json({
          success: false,
          error: "TIME_EXCEEDED",
          message: "Cancellation only allowed within 5 minutes after confirmation."
        }, { status: 403 });
      }

      // 1b. Block Edits (only if they are actually changing order details)
      const isEditAttempt = items || address || customerName || customerPhone;
      if (isEditAttempt && diffMinutes > 5) {
        return NextResponse.json({
          success: false,
          error: "TIME_EXCEEDED",
          message: "Editing only allowed within 5 minutes after confirmation."
        }, { status: 403 });
      }
    }

    // ──────────────────────────────────────────────
    if (status === "confirmed" && order.status !== "confirmed") {
      order.confirmedAt = now;
    }

    // ──────────────────────────────────────────────
    // 3. Update allowed fields
    // ──────────────────────────────────────────────
    if (status) order.status = status;
    if (address) order.deliveryAddress = address;
    if (notes !== undefined) order.notes = notes;
    if (customerName) order.customerName = customerName;
    if (customerPhone) {
      order.phone = customerPhone;
      order.whatsapp = customerPhone;
    }

    // ──────────────────────────────────────────────
    // 4. Always recalculate total when items are provided
    // ──────────────────────────────────────────────
    if (items && Array.isArray(items)) {
      order.items = items.map(item => ({
        name: item.name,
        quantity: Number(item.quantity) || 1,
        price: parseFloat(item.price || 0),
        addons: (item.addons || []).map(a => ({
          name: a.name,
          price: parseFloat(a.price || 0)
        }))
      }));

      let calculatedTotal = 0;
      order.items.forEach(item => {
        const qty = item.quantity;
        const base = parseFloat(item.price) * qty;
        const addonsSum = item.addons.reduce((sum, a) => sum + parseFloat(a.price), 0) * qty;
        calculatedTotal += base + addonsSum;
      });

      order.total = calculatedTotal; // trusted value
    }

    // Save changes
    await order.save();

    // ──────────────────────────────────────────────
    // 5. Return formatted local time — using trusted restaurant timezone
    // ──────────────────────────────────────────────
    const localOrderTime = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: restaurantTimezone // ← NEW: trusted DB timezone
    }).format(order.createdAt);

    return NextResponse.json({
      success: true,
      localOrderTime,
      order
    });

  } catch (error) {
    console.error("Order update failed:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 });
  }
}