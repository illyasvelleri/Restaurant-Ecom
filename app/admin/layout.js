// /app/admin/layout.js
import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
  

      {/* Main Content */}
      <main className="">{children}</main>
    </div>
  );
}
