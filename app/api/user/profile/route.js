// app/api/user/profile/route.js → FINAL & FLAWLESS (2025 WhatsApp + Multi-City Ready)

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import connectDB from "@/lib/db";

// Prevent static generation — this is a dynamic API
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name || user.username || "User",
      whatsapp: user.whatsapp || "",
      email: user.email || "",
      address: user.address || "",
      building: user.building || "",
      floor: user.floor || "",
      apartment: user.apartment || "",
      neighborhood: user.neighborhood || "",
      city: user.city || "",
      pincode: user.pincode || "",
      notes: user.notes || "",
      notifications: user.notifications ?? true,
      locationAccess: user.locationAccess ?? true,
    });
  } catch (error) {
    console.error("GET /api/user/profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Clean & validate WhatsApp
    let cleanWhatsapp = null;
    if (body.whatsapp) {
      cleanWhatsapp = body.whatsapp.replace(/\D/g, ""); // remove non-digits
      if (cleanWhatsapp.length < 9 || cleanWhatsapp.length > 15) {
        return NextResponse.json(
          { error: "Invalid WhatsApp number" },
          { status: 400 }
        );
      }
    }

    // Build safe updates — only allow these fields
    const updates = {
      name: body.name?.trim() || undefined,
      whatsapp: cleanWhatsapp,
      email: body.email?.trim().toLowerCase() || undefined,
      address: body.address?.trim() || undefined,
      building: body.building?.trim() || undefined,
      floor: body.floor?.trim() || undefined,
      apartment: body.apartment?.trim() || undefined,
      neighborhood: body.neighborhood?.trim() || undefined,
      city: body.city?.trim() || undefined,           // Free text — any city
      pincode: body.pincode?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
      notifications: body.notifications ?? true,
      locationAccess: body.locationAccess ?? true,
    };

    // Remove undefined fields so Mongo doesn't overwrite with undefined
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        name: updatedUser.name || updatedUser.username,
        whatsapp: updatedUser.whatsapp || "",
        email: updatedUser.email || "",
        address: updatedUser.address || "",
        building: updatedUser.building || "",
        floor: updatedUser.floor || "",
        apartment: updatedUser.apartment || "",
        neighborhood: updatedUser.neighborhood || "",
        city: updatedUser.city || "",
        pincode: updatedUser.pincode || "",
        notes: updatedUser.notes || "",
      },
    });
  } catch (error) {
    console.error("PUT /api/user/profile error:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}