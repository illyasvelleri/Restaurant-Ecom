// app/api/user/popular/route.js → FINAL 100% WORKING VERSION

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PopularItem from "@/models/PopularItem";

// YOU MUST IMPORT Product model — THIS IS THE KEY!
import Product from "@/models/Product";  // ← ADD THIS LINE WAS MISSING!

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    await connectDB();

    const populars = await PopularItem.find({})
      .sort({ order: 1 })
      .populate("productId")           // ← This works IF Product model is imported
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
    return NextResponse.json({ error: "Failed to load popular items" }, { status: 500 });
  }
}