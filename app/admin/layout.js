// app/admin/layout.js → FINAL 2025 LUXURY ADMIN LAYOUT

import Sidebar from "./components/Sidebar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Panel - RestaurantPro",
  description: "Manage your restaurant like a pro",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div className="flex min-h-screen">
          {/* LUXURY ADMIN SIDEBAR */}
          <Sidebar />

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 lg:ml-0">
            {/* Optional: Top bar if you want */}
            <header className="bg-white border-b border-gray-200 px-8 py-5 hidden lg:block">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Welcome back, Admin</span>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                </div>
              </div>
            </header>

            {/* PAGE CONTENT */}
            <main className="p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}