// "use client";
// import { useState } from "react";
// import { Search, ShoppingCart, Menu, X } from "lucide-react";

// export default function HeroSection() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <section className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
//       {/* Navigation Bar */}
//       <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center space-x-2 z-50">
//             <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
//               <span className="text-white font-bold text-xl">HN</span>
//             </div>
//             <span className="text-xl sm:text-2xl font-bold text-gray-900">Hungry Naki</span>
//           </div>

//           {/* Desktop Nav Links */}
//           <div className="hidden lg:flex items-center space-x-12">
//             <a href="#" className="text-gray-900 font-medium hover:text-orange-500 transition-colors relative group">
//               Home
//               <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
//             </a>
//             <a href="#" className="text-gray-600 font-medium hover:text-orange-500 transition-colors">Menu</a>
//             <a href="#" className="text-gray-600 font-medium hover:text-orange-500 transition-colors">Service</a>
//             <a href="#" className="text-gray-600 font-medium hover:text-orange-500 transition-colors">Shop</a>
//           </div>

//           {/* Search and Cart */}
//           <div className="flex items-center space-x-3 sm:space-x-4">
//             <button className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-orange-300 transition-all group">
//               <Search className="text-gray-400 group-hover:text-orange-500 transition-colors" size={18} />
//               <span className="text-gray-400 text-sm">Search...</span>
//             </button>

//             <button className="relative p-2 sm:p-2.5 rounded-full bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all group">
//               <ShoppingCart className="text-gray-600 group-hover:text-orange-500 transition-colors" size={20} />
//               <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">3</span>
//             </button>

//             {/* Mobile menu button */}
//             <button 
//               className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 z-40 border-t">
//             <div className="flex flex-col space-y-4">
//               <a href="#" className="text-gray-900 font-medium py-2">Home</a>
//               <a href="#" className="text-gray-600 font-medium py-2">Menu</a>
//               <a href="#" className="text-gray-600 font-medium py-2">Service</a>
//               <a href="#" className="text-gray-600 font-medium py-2">Shop</a>
//               <div className="pt-2">
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Hero Content */}
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
//         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//           {/* Left Column */}
//           <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
//             <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
//               🔥 #1 Food Delivery Service
//             </div>

//             <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
//               It's not just{" "}
//               <span className="text-orange-500 relative inline-block">
//                 Food
//                 <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
//                   <path d="M2 10C40 4 160 4 198 10" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
//                 </svg>
//               </span>
//               <br />
//               It's an Experience
//             </h1>

//             <p className="text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed">
//               Discover culinary excellence delivered to your doorstep. Fast, fresh, and flavorful meals from your favorite restaurants.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 pt-4">
//               <button className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
//                 Order Now
//               </button>
//               <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all">
//                 View Menu
//               </button>
//             </div>

//             {/* Stats/Social Proof */}
//             <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-6 sm:pt-8">
//               <div className="flex items-center space-x-3">
//                 <div className="flex -space-x-3">
//                   {[1, 2, 3, 4].map((i) => (
//                     <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-white font-semibold">
//                       {i === 4 ? "+" : ""}
//                     </div>
//                   ))}
//                 </div>
//                 <div>
//                   <p className="text-gray-900 font-bold text-sm sm:text-base">2,500+</p>
//                   <p className="text-gray-500 text-xs sm:text-sm">Happy Customers</p>
//                 </div>
//               </div>

//               <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>

//               <div>
//                 <div className="flex items-center space-x-1 mb-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <span key={star} className="text-yellow-400 text-lg">★</span>
//                   ))}
//                 </div>
//                 <p className="text-gray-900 font-bold text-sm sm:text-base">4.9 Rating</p>
//                 <p className="text-gray-500 text-xs sm:text-sm">From 1,200+ reviews</p>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Hero Image */}
//           <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
//             <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
//               {/* Background Decorative Circle */}
//               <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-transparent rounded-full transform scale-110 blur-3xl opacity-60"></div>

//               {/* Main Food Image Container */}
//               <div className="relative w-full h-full flex items-center justify-center">
//                 <div className="w-4/5 h-4/5 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden">
//                   <div className="text-6xl">🍜</div>
//                 </div>
//               </div>

//               {/* Floating Food Cards */}
//               <div className="absolute top-8 -left-4 sm:left-0 bg-white p-3 sm:p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">
//                 <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-2xl sm:text-3xl">
//                   🍕
//                 </div>
//                 <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
//                   <ShoppingCart size={16} className="text-white" />
//                 </div>
//               </div>

//               <div className="absolute bottom-12 -left-8 sm:left-0 bg-white p-3 sm:p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">
//                 <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-2xl sm:text-3xl">
//                   🥗
//                 </div>
//                 <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
//                   <ShoppingCart size={16} className="text-white" />
//                 </div>
//               </div>

//               <div className="absolute top-1/3 -right-4 sm:right-0 bg-white p-3 sm:p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">
//                 <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center text-2xl sm:text-3xl">
//                   🍔
//                 </div>
//                 <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
//                   <ShoppingCart size={16} className="text-white" />
//                 </div>
//               </div>

