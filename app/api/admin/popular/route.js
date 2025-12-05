// app/api/admin/popular/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PopularItem from "@/models/PopularItem";
import Product from "@/models/Product";

const MAX_POPULAR = 8;

// GET: return all popular items
export async function GET() {
  try {
    await connectDB();

    const populars = await PopularItem.find({})
      .sort({ order: 1 })
      .populate("productId");

    const items = populars.map((p) => ({
      _id: p._id,
      product: p.productId,
      order: p.order,
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET popular error:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular items" },
      { status: 500 }
    );
  }
}

// POST: add a new popular item
export async function POST(request) {
  try {
    await connectDB();

    const { productId } = await request.json();

    if (!productId || productId.length < 12) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const exists = await PopularItem.findOne({ productId });
    if (exists) {
      return NextResponse.json(
        { error: "This item is already popular" },
        { status: 400 }
      );
    }

    const count = await PopularItem.countDocuments();
    if (count >= MAX_POPULAR) {
      return NextResponse.json(
        { error: "Maximum 8 popular items allowed" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const popular = await PopularItem.create({
      productId,
      order: count + 1,
    });

    return NextResponse.json(
      {
        message: "Added to popular!",
        popular: {
          _id: popular._id,
          product: product.toObject(),
          order: popular.order,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST popular error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add to popular" },
      { status: 500 }
    );
  }
}

// DELETE: remove a popular item
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    const result = await PopularItem.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Removed from popular" });
  } catch (error) {
    console.error("DELETE popular error:", error);
    return NextResponse.json(
      { error: "Failed to remove" },
      { status: 500 }
    );
  }
}
