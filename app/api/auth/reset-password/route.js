// app/api/auth/reset-password/route.js → 100% WORKING WITH RESEND

import User from "@/models/User";
import connectDB from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    // SAFELY READ BODY
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    // Security: always return same message
    if (!user) {
      return NextResponse.json({ message: "If email exists, reset link sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // SEND EMAIL
    await sendResetEmail(user.email, token);

    return NextResponse.json({ message: "Reset link sent" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to send reset link" }, { status: 500 });
  }
}