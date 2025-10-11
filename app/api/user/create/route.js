// app/api/user/create/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User"; // Unified User model with roles
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { username, password, role } = await req.json();

    // Validate input
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: "Username, password, and role are required" },
        { status: 400 }
      );
    }

    // Optional: Validate role
    const allowedRoles = ["user", "admin", "superadmin"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    return NextResponse.json(
      { message: `${role} created successfully` },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
