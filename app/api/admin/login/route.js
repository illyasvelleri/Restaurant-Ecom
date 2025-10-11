// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import Admin from "@/models/Admin";
// import { connectDB } from "@/lib/db";

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Admin",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectDB();

//         const admin = await Admin.findOne({ username: credentials.username });
//         if (!admin) throw new Error("Invalid username or password");

//         const isValid = await bcrypt.compare(credentials.password, admin.password);
//         if (!isValid) throw new Error("Invalid username or password");

//         return { id: admin._id.toString(), username: admin.username };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.username = user.username;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.username = token.username;
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/admin/login",
//     error: "/admin/login",
//   },
// });