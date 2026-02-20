import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const whatsapp = searchParams.get("whatsapp");

    // Check Username
    if (username) {
      const exists = await User.findOne({ username: username.trim() });
      return Response.json({ available: !exists });
    }

    // Check WhatsApp
    if (whatsapp) {
      const cleanWhatsapp = whatsapp.replace(/\D/g, "");
      // If the field is too short, don't even check, just say it's "available" (not a conflict yet)
      if (cleanWhatsapp.length < 9) return Response.json({ available: true });
      
      const exists = await User.findOne({ whatsapp: cleanWhatsapp });
      return Response.json({ available: !exists });
    }

    return Response.json({ error: "Invalid query" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}