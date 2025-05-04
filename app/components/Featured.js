"use client"
import { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeaturedProducts() {
  // State for products with quantity
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Burger Deluxe",
      description: "Angus beef, cheddar, caramelized onions, special sauce",
      price: "$12.00",
      img: "/Images/sandwich.jpg",
      rating: 4.8,
      reviews: 124,
      quantity: 0,
      featured: true,
      category: "Main Course"
    },
    {
      id: 2,
      name: "Salmon Sushi",
      description: "Fresh salmon, avocado, cucumber, premium rice",
      price: "$25.00",
      img: "/Images/sandwich.jpg",
      rating: 4.9,
      reviews: 87,
      quantity: 0,
      featured: true,
      category: "Sushi"
    },
    {
      id: 3,
      name: "French Fries",
      description: "Hand-cut potatoes, sea salt, house-made aioli",
      price: "$5.99",
      img: "/Images/sandwich.jpg",
      rating: 4.5,
      reviews: 210,
      quantity: 0,
      category: "Sides"
    },
    {
      id: 4,
      name: "Chicken Wrap",
      description: "Grilled chicken, fresh veggies, tahini sauce, warm pita",
      price: "$9.50",
      img: "/Images/sandwich.jpg",
      rating: 4.7,
      reviews: 95,
      quantity: 0,
      category: "Wraps"
    },
  ]);

  // Function to handle quantity changes
  const updateQuantity = (id, change) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const newQuantity = Math.max(0, product.quantity + change);
        return { ...product, quantity: newQuantity };
      }
      return product;
    }));
  };

  // Function to add to cart
  const addToCart = (id) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        return { ...product, quantity: product.quantity + 1 };
      }
      return product;
    }));
    // Here you would also add the item to the cart state/context
  };

  // For scrolling controls in mobile view
  const scrollContainer = (direction) => {
    const container = document.getElementById('featured-products-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-white to-orange-50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-orange-100 opacity-30"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-green-100 opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Popular Dishes <span className="text-orange-500">for you</span>
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Discover our most loved meals, handcrafted with premium ingredients and culinary excellence
            </p>
          </div>
          
          {/* Category Pills - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:flex items-center space-x-3 mt-6 md:mt-0">
            <button className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium shadow-sm">
              All
            </button>
            {['Main Course', 'Sushi', 'Sides', 'Desserts'].map((category) => (
              <button 
                key={category}
                className="px-4 py-2 bg-white hover:bg-orange-50 text-gray-700 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Scroll Controls */}
        <div className="md:hidden flex justify-end space-x-2 mb-4">
          <button 
            onClick={() => scrollContainer('left')}
            className="p-2 bg-white rounded-full shadow-md text-gray-700"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scrollContainer('right')}
            className="p-2 bg-white rounded-full shadow-md text-gray-700"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Products Grid/Scroll */}
        <div 
          id="featured-products-container"
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-72 md:w-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 288px, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={item.featured}
                />
                {/* Favorite Button */}
                <button 
                  className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white transition-all"
                  aria-label={`Add ${item.name} to favorites`}
                >
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                {/* Category Badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                  {item.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title and Rating */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-500 transition-colors">{item.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700 ml-1">{item.rating}</span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                {/* Price and Add to Cart Section */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">{item.price}</span>
                  
                  {item.quantity > 0 ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label={`Decrease quantity for ${item.name}`}
                      >
                        -
                      </button>
                      <span className="text-gray-800 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label={`Increase quantity for ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-medium transition-all shadow-sm"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <button className="px-6 py-3 bg-white border border-orange-300 hover:border-orange-500 text-orange-600 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-2">
            View All Popular Dishes
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}