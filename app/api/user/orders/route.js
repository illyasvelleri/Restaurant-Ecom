// app/api/user/orders/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Order from "../../../../models/Orders"; // You should have this model
import connectDB from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const orders = await Order.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(50);

  return Response.json(orders);
}