// app/api/user/popular/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PopularItem from "@/models/PopularItem";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// ❗ FIX: remove top-level await (causes build crashes with Turbopack)
// await connectDB();

export async function GET() {
  try {
    await connectDB(); // ❗ Move DB connect inside handler

    const populars = await PopularItem.find({})
      .sort({ order: 1 })
      .populate("productId")
      .lean();

    const items = populars.map((p) => ({
      product: {
        ...p.productId,
        _id: p.productId._id.toString(),
      },
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("POPULAR GET ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