//               {/* Decorative Elements */}
//               <div className="absolute bottom-4 right-8 w-16 h-16 bg-orange-200 rounded-full blur-xl opacity-60 animate-pulse"></div>
//               <div className="absolute top-12 right-4 w-20 h-20 bg-orange-300 rounded-full blur-2xl opacity-40 animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Wave Decoration */}
//       <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
//         <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 120" fill="none">
//           <path d="M0,64 C320,96 640,96 960,64 C1280,32 1440,32 1440,64 L1440,120 L0,120 Z" fill="rgba(249, 115, 22, 0.05)"/>
//         </svg>
//       </div>
//     </section>
//   );
// }



"use client";
import { useState } from "react";
import { Search, ShoppingCart, Star, TrendingUp, Clock, Users } from "lucide-react";
import Navbar from "../components/navbar"; // Imported Navbar component

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 text-orange-600 rounded-full text-sm font-semibold shadow-sm">
              <TrendingUp size={16} className="mr-2" />
              #1 Food Delivery Service
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight">
              Fresh{" "}
              <span className="text-orange-500 relative inline-block">
                Food
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C40 4 160 4 198 10" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              ,<br />
              Fast{" "}
              <span className="text-orange-500 relative inline-block">
                Delivery
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C40 4 160 4 198 10" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl leading-relaxed">
              Discover culinary excellence delivered to your doorstep. Experience fresh, flavorful meals from your favorite restaurants in minutes.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Star className="text-orange-500 fill-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">4.9 Rating</p>
                  <p className="text-xs text-gray-500">2.5K+ Reviews</p>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">5000+ Users</p>
                  <p className="text-xs text-gray-500">Active Daily</p>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">15-30 Min</p>
                  <p className="text-xs text-gray-500">Delivery Time</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              {/* Order Now Button → WhatsApp */}
              <a
                href="https://wa.me/918606746083"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base sm:text-lg text-center"
              >
                Order Now
              </a>

              {/* View Menu Button → Menu Page */}
              <a
                href="/menu"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all text-base sm:text-lg text-center"
              >
                View Menu
              </a>
            </div>

          </div>

          {/* Right Column - Hero Image */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-orange-100 to-transparent rounded-full transform scale-110 blur-3xl opacity-40 animate-pulse"></div>
              <div className="relative w-full h-full flex items-center justify-center z-10">
                <div className="relative w-4/5 h-4/5">
                  <img
                    src="/Images/hero-image-01.png"
                    alt="Delicious food delivery"
                    className="w-full h-full object-cover rounded-full shadow-2xl border-8 border-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 120" fill="none">
          <path d="M0,64 C320,96 640,96 960,64 C1280,32 1440,32 1440,64 L1440,120 L0,120 Z" fill="rgba(249, 115, 22, 0.05)" />
        </svg>
      </div>
    </section>
  );
}


// "use client";
// import Navbar from "../components/navbar";
// import Image from "next/image";

// export default function HeroSection() {
//   return (
//     <section className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
//       {/* Navbar */}
//       <Navbar />

//       {/* Hero Content */}
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left Column */}
//           <div className="space-y-6 sm:space-y-8">
//             <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
//               🔥 #1 Food Delivery Service
//             </span>

//             <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
//               Fresh <span className="text-orange-500">Food</span>,
//               Fast <span className="text-orange-500">Delivery</span>
//             </h1>

//             <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
//               Discover culinary excellence delivered to your doorstep. Fast,
//               fresh, and flavorful meals from your favorite restaurants.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 pt-4">
//               <button className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
//                 Order Now
//               </button>
//               <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all">
//                 View Menu
//               </button>
//             </div>
//           </div>

//           {/* Right Column - Hero Image */}
//           <div className="relative flex justify-center lg:justify-end">
//             <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
//               <Image
//                 src="/Images/hero-image-01.png"
//                 alt="Delicious food delivery"
//                 fill
//                 className="object-cover rounded-full shadow-2xl border-8 border-white"
//                 priority
//               />

//               {/* Floating Food Images */}
//               <Image
//                 src="/Images/pizza.png"
//                 alt="Pizza"
//                 width={96}
//                 height={96}
//                 className="absolute top-6 -left-6 object-cover rounded-2xl shadow-xl hover:-translate-y-1 transition-transform"
//               />
//               <Image
//                 src="/Images/salad.png"
//                 alt="Salad"
//                 width={96}
//                 height={96}
//                 className="absolute bottom-8 -left-8 object-cover rounded-2xl shadow-xl hover:-translate-y-1 transition-transform"
//               />
//               <Image
//                 src="/Images/burger.png"
//                 alt="Burger"
//                 width={96}
//                 height={96}
//                 className="absolute top-1/3 -right-8 object-cover rounded-2xl shadow-xl hover:-translate-y-1 transition-transform"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Wave Decoration */}
//       <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
//         <svg
//           className="absolute bottom-0 w-full h-full"
//           preserveAspectRatio="none"
//           viewBox="0 0 1440 120"
//           fill="none"
//         >
//           <path
//             d="M0,64 C320,96 640,96 960,64 C1280,32 1440,32 1440,64 L1440,120 L0,120 Z"
//             fill="rgba(249, 115, 22, 0.05)"
//           />
//         </svg>
//       </div>
//     </section>
//   );
// }
