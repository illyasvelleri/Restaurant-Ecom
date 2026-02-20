// app/api/user/orders/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Order from "@/models/Orders";
import connectDB from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // Format: 0-11
  const day = searchParams.get("day");     // Format: 1-31

  let query = { userId: session.user.id };

  // Advanced Filtering Logic
  if (month || day) {
    const year = new Date().getFullYear();
    let startDate, endDate;

    if (month && !day) {
      startDate = new Date(year, parseInt(month), 1);
      endDate = new Date(year, parseInt(month) + 1, 0, 23, 59, 59);
    } else if (month && day) {
      startDate = new Date(year, parseInt(month), parseInt(day), 0, 0, 0);
      endDate = new Date(year, parseInt(month), parseInt(day), 23, 59, 59);
    }

    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
  }

  try {
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(50);
    return Response.json(orders);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}