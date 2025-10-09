"use client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Image from "next/image";

const popularItems = [
  { id: 1, name: "Margherita Pizza", price: 12.99, image: "/Images/pizza.png" },
  { id: 2, name: "Spaghetti Carbonara", price: 14.99, image: "/Images/pizza.png" },
  { id: 3, name: "Cheeseburger", price: 10.99, image: "/Images/burger.png" },
  { id: 4, name: "Caesar Salad", price: 8.99, image: "/Images/salad.png" },
  { id: 5, name: "Chocolate Cake", price: 6.99, image: "/Images/burger.png" },
  { id: 6, name: "Grilled Sandwich", price: 7.99, image: "/Images/salad.png" },
];

export default function PopularPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
          Top Trending Dishes
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-lg p-4 flex flex-col items-center hover:shadow-xl transition-all"
            >
              <div className="w-32 h-32 sm:w-36 sm:h-36 mb-4 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1 text-center">{item.name}</h3>
              <p className="text-orange-500 font-bold text-lg mb-3">${item.price.toFixed(2)}</p>
              <a
                href="https://wa.me/+918606746083"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
              >
                Order Now
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
