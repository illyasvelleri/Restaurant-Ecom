import { NextResponse } from "next/server";
import Order from "../../../../models/Orders";
import connectDB from "../../../../lib/db";

export async function POST(req) {
    await connectDB();
    const body = await req.json();

    try {
        const order = await Order.create({
            userId: body.userId || null,
            customerName: body.customerName,
            phone: body.customerPhone,
            whatsapp: body.customerPhone,
            items: body.items,
            total: body.totalAmount,  // <-- FIX: matches schema (total)
            deliveryAddress: body.address,
            notes: body.notes || "",
            paymentMethod: "cash",
            status: "pending",
           

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
