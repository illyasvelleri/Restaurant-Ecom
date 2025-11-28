// app/api/auth/[...nextauth]/route.js → FINAL & FLAWLESS

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
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ username: credentials.username });
        if (!user) return null;

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) return null;

        return {
          id: user._id.toString(),    // very important
          name: user.name || user.username,
          username: user.username,
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "user",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // First login
      if (user) {
        token.id = user.id;                   // IMPORTANT
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // Ensure user object exists
      if (!session.user) session.user = {};

      session.user.id = token.id;             // REQUIRED FOR DB UPDATE
      session.user.username = token.username;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.user.role = token.role;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
