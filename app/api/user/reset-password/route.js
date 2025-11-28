// app/api/auth/reset-password/route.js

import User from "@/models/User";
import connectDB from "@/lib/db";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email"; // Optional: create this

export async function POST(req) {
  await connectDB();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "Email not found" }), { status: 404 });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetTokenExpiry;
  await user.save();

  // Send email (you can use Resend, Nodemailer, etc.)
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/new-password?token=${resetToken}`;
  
  // Example using console (replace with real email later)
  console.log("Reset Link (send this via email):", resetUrl);

  return Response.json({ success: true, message: "Reset link sent!" });
}