// app/api/admin/orders/route.js → CORRECTED

import connectDB from "@/lib/db";
import Order from "@/models/Orders"; // ← FIXED: was Orders

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    const filter = status && status !== "all" ? { status } : {};

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ orders }); // ← This is correct
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}