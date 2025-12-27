// app/api/user/saveOrders/route.js → FINAL 2025 (ORDER ID + TIME)

import { NextResponse } from "next/server";
import Order from "@/models/Orders"; // Ensure correct path
import connectDB from "@/lib/db";

export async function POST(req) {
    await connectDB();
    const body = await req.json();

    try {
        const order = await Order.create({
            userId: body.userId || null,
            customerName: body.customerName,
            phone: body.customerPhone,
            whatsapp: body.customerPhone,
            items: body.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                addons: item.addons || []
            })),
            total: body.totalAmount,
            deliveryAddress: body.address,
            notes: body.notes || "",
            paymentMethod: "cash",
            status: "pending",
            orderId: body.orderId,         // ← NEW: Save Order ID
            orderTime: body.orderTime      // ← NEW: Save Order Time
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Order save failed:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}