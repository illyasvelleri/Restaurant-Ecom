// app/api/auth/[...nextauth]/route.js → FINAL & FLAWLESS (No Errors)

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        whatsapp: { label: "WhatsApp", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.password) return null;

        const { username, whatsapp, password } = credentials;

        // Need at least one identifier
        if (!username && !whatsapp) return null;

        await connectDB();

        // Build query: match username OR whatsapp
        const query = { $or: [] };
        if (username) {
          query.$or.push({ username: username.trim() });
        }
        if (whatsapp) {
          const cleanNumber = whatsapp.replace(/\D/g, ""); // remove non-digits
          query.$or.push({ whatsapp: cleanNumber });
        }

        const user = await User.findOne(query).select("+password");
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          username: user.username,
          name: user.name || user.username,
          whatsapp: user.whatsapp || "",
          email: user.email || "",
          role: user.role || "user",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.whatsapp = user.whatsapp;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.name = token.name || token.username;
        session.user.whatsapp = token.whatsapp;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };