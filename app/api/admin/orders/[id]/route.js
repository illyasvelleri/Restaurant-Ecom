// app/api/admin/orders/[id]/route.js

import connectDB from "@/lib/db";
import Order from "@/models/Orders";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { status } = await req.json();
    const validStatuses = ["pending", "confirmed", "preparing", "on-the-way", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}