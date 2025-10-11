// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ username: credentials.username });
        if (!user) throw new Error("Invalid username or password");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid username or password");

        return {
          id: user._id.toString(),
          username: user.username,
          role: user.role, // "user", "admin", "superadmin"
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    },
    async redirect({ url, baseUrl, token }) {
      if (token?.role) {
        switch (token.role) {
          case "superadmin":
            return `${baseUrl}/superadmin/dashboard`;
          case "admin":
            return `${baseUrl}/admin/dashboard`;
          case "user":
            return `${baseUrl}/user/home`;
          default:
            return baseUrl;
        }
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
