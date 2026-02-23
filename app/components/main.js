"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ChevronRight, Plus, ShoppingBag } from "lucide-react";

export default function MainContent() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [specialDishes, setSpecialDishes] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [currency, setCurrency] = useState("SAR");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [specialRes, popularRes, settingsRes] = await Promise.all([
          fetch("/api/user/products"),
          fetch("/api/user/popular"),
          fetch("/api/restaurantDetails"),
        ]);

        if (specialRes.ok) {
          const all = await specialRes.json();
          const active = all.filter((p) => p.status === "active");
          setSpecialDishes(active.sort(() => Math.random() - 0.5).slice(0, 8));
        }

        if (popularRes.ok) {
          const data = await popularRes.json();
          const items = Array.isArray(data)
            ? data.filter(d => d.product).map((d) => d.product).slice(0, 4)
            : [];
          setPopularDishes(items);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setCurrency(settings.currency || "SAR");
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart parse error");
      }
    }
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      // We store the currentPrice in the cart so the customer gets the price they saw
      const finalItem = {
        ...item,
        price: item.currentPrice || item.price
      };

      const newCart = exists
        ? prev.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...finalItem, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    toast.success("Added to order", {
      style: { borderRadius: "24px", background: "#111", color: "#fff", fontSize: "14px" },
    });
  };

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl font-light text-gray-400 tracking-[0.3em] animate-pulse">
          PREPARING...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {specialDishes.length > 0 && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight tracking-tight mb-12">
              Chef's Specials
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              {specialDishes.map((dish) => (
                <PremiumFoodCard key={dish._id} dish={dish} onAdd={addToCart} currency={currency} />
              ))}
            </div>
          </div>
        </section>
      )}

      {popularDishes.length > 0 && (
        <section className="bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight tracking-tight mb-12 text-left">
              Currently Craved
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              {popularDishes.map((dish) => (
                <PremiumFoodCard
                  key={dish._id}
                  dish={dish}
                  onAdd={addToCart}
                  currency={currency}
                  isPopular
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="pt-24 text-center">
        <Link
          href="/user/menu"
          className="group inline-flex items-center gap-6 px-12 py-6 bg-black text-white rounded-full text-xl font-bold hover:scale-105 transition-transform duration-500 shadow-2xl"
        >
          Explore Full Menu
          <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </Link>
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

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function PremiumFoodCard({ dish, onAdd, currency = "SAR", isPopular = false }) {
  if (!dish) return null;

  // FIX: Detect pricing type
  const displayPrice = dish.currentPrice || dish.price;
  const isSale = dish.isDynamic && Number(displayPrice) < Number(dish.price);
  const isSurge = dish.isDynamic && Number(displayPrice) > Number(dish.price);

  return (
    <div className="group bg-white border border-gray-100 rounded-[3rem] p-3 md:p-5 flex items-center gap-6 md:gap-10 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-500 min-h-[160px] md:min-h-[220px]">
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

        {/* Dynamic Pricing Tag */}
        {dish.isDynamic && (
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full shadow-sm backdrop-blur-md border border-white/20 ${isSale ? 'bg-green-500/90' : 'bg-orange-500/90'}`}>
            <span className="text-[9px] font-bold uppercase tracking-widest text-white">
              {dish.activeRuleName || (isSale ? 'Offer' : 'Trending')}
            </span>
          </div>
        )}

        {isPopular && !dish.isDynamic && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full shadow-sm">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-900">Popular</span>
          </div>
        )}
      </div>

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
              {isSale ? "Special Price" : "Price"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-4xl font-medium text-gray-900 leading-none tracking-tighter">
                {displayPrice}
              </span>
              <span className="text-xs md:text-lg font-light text-gray-400">
                {currency}
              </span>
              {dish.isDynamic && displayPrice !== dish.price && (
                <span className="text-xs md:text-sm text-gray-300 line-through ml-1">
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