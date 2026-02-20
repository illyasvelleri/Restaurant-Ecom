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

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { 
    orderId, 
    status, 
    items, 
    totalAmount, 
    address, 
    notes, 
    customerName, 
    customerPhone,
    timezone = "UTC" // Default to UTC if not provided
  } = body;

  if (!orderId) return NextResponse.json({ error: "Order ID is required" }, { status: 400 });

  try {
    const order = await Order.findOne({ orderId });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // 1. 5-MINUTE CANCELLATION CHECK (Works globally because both are UTC)
    if (status === "cancelled") {
      const now = new Date();
      const createdTime = new Date(order.createdAt);
      const diffInMinutes = (now - createdTime) / 1000 / 60;

      if (diffInMinutes > 5) {
        return NextResponse.json({ 
          success: false, 
          error: "TIME_EXCEEDED",
          message: "Cancellation only allowed within 5 minutes." 
        }, { status: 403 });
      }
    }

    // 2. UPDATE FIELDS
    if (status) order.status = status;
    if (items) order.items = items;
    if (totalAmount) order.total = parseFloat(totalAmount);
    if (address) order.deliveryAddress = address;
    if (notes !== undefined) order.notes = notes;
    if (customerName) order.customerName = customerName;
    if (customerPhone) {
        order.phone = customerPhone;
        order.whatsapp = customerPhone;
    }

    await order.save();

    // 3. GENERATE DYNAMIC LOCAL TIME FOR RESPONSE
    // This converts the UTC DB time to the user's specific local time
    const localOrderTime = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone, // e.g., 'Asia/Kolkata' or 'Asia/Dubai'
    }).format(new Date(order.createdAt));

    return NextResponse.json({ 
      success: true, 
      localOrderTime, // Sent back to Telegram/Frontend
      order 
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}