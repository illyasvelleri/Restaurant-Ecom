import "../globals.css";
import { Inter } from "next/font/google";
import ClientProviders from "../components/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Indulge - Best Food in Saudi",
  description: "Order delicious food fast with love",
};

export default function UserLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ClientProviders>
          <main>{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
