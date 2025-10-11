import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) return new Response("Not logged in", { status: 401 });

  if (session.user.role !== "admin") {
    return new Response("Access denied", { status: 403 });
  }

  return new Response("Welcome Admin!", { status: 200 });
}
