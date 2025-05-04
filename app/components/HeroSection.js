"use client";
import { useState } from "react";
import { Search, ChevronRight, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  const categories = [
    { name: "Pizza", icon: "🍕" },
    { name: "Burgers", icon: "🍔" },
    { name: "Sushi", icon: "🍣" },
    { name: "Salads", icon: "🥗" },
    { name: "Desserts", icon: "🍰" }
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Banner Container - You'll replace the placeholder with your custom banner */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-100 rounded-bl-[80px] md:block hidden opacity-70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Text + Search */}
          <div className="space-y-6 max-w-lg">
            <div className="inline-block px-4 py-1 bg-orange-100 rounded-full text-orange-600 font-medium text-sm mb-2">
              Hungry? We've got you covered
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Discover Delicious Meals Delivered To Your Door
            </h1>

            <p className="text-lg text-gray-600">
              From local favorites to gourmet experiences, find the perfect meal for any craving, ready to be delivered in minutes.
            </p>

            {/* Search Bar */}
            <div className="relative mt-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for dishes, cuisines, or restaurants..."
                  className="w-full p-4 pl-5 pr-14 rounded-full border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-gray-700"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-all">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Quick Categories */}
            <div className="flex flex-wrap gap-3 mt-6">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-800 hover:text-orange-600"
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Dishes or Offers */}
          <div className="hidden md:block relative h-96">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Today's Special</h3>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`w-2 h-2 rounded-full ${activeSlide === i ? "bg-orange-500" : "bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Featured Item - Replace placeholder with your actual featured item */}
              <div className="rounded-xl overflow-hidden mb-4">
                <img
                  src="/Images/banner.jpg"
                  alt="Featured dish"
                  className="w-full h-44 object-cover"
                />
              </div>

              <h4 className="font-medium text-xl mb-2">Signature Pasta</h4>
              <p className="text-gray-500 mb-4">Fresh homemade pasta with our chef's special sauce</p>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-orange-600">$18.99</span>
                <button className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-all">
                  Order Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}