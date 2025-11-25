// components/FeaturedProducts.tsx  ← FINAL & BEAUTIFUL (SAME AS MENU CARDS)

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch('/api/user/popular');
        if (res.ok) {
          const data = await res.json();
          const items = data.map(item => ({
            ...item.product,
            quantity: 0,
            featured: true
          }));
          setProducts(items);
        } else {
          toast.error("Failed to load popular dishes");
        }
      } catch (err) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addToCart = (item) => {
    // In real app: add to global cart
    toast.success(`${item.name} added to cart!`);
  };

  const scrollContainer = (direction) => {
    const container = document.getElementById('featured-scroll');
    if (container) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto px-6 text-center">
          <div className="text-3xl font-bold text-orange-600">Loading Popular Dishes...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Popular Dishes <span className="text-orange-500">Right Now</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These are the dishes everyone is loving — fresh, hot, and ready for you!
          </p>
        </div>

        {/* Mobile Scroll Buttons */}
        <div className="md:hidden flex justify-end mb-6 space-x-3">
          <button onClick={() => scrollContainer('left')} className="p-3 bg-white rounded-full shadow-lg">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => scrollContainer('right')} className="p-3 bg-white rounded-full shadow-lg">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Cards Grid / Scroll */}
        <div 
          id="featured-scroll"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((item) => (
            <div 
              key={item._id} 
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={180}
                    height={180}
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
                )}

                {/* Popular Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                  Popular
                </div>

                {/* Favorite Heart */}
                <button
                  onClick={() => toggleFavorite(item._id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart
                    size={18}
                    className={favorites.includes(item._id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {item.description || "Customer favorite"}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{item.rating || 4.8}</span>
                  <span className="text-sm text-gray-400">({item.reviews || 200}+)</span>
                </div>

                {/* Price + Add Button */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">{item.price} SAR</div>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a 
            href="/user/popular"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-full hover:shadow-xl transition-all hover:scale-105"
          >
            View All Popular Dishes
            <ChevronRight size={24} />
          </a>
        </div>
      </div>
    </section>
  );
}