// app/user/popular/page.js → PREMIUM REDESIGN 2025


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, ShoppingBag } from "lucide-react";


export default function PopularPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [currency, setCurrency] = useState("SAR");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [popularRes, settingsRes] = await Promise.all([
          fetch("/api/user/popular"),
          fetch("/api/restaurantDetails")
        ]);

        if (popularRes.ok) {
          const data = await popularRes.json();
          setPopularItems(Array.isArray(data) ? data.map(p => p.product) : []);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setCurrency(settings.currency || "SAR");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { setCart([]); }
    }
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      // LOCK IN THE PRICE: Use currentPrice if it exists, otherwise use original price
      const priceToCharge = item.currentPrice || item.price;

      const newCart = exists
        ? prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, price: priceToCharge, quantity: 1 }];

      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
    toast.success("Added to order", {
      style: { borderRadius: "24px", background: "#111", color: "#fff" },
    });
  };

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-light text-gray-400 tracking-[0.3em] animate-pulse">PREPARING...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Header - Large Light Typography */}
        <div className="max-w-7xl mx-auto px-4 mb-16 md:mb-24">
          <div className="inline-block bg-gray-900 text-white text-[10px] font-black tracking-[0.3em] px-4 py-1.5 mb-6 uppercase">
            Curated
          </div>
          <h1 className="text-5xl md:text-8xl font-light text-gray-900 tracking-tighter leading-[0.9] mb-6">
            Most Loved <br /> <span className="text-gray-300">Dishes</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-500 font-light max-w-2xl">
            A collection of our most requested flavors and guest favorites.
          </p>
        </div>

        {/* Grid - 1 Col on Mobile, 2 Col on Desktop for Row Style Cards */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            {popularItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PremiumFoodCard dish={item} onAdd={addToCart} currency={currency} />
              </motion.div>
            ))}
          </div>

          {popularItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400 font-light italic">Currently updating our favorites...</p>
            </div>
          )}
        </div>

        {/* Floating Cart Button */}
        {/* Floating Cart Button – Orangish version with better contrast */}
        {cartCount > 0 && (
          <button
            onClick={() => router.push('/user/cart')}
            className="fixed bottom-28 right-6 z-50 bg-gradient-to-br from-amber-600 to-orange-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full hover:from-amber-500 hover:to-orange-500 transition-all duration-300 flex items-center justify-center shadow-2xl shadow-amber-900/40 active:scale-95"
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border-2 border-white shadow-md">
              {cartCount}
            </span>
          </button>
        )}
      </div>

    </>
  );
}

// THE REDESIGNED HORIZONTAL CARD - UPDATED WITH DYNAMIC PRICING
function PremiumFoodCard({ dish, onAdd, currency = "SAR" }) {
  // Logic to determine if price has changed
  const displayPrice = dish.currentPrice || dish.price;
  const isDiscounted = dish.isDynamic && Number(displayPrice) < Number(dish.price);
  const isSurged = dish.isDynamic && Number(displayPrice) > Number(dish.price);

  return (
    <div className="group bg-white border border-gray-100 rounded-[3rem] p-3 md:p-5 flex items-center gap-6 md:gap-10 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-500 min-h-[160px] md:min-h-[220px]">

      {/* COLUMN 1: WIDE IMAGE */}
      <div className="relative h-32 w-32 md:h-48 md:w-56 flex-shrink-0 overflow-hidden rounded-[2.2rem] bg-gray-50">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 150px, 400px"
          />
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-4xl">🍽️</div>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Dynamic Badge */}
          {dish.isDynamic && (
            <div className={`px-3 py-1 rounded-full shadow-sm backdrop-blur-md border border-white/20 ${isDiscounted ? 'bg-green-600/90' : 'bg-orange-600/90'}`}>
              <span className="text-[8px] font-bold uppercase tracking-widest text-white">
                {dish.activeRuleName || (isDiscounted ? 'Offer' : 'Trending')}
              </span>
            </div>
          )}
          {/* Original Popular Badge (Only if not showing a dynamic rule) */}
          {!dish.isDynamic && (
            <div className="px-3 py-1 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full shadow-sm">
              <span className="text-[10px] font-medium uppercase tracking-widest text-gray-900">Popular</span>
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 2: CONTENT - START ALIGNED */}
      <div className="flex flex-col justify-between flex-grow min-w-0 h-full py-2">
        <div className="text-left">
          <h3 className="text-xl md:text-3xl font-light text-gray-900 mb-2 md:mb-3 line-clamp-1 leading-tight tracking-tight">
            {dish.name}
          </h3>
          {dish.description && (
            <p className="text-sm md:text-lg text-gray-500 font-light line-clamp-2 md:line-clamp-3 leading-relaxed">
              {dish.description}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col text-left">
            <span className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-[0.2em] mb-1">
              {isDiscounted ? 'Special Price' : 'Price'}
            </span>
            <div className="flex items-baseline gap-1 md:gap-2">
              <span className="text-2xl md:text-4xl font-medium text-gray-900 leading-none tracking-tighter">
                {displayPrice}
              </span>
              <span className="text-xs md:text-lg font-light text-gray-400 mr-2">
                {currency}
              </span>
              {/* Show original price with strikethrough if dynamic */}
              {dish.isDynamic && Number(displayPrice) !== Number(dish.price) && (
                <span className="text-xs md:text-sm text-gray-300 line-through">
                  {dish.price}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onAdd(dish);
            }}
            className="h-14 w-14 md:h-16 md:w-16 bg-gray-900 text-white rounded-[1.8rem] flex items-center justify-center hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
          >
            <Plus size={28} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
