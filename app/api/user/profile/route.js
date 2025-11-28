// app/api/user/profile/route.js → FIXED FOREVER (USE NextResponse!)

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";   // ← THIS LINE WAS MISSING OR WRONG

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findById(session.user.id).lean(); // .lean() = faster

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name || user.username,
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      building: user.building || "",
      floor: user.floor || "",
      apartment: user.apartment || "",
      pincode: user.pincode || "",
      neighborhood: user.neighborhood || "",
      city: user.city || "Riyadh",
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const updates = {
    ...(body.name?.trim() && { name: body.name.trim() }),
    ...(body.email?.trim() && { email: body.email.trim().toLowerCase() }),
    ...(body.phone?.trim() && { phone: body.phone.trim() }),
    ...(body.address?.trim() && { address: body.address.trim() }),
    ...(body.building?.trim() && { building: body.building.trim() }),
    ...(body.floor?.trim() && { floor: body.floor.trim() }),
    ...(body.apartment?.trim() && { apartment: body.apartment.trim() }),
    ...(body.pincode?.trim() && { pincode: body.pincode.trim() }),
    ...(body.neighborhood?.trim() && { neighborhood: body.neighborhood.trim() }),
    city: body.city?.trim() || "Riyadh",
    notifications: true,
    locationAccess: true,
  };

  try {
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true, strict: false }
    ).lean();

    return NextResponse.json({
      success: true,
      message: "Saved successfully",
      user: {
        name: updatedUser.name || updatedUser.username,
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        building: updatedUser.building || "",
        floor: updatedUser.floor || "",
        apartment: updatedUser.apartment || "",
        pincode: updatedUser.pincode || "",
        neighborhood: updatedUser.neighborhood || "",
        city: updatedUser.city || "Riyadh",
      },
    });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}