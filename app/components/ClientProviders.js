// components/ClientProviders.js   ← NEW FILE

"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/navbar";
import Footer from '../components/footer';

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <Navbar />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            fontSize: "14px",
            borderRadius: "12px",
            padding: "12px 16px",
          },
          success: { style: { background: "#10b981" } },
          error:   { style: { background: "#ef4444" } },
        }}
      />
      {/* <Footer/> */}
    </SessionProvider>
  );
}