
//admin/layout
import "../globals.css";
import { Inter } from "next/font/google";
import AdminClientWrapper from "./components/AdminClientWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Panel - RestaurantPro",
  description: "Manage your restaurant like a pro",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-gray-50`}>
        <AdminClientWrapper>
          {children}
        </AdminClientWrapper>
      </body>
    </html>
  );
}
