//app/user/layout.js
// app/user/layout.js
import "../globals.css";
import ClientProviders from "../components/ClientProviders";

// You can keep metadata here; Next.js will merge it with the root metadata
export const metadata = {
  title: "Restaurant - Best Food",
  description: "Order delicious food fast with love",
};

export default function UserLayout({ children }) {
  return (
    <ClientProviders>
      {/* We use a div or main here instead of body/html */}
      <main className="min-h-screen flex flex-col">
        {children}
      </main>
    </ClientProviders>
  );
}