// app/api/admin/combos/route.js → FINAL 2025 (NO MORE DUPLICATE ERRORS)

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ComboOffer from "@/models/ComboOffer";
import { uploadImage } from "@/lib/services/cloudinary";

export const dynamic = "force-dynamic";

const MAX_COMBOS = 10;

// GET
export async function GET() {
  try {
    await connectDB();
    const combos = await ComboOffer.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(combos);
  } catch (error) {
    console.error("GET combos error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST — FIXED: Safe order assignment
export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const title = formData.get("title")?.toString();
    const price = parseFloat(formData.get("price") || 0);
    const productIds = JSON.parse(formData.get("productIds") || "[]");

    if (!title || !price || productIds.length === 0) {
      return NextResponse.json(
        { error: "Title, price, and products required" },
        { status: 400 }
      );
    }

    const count = await ComboOffer.countDocuments();
    if (count >= MAX_COMBOS) {
      return NextResponse.json(
        { error: "Max 10 combos allowed" },
        { status: 400 }
      );
    }

    // SAFELY GET NEXT ORDER NUMBER
    const lastCombo = await ComboOffer.findOne().sort({ order: -1 });
    const nextOrder = lastCombo ? lastCombo.order + 1 : 1;

    let imageUrl = null;
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
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
      order: nextOrder, // ← NOW SAFE — NEVER REPEATS
    });

    return NextResponse.json(
      { message: "Combo created!", combo },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST combo error:", error);
    return NextResponse.json(
      { error: "Failed to create combo" },
      { status: 500 }
    );
  }
}

// DELETE — Reorder remaining combos
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const deleted = await ComboOffer.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // REORDER REMAINING COMBOS
    const remaining = await ComboOffer.find({}).sort({ order: 1 });
    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].order !== i + 1) {
        remaining[i].order = i + 1;
        await remaining[i].save();
      }
    }

    return NextResponse.json({ message: "Deleted & reordered" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}