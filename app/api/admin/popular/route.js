// app/api/admin/popular/route.js → FINAL & FLAWLESS (Vercel Safe)

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PopularItem from "@/models/PopularItem";
import Product from "@/models/Product";

// Prevent Next.js from trying to prerender this API route
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const MAX_POPULAR = 8;

// GET: Return all popular items with full product data
export async function GET() {
  try {
    await connectDB();

    const populars = await PopularItem.find({})
      .sort({ order: 1 })
      .populate("productId")
      .lean(); // .lean() = faster + plain JS objects

    const items = populars.map((p) => ({
      _id: p._id.toString(),
      product: p.productId,
      order: p.order,
    }));

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("GET popular error:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular items" },
      { status: 500 }
    );
  }
}

// POST: Add new popular item
export async function POST(request) {
  try {
    await connectDB();

    const { productId } = await request.json();

    // Validate ID
    if (!productId || typeof productId !== "string" || productId.length < 12) {
      return NextResponse.json(
        { error: "Valid product ID is required" },
        { status: 400 }
      );
    
    }

    // Check if already in popular
    const exists = await PopularItem.findOne({ productId });
    if (exists) {
      return NextResponse.json(
        { error: "This item is already in popular" },
        { status: 400 }
      );
    }

    // Check limit
    const count = await PopularItem.countDocuments();
    if (count >= MAX_POPULAR) {
      return NextResponse.json(
        { error: "Maximum 8 popular items allowed" },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Create popular entry
    const popular = await PopularItem.create({
      productId,
      order: count + 1,
    });

    return NextResponse.json(
      {
        message: "Added to popular!",
        popular: {
          _id: popular._id.toString(),
          product,
          order: popular.order,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST popular error:", error);
    return NextResponse.json(
      { error: "Failed to add to popular" },
      { status: 500 }
    );
  }
}

// DELETE: Remove from popular
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Popular item ID is required" },
        { status: 400 }
      );
    }

    const result = await PopularItem.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: "Popular item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Removed from popular" });
  } catch (error) {
    console.error("DELETE popular error:", error);
    return NextResponse.json(
      { error: "Failed to remove from popular" },
      { status: 500 }
    );
  }
}