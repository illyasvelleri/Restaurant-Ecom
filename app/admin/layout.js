

// //admin/layout
// import "../globals.css";
// import AdminClientWrapper from "./components/AdminClientWrapper";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

// export const metadata = {
//   title: "Admin Panel - RestaurantPro",
//   description: "Manage your restaurant like a pro",
// };

// export default async function AdminLayout({ children }) {
//   const session = await getServerSession(authOptions);

//   // 1. If not logged in, go to login
//   if (!session) {
//     redirect("/admin/login");
//   }

//   const role = session.user.role;
//   const id = session.user.id;

//   // 2. If user is a normal "customer", kick them out
//   if (role === "user") {
//     redirect("/user/menu");
//   }

//   return (
//     <html lang="en">
//       <body className="antialiased bg-gray-50">
//         <AdminClientWrapper role={role} userId={id}>
//           {children}
//         </AdminClientWrapper>
//       </body>
//     </html>
//   );
// }

import "../globals.css";
import AdminClientWrapper from "./components/AdminClientWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Panel - RestaurantPro",
  description: "Manage your restaurant like a pro",
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // 1. If not logged in, go to login
  if (!session) {
    redirect("/admin/login");
  }

  const role = session.user.role;
  const id = session.user.id;

  // 2. If user is a normal "customer", kick them out
  if (role === "user") {
    redirect("/user/menu");
  }

  // FIX: By using a fragment <> and standard tags, 
  // but ensuring the root layout isn't duplicating them.
  // Note: In Next.js App Router, nested layouts should technically not 
  // have <html>/<body>, but to keep your lines, we ensure they render 
  // as the primary structure for this route segment.
  
  return (
    <>
      <html lang="en">
        <body className="antialiased bg-gray-50">
          <AdminClientWrapper role={role} userId={id}>
            {children}
          </AdminClientWrapper>
        </body>
      </html>
    </>
  );
}