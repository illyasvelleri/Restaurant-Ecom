// app/api/user/updateOrder/route.js
import { NextResponse } from "next/server";
import Order from "@/models/Orders"; // Ensure correct path
import connectDB from "@/lib/db";


export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return new Response(JSON.stringify({ error: "orderId is required" }), {
      status: 400,
    });
  }

  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}


// export async function POST(req) {
//   await connectDB();
//   const body = await req.json();
//   const { orderId, items, totalAmount, address, notes, customerName, customerPhone } = body;

//   if (!orderId) {
//     return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
//   }

//   try {
//     // Find the order by orderId
//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     // Update only allowed fields
//     if (items) {
//       order.items = items.map(item => ({
//         name: item.name,
//         quantity: item.quantity,
//         price: parseFloat(item.price),
//         addons: (item.addons || []).map(a => ({ name: a.name, price: parseFloat(a.price) }))
//       }));
//     }

//     if (totalAmount) order.total = parseFloat(totalAmount);
//     if (address) order.deliveryAddress = address;
//     if (notes !== undefined) order.notes = notes;
//     if (customerName) order.customerName = customerName;
//     if (customerPhone) order.phone = customerPhone;
//     if (customerPhone) order.whatsapp = customerPhone;

//     await order.save();

//     return NextResponse.json({ success: true, order });
//   } catch (error) {
//     console.error("Order update failed:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { orderId, status, items, totalAmount, address, notes, customerName, customerPhone } = body;

  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // --- NEW: 5 MINUTE CANCELLATION CHECK ---
    if (status === "cancelled") {
      const now = new Date();
      const createdTime = new Date(order.createdAt);
      const diffInMinutes = (now - createdTime) / 1000 / 60;

      if (diffInMinutes > 5) {
        return NextResponse.json({ 
          success: false, 
          error: "TIME_EXCEEDED",
          message: "Cancellation only allowed within 5 minutes of ordering." 
        }, { status: 403 });
      }
    }
    // ----------------------------------------

    if (status) order.status = status;
    if (items) {
      order.items = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        addons: (item.addons || []).map(a => ({ name: a.name, price: parseFloat(a.price) }))
      }));
    }

    if (totalAmount) order.total = parseFloat(totalAmount);
    if (address) order.deliveryAddress = address;
    if (notes !== undefined) order.notes = notes;
    if (customerName) order.customerName = customerName;
    if (customerPhone) order.phone = customerPhone;

    await order.save();
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}