// app/api/admin/customers/route.js → WITH SEARCH & PAGINATION

import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 20;

    const query = {
      role: "user",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { whatsapp: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    };

    const customers = await User.find(query)
      .select("name username whatsapp email address city neighborhood createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);

    return new Response(
      JSON.stringify({
        customers,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch customers" }),
      { status: 500 }
    );
  }
}