// app/api/admin/combos/route.js → 100% Working (Vercel + Turbopack Safe)

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ComboOffer from "@/models/ComboOffer";
import { uploadImage } from "@/lib/services/cloudinary";

// Critical: Prevent Next.js from trying to statically render this API route
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_COMBOS = 10;

// GET: Fetch all combos
export async function GET() {
  try {
    await connectDB();

    const combos = await ComboOffer.find({})
      .sort({ order: 1 })
      .lean();

    return NextResponse.json(combos, { status: 200 });
  } catch (error) {
    console.error("GET combos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch combos" },
      { status: 500 }
    );
  }
}

// POST: Create new combo
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const title = formData.get("title")?.toString();
    const price = parseFloat(formData.get("price") || 0);
    const productIds = JSON.parse(formData.get("productIds") || "[]");

    if (!title || !price || productIds.length === 0) {
      return NextResponse.json(
        { error: "Title, price, and products are required" },
        { status: 400 }
      );
    }

    const count = await ComboOffer.countDocuments();
    if (count >= MAX_COMBOS) {
      return NextResponse.json(
        { error: "Maximum 10 combo offers allowed" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    const imageFile = formData.get("image");

    // Only upload if file exists and has size
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json(
          { error: "Image upload failed" },
          { status: 500 }
        );
      }
    }

    const combo = await ComboOffer.create({
      title,
      description: formData.get("description")?.toString() || "",
      price,
      originalPrice: formData.get("originalPrice")
        ? parseFloat(formData.get("originalPrice"))
        : null,
      image: imageUrl,
      productIds,
      order: count + 1,
    });

    return NextResponse.json(
      { message: "Combo created successfully!", combo },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST combo error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE: Remove combo by ID
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Combo ID is required" },
        { status: 400 }
      );
    }

    const deleted = await ComboOffer.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Combo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Combo deleted successfully" });
  } catch (error) {
    console.error("DELETE combo error:", error);
    return NextResponse.json(
      { error: "Failed to delete combo" },
      { status: 500 }
    );
  }
}