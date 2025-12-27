// components/MainContent.js → FINAL 2025 (CART BUTTON GOES TO /user/cart)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { ShoppingCart, ChevronRight, Plus, Minus, X } from "lucide-react";

export default function MainContent() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [specialDishes, setSpecialDishes] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
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
          const shuffled = [...active].sort(() => Math.random() - 0.5);
          setSpecialDishes(shuffled.slice(0, 8));
        }

        if (popularRes.ok) {
          const data = await popularRes.json();
          setPopularDishes(data.map((d) => d.product).slice(0, 8));
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.restaurant?.whatsapp?.replace(/\D/g, "") || "";
          if (wa) setWhatsappNumber(wa);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();

    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      let newCart;

      if (exists) {
        newCart = prev.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [...prev, { ...item, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    toast.success("Added to order", {
      style: { borderRadius: "24px", background: "#111", color: "#fff" }
    });
  };

  const updateQty = (id, change) => {
    setCart(prev => {
      const updated = prev
        .map(i =>
          i._id === id ? { ...i, quantity: i.quantity + change } : i
        )
        .filter(i => i.quantity > 0);

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0).toFixed(0);
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-2xl font-light text-gray-600 tracking-widest">Preparing the finest selections...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Chef's Specials */}
      {specialDishes.length > 0 && (
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20 text-gray-900 tracking-tight">
              Chef's Specials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-12">
              {specialDishes.map(dish => <PremiumFoodCard key={dish._id} dish={dish} onAdd={addToCart} />)}
            </div>
          </div>
        </section>
      )}

      {/* Currently Craved */}
      {popularDishes.length > 0 && (
        <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20 text-gray-900 tracking-tight">
              Currently Craved
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-12">
              {popularDishes.map((dish) => (
                <PremiumFoodCard key={dish._id} dish={dish} onAdd={addToCart} isPopular />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <div className="py-24 lg:py-32 text-center">
        <Link
          href="/user/menu"
          className="group inline-flex items-center gap-4 px-16 py-6 lg:px-20 lg:py-8 bg-gray-900 text-white rounded-full text-xl lg:text-2xl font-medium shadow-2xl hover:shadow-amber-600/30 transform hover:scale-105 transition-all duration-700"
        >
          View Full Menu
          <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition duration-500" />
        </Link>
      </div>

      {/* Floating Cart Button — NOW GOES TO /user/cart */}
      {cartCount > 0 && (
        <button
          onClick={() => router.push('/user/cart')} // ← CHANGED TO GO TO CART PAGE
          className="fixed bottom-28 right-6 z-50 bg-gray-900 text-white p-5 lg:p-7 rounded-full shadow-2xl hover:shadow-amber-600/40 hover:scale-110 transition-all duration-500 flex items-center gap-4"
        >
          <ShoppingCart size={28} />
          <span className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium shadow-xl">
            {cartCount}
          </span>
        </button>
      )}

      {/* REMOVED THE OLD CART BOTTOM SHEET — NOW WE HAVE DEDICATED CART PAGE */}
    </div>
  );
}

// PREMIUM FOOD CARD — UNCHANGED
function PremiumFoodCard({ dish, onAdd, isPopular = false }) {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700">
      <div className="absolute -inset-1 bg-gradient-to-br from-amber-200/25 via-orange-100/15 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 -z-10" />

      <div className="relative aspect-[4/3] overflow-hidden">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-1200 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width:1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between">
          <div className="p-5 lg:p-7">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white drop-shadow-2xl leading-tight max-w-[75%]">
                {dish.name}
              </h3>
              {isPopular && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs lg:text-sm font-bold px-3.5 py-1.5 rounded-full shadow-xl uppercase tracking-wider">
                  Most Craved
                </span>
              )}
            </div>

            <p className="text-white/90 text-sm lg:text-base font-light leading-snug drop-shadow-md">
              {dish.description || "Premium ingredients, exceptional taste"}
            </p>
          </div>

          <div className="px-5 lg:px-7 pb-5 lg:pb-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white drop-shadow-2xl">
                  {dish.price}
                </div>
                <div className="text-lg text-white/80 font-light drop-shadow">SAR</div>
              </div>

              <button
                onClick={() => onAdd(dish)}
                className="group/btn relative flex items-center gap-2.5 px-7 lg:px-9 py-4 bg-white text-gray-900 rounded-2xl font-bold text-base lg:text-lg hover:bg-gray-50 transition-all duration-400 shadow-xl overflow-hidden"
              >
                <span className="relative z-10">Add to Cart</span>
                <Plus className="w-5 h-5 lg:w-6 lg:h-6 relative z-10 transition group-hover/btn:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/40 to-orange-500/40 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}