"use client";
import Navbar from "../components/navbar"; // <-- import your navbar
import { User, Settings, LogOut, Heart, ShoppingCart } from "lucide-react";
import Footer from "../components/footer";

export default function ProfilePage() {
  const user = {
    name: "Illyas Velleri",
    email: "abc@gmail.com",
    phone: "+91 9876543210",
    avatar: "/Images/avatar.png", // replace with actual image
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-xl">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {user.name}
              </h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <p className="text-gray-600 mt-1">{user.phone}</p>
              <button className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all shadow-md">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a
              href="/orders"
              className="flex items-center gap-4 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl shadow-sm transition-all"
            >
              <ShoppingCart className="text-orange-500" size={24} />
              <span className="font-semibold text-gray-800">My Orders</span>
            </a>
            <a
              href="/favorites"
              className="flex items-center gap-4 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl shadow-sm transition-all"
            >
              <Heart className="text-orange-500" size={24} />
              <span className="font-semibold text-gray-800">Favorites</span>
            </a>
            <a
              href="/settings"
              className="flex items-center gap-4 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl shadow-sm transition-all"
            >
              <Settings className="text-orange-500" size={24} />
              <span className="font-semibold text-gray-800">Settings</span>
            </a>
            <button
              className="flex items-center gap-4 p-4 bg-red-50 hover:bg-red-100 rounded-xl shadow-sm transition-all w-full"
            >
              <LogOut className="text-red-500" size={24} />
              <span className="font-semibold text-red-600">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </section>
  );
}
