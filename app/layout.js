// //app/layout.js

// import "./globals.css";
// import { Inter } from "next/font/google";
// import ClientProviders from "./components/ClientProviders";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Indulge - Best Food in Saudi",
//   description: "Order delicious food fast with love",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.variable} antialiased`}>
//         <ClientProviders>
//           <main>{children}</main>
//         </ClientProviders>
//       </body>
//     </html>
//   );
// }



// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from './components/footer';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "My restaurant - Best Food",
  description: "Order delicious food fast with love",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 1. Navbar must be inside body */}
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        
        {/* 2. Main content takes up available space */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 3. Footer must be inside body */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}