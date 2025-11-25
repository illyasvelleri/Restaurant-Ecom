import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";  // ← your original working imports
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Restaurant Admin",
  description: "Manage your restaurant menu & inventory",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* ← Only new thing: beautiful toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "8px",
            },
            success: { style: { background: "#10b981" } },
            error:   { style: { background: "#ef4444" } },
          }}
        />
      </body>
    </html>
  );
}