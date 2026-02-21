// app/api/user/saveOrders/route.js → FINAL FIXED 2025 (CORRECT TOTAL + ORDER ID + TIME)

import { NextResponse } from "next/server";
import Order from "@/models/Orders";
import connectDB from "@/lib/db";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const {
      userId = null,
      customerName,
      customerPhone,
      items,
      address,
      notes = "",
      paymentMethod = "cash"
    } = body;

    // Validation
    if (!customerName || !customerPhone || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields: customerName, customerPhone, items" },
        { status: 400 }
      );
    }

    // Calculate correct total (base + addons × quantity)
    let calculatedTotal = 0;

    const formattedItems = items.map(item => {
      const qty = Number(item.quantity) || 1;
      const basePrice = parseFloat(item.price || 0);
      const baseTotal = basePrice * qty;

      let addonsTotal = 0;
      const formattedAddons = (item.addons || []).map(addon => {
        const addonPrice = parseFloat(addon.price || 0);
        addonsTotal += addonPrice;
        return {
          name: addon.name,
          price: addonPrice
        };
      });

      const itemTotal = baseTotal + (addonsTotal * qty);
      calculatedTotal += itemTotal;

      return {
        name: item.name,
        quantity: qty,
        price: basePrice,
        addons: formattedAddons
      };
    });

    // Generate order ID if not provided
    const orderId = body.orderId || "ORD-" + Math.floor(100000 + Math.random() * 900000).toString();

    // Generate order time (server time, Asia/Riyadh timezone)
    const orderTime = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Riyadh",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    // Create order
    const order = await Order.create({
      userId,
      customerName,
      phone: customerPhone,
      whatsapp: customerPhone,
      items: formattedItems,
      total: calculatedTotal,           // ← FIXED: always correct total with addons
      deliveryAddress: address,
      notes,
      paymentMethod,
      status: "pending",
      orderId,                          // ← saved reliably
      orderTime                         // ← saved reliably
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.orderId,
      orderTime: order.orderTime,
      total: order.total,
      order 
    });

  } catch (error) {
    console.error("Order save failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}