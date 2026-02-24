// //app/admin/login
// "use client";

// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await signIn("credentials", {
//       redirect: false,
//       username,
//       password,
//     });

//     if (res.error) {
//       setError(res.error);
//     } else {
//       setError("");
//       router.push("/admin/dashboard"); // NextAuth redirect will take over
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
//       <h2 className="text-2xl font-bold mb-4">Login</h2>
//       {error && <p className="text-red-600 mb-2">{error}</p>}
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="p-2 border rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="p-2 border rounded"
//           required
//         />
//         <button type="submit" className="p-2 bg-blue-600 text-white rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react"; // Added getSession
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res.error) {
      setError("Invalid credentials");
    } else {
      setError("");
      // Fetch the session to see the role
      const session = await getSession();
      const role = session?.user?.role;
      const id = session?.user?.id;

      if (role === "admin" || role === "superadmin") {
        router.push("/admin/dashboard");
      } else if (role !== "user") {
        // Redirect non-normal users (staff, kitchen, etc.) to their specific role page
        router.push(`/admin/role/${id}`);
      } else {
        router.push("/user/menu"); // Normal users go to menu
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-black">Admin Login</h2>
      {error && <p className="text-red-600 mb-2 font-medium">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded text-black"
          required
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded font-bold">
          Verify Identity
        </button>
      </form>
    </div>
  );
}