// //app/admin/role/[id]/page.js
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

// export default async function RolePage({ params }) {
//   const session = await getServerSession(authOptions);
//   const { id } = params;

//   // Access Logic: Only the user themselves OR an admin can see this specific ID
//   const isOwner = session?.user?.id === id;
//   const isAdmin = session?.user?.role === "admin" || session?.user?.role === "superadmin";

//   if (!isOwner && !isAdmin) {
//     redirect("/admin/login?error=AccessDenied");
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Staff Portal</h1>
//       <p className="text-gray-500 uppercase tracking-widest text-xs">Role: {session.user.role}</p>
      
//       {/* Your staff-specific tasks (Orders, Kitchen Queue, etc.) go here */}
//       <div className="mt-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
//         Welcome back, {session.user.name}.
//       </div>
//     </div>
//   );
// }// app/admin/role/[id]/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import StaffOrderView from "../components/StaffOrderView"; // Ensure this path is correct

export default async function RolePage({ params }) {
  const session = await getServerSession(authOptions);
  
  // 1. Check if session exists
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = params;

  // 2. Access Logic: User must be the owner of the ID OR a Super Admin
  const isOwner = session?.user?.id === id;
  const isSuperAdmin = session?.user?.role === "admin" || session?.user?.role === "superadmin";

  if (!isOwner && !isSuperAdmin) {
    redirect("/admin/login?error=AccessDenied");
  }

  return (
    <div className="min-h-screen bg-[#080b10]">
      {/* LUXURY STAFF HEADER */}
      <div className="p-6 border-b border-white/5 bg-[#0a0e16]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Staff <span className="font-serif italic text-gray-400">Portal</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-gray-500 uppercase tracking-[0.2em] text-[10px] font-black">
                {session.user.role} • {session.user.name}
              </p>
            </div>
            
          </div>
          
          {/* Mobile Quick Action: Sign Out for Staff */}
          <div className="lg:hidden">
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 text-[10px] font-bold">
               {session.user.name?.substring(0,2).toUpperCase()}
             </div>
          </div>
        </div>
      </div>

      {/* THE DYNAMIC ORDER LIST (Your Mobile-Friendly Luxury Version) */}
      <div className="relative z-10">
        <StaffOrderView />
      </div>

      {/* CUSTOM CSS FOR HIDING SCROLLBARS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}