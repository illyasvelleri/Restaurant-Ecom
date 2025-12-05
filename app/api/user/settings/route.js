// app/api/user/settings/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import connectDB from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await User.findById(session.user.id).select("notifications location");
  return Response.json({
    notifications: user?.notifications ?? true,
    location: user?.location ?? true
  });
}

export async function PUT(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  await User.findByIdAndUpdate(session.user.id, {
    notifications: body.notifications,
    location: body.location
  });

  return Response.json({ success: true });
}