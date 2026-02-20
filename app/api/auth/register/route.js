// // app/api/auth/register/route.js → WhatsApp Version (2025 Ready)

// import connectDB from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { username, whatsapp, password } = await req.json();

//     // Required: username & password
//     if (!username || !password) {
//       return new Response(
//         JSON.stringify({ error: "Username and password are required" }),
//         { status: 400 }
//       );
//     }

//     // Optional: clean WhatsApp number (remove spaces, dashes, etc.)
//     const cleanWhatsapp = whatsapp ? whatsapp.replace(/\D/g, "") : null;

//     // Prevent duplicate username OR WhatsApp number
//     const existingUser = await User.findOne({
//       $or: [
//         { username },
//         ...(cleanWhatsapp ? [{ whatsapp: cleanWhatsapp }] : []), // only check if provided
//       ],
//     });

//     if (existingUser) {
//       return new Response(
//         JSON.stringify({ error: "Username or WhatsApp number already registered" }),
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const user = await User.create({
//       username,
//       whatsapp: cleanWhatsapp,     // save clean number (e.g. "966501234567")
//       password: hashedPassword,
//       role: "user",
//     });

//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Account created successfully",
//         user: { username: user.username, whatsapp: user.whatsapp },
//       }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Register error:", error);
//     return new Response(
//       JSON.stringify({ error: "Server error, please try again" }),
//       { status: 500 }
//     );
//   }
// }


import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { username, whatsapp, password } = await req.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username and password are required" }), { status: 400 });
    }

    const trimmedUsername = username.trim();
    const cleanWhatsapp = (whatsapp && whatsapp.trim() !== "") ? whatsapp.replace(/\D/g, "") : undefined;

    // 1. Check for Duplicate Username
    const existingUsername = await User.findOne({ username: trimmedUsername });
    if (existingUsername) {
      return new Response(
        JSON.stringify({ error: "This username is already taken" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Check for Duplicate WhatsApp (only if provided)
    if (cleanWhatsapp) {
      const existingWhatsapp = await User.findOne({ whatsapp: cleanWhatsapp });
      if (existingWhatsapp) {
        return new Response(
          JSON.stringify({ error: "This WhatsApp number is already registered" }), 
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create User
    const userData = {
      username: trimmedUsername,
      password: hashedPassword,
      role: "user",
    };
    if (cleanWhatsapp) userData.whatsapp = cleanWhatsapp;

    await User.create(userData);

    return new Response(
      JSON.stringify({ success: true, message: "Membership Confirmed" }), 
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Register error:", error);
    // Final safety check for MongoDB unique index errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return new Response(
        JSON.stringify({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` }),
        { status: 400 }
      );
    }
    return new Response(JSON.stringify({ error: "Server error, please try again" }), { status: 500 });
  }
}

// import connectDB from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { username, whatsapp, password } = await req.json();

//     // 1. Minimum Requirements
//     if (!username || !password) {
//       return new Response(
//         JSON.stringify({ error: "Please provide both identity and a secure password." }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // 2. Clean WhatsApp Logic
//     // We trim and remove non-digits. If empty, we set it to undefined so Mongoose 'sparse' works.
//     const cleanWhatsapp = (whatsapp && whatsapp.trim() !== "") 
//       ? whatsapp.replace(/\D/g, "") 
//       : undefined;

//     // 3. Smart Conflict Detection
//     // We check both fields. This allows us to tell the user EXACTLY what is wrong.
//     const [existingUsername, existingWhatsapp] = await Promise.all([
//       User.findOne({ username: username.trim() }),
//       cleanWhatsapp ? User.findOne({ whatsapp: cleanWhatsapp }) : null
//     ]);

//     if (existingUsername) {
//       return new Response(
//         JSON.stringify({ error: "This username is already claimed by another member." }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     if (existingWhatsapp) {
//       return new Response(
//         JSON.stringify({ error: "This WhatsApp number is already linked to an account." }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // 4. Secure Password Hashing
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // 5. User Creation
//     // Note: We use an object spread to only include whatsapp if it exists.
//     // This avoids regex 'match' errors on null/empty values in your User model.
//     const newUser = await User.create({
//       username: username.trim(),
//       password: hashedPassword,
//       role: "user",
//       ...(cleanWhatsapp && { whatsapp: cleanWhatsapp })
//     });

//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Your elite identity has been created.",
//         user: { username: newUser.username }
//       }),
//       { status: 201, headers: { "Content-Type": "application/json" } }
//     );

//   } catch (error) {
//     console.error("Maison Registration Error:", error);

//     // Catch Mongoose Validation errors (like the regex in your model)
//     if (error.name === 'ValidationError') {
//       const message = Object.values(error.errors)[0].message;
//       return new Response(JSON.stringify({ error: message }), { status: 400 });
//     }

//     return new Response(
//       JSON.stringify({ error: "Our systems are currently busy. Please try again." }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }