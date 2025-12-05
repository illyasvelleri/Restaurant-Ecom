// app/api/auth/register/route.js → WhatsApp Version (2025 Ready)

import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { username, whatsapp, password } = await req.json();

    // Required: username & password
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        { status: 400 }
      );
    }

    // Optional: clean WhatsApp number (remove spaces, dashes, etc.)
    const cleanWhatsapp = whatsapp ? whatsapp.replace(/\D/g, "") : null;

    // Prevent duplicate username OR WhatsApp number
    const existingUser = await User.findOne({
      $or: [
        { username },
        ...(cleanWhatsapp ? [{ whatsapp: cleanWhatsapp }] : []), // only check if provided
      ],
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Username or WhatsApp number already registered" }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      username,
      whatsapp: cleanWhatsapp,     // save clean number (e.g. "966501234567")
      password: hashedPassword,
      role: "user",
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account created successfully",
        user: { username: user.username, whatsapp: user.whatsapp },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return new Response(
      JSON.stringify({ error: "Server error, please try again" }),
      { status: 500 }
    );
  }
}