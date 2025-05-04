// components/CategoryFilters.js
"use client";
import React, { useState } from "react";

export default function CategoryFilters() {
  const categories = ["All", "Breakfast", "Lunch", "Dinner"];
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="flex gap-2 overflow-x-auto px-4 md:px-12 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
            ${
              activeCategory === category
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-red-100"
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
