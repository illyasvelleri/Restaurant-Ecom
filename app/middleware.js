import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nexturl.pathname;

        // 1. ISOLATION: If an Admin visits /user/ routes, we don't redirect them, 
        // but we can pass a header or just let the layout handle the 'logged out' view.
        if (path.startsWith("/user") && token?.role !== "user") {
            // We allow them to view, but the UI will check the role and show 'Login' button
            return NextResponse.next();
        }

        // 2. PROTECTION: Prevent non-admins from hitting /admin
        if (path.startsWith("/admin") && token?.role === "user") {
            return NextResponse.redirect(new URL("/user/menu", req.url));
        }
    },
    {
        callbacks: {
            // Only require authentication for admin routes
            authorized: ({ token, req }) => {
                if (req.nextUrl.pathname.startsWith("/admin")) {
                    return !!token;
                }
                return true; // Allow public access to /user/menu
            },
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/user/:path*"],
};