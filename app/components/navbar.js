"use client";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/images/logo.png"
            alt="Hungry Naki"
            className="w-10 h-10 rounded-xl shadow-md"
          />
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            Indulge
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-12">
          {["Home", "Menu", "Service", "Shop"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-gray-700 font-medium hover:text-orange-500 transition-colors relative group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Search Bar */}
          <div className="hidden sm:flex items-center px-4 py-2 rounded-full bg-white border border-gray-200">
            <input
              type="text"
              placeholder="Search..."
              className="outline-none text-gray-500 text-sm w-32 sm:w-48"
            />
          </div>

          {/* Cart */}
          <button className="relative px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-all">
            Cart (3)
          </button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="text-gray-800 font-bold text-lg">
              {mobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 border-t">
          <div className="flex flex-col space-y-4">
            {["Home", "Menu", "Service", "Shop"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 font-medium py-2"
              >
                {item}
              </a>
            ))}
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
