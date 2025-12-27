// app/user/combos/page.js → FINAL 2025 (CART BUTTON GOES TO /user/cart)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Footer from "../../components/footer";

export default function CombosPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [combos, setCombos] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [comboRes, settingsRes] = await Promise.all([
          fetch("/api/admin/combos"),
          fetch("/api/restaurantDetails")
        ]);

        if (comboRes.ok) {
          const data = await comboRes.json();
          const normalized = Array.isArray(data)
            ? data.map(c => ({
                _id: c._id,
                name: c.title || "Unnamed Combo",
                price: c.price || 0,
                image: c.image || "",
                description: c.description || "",
                productIds: c.productIds || [],
              }))
            : [];
          setCombos(normalized);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.restaurant?.whatsapp?.replace(/\D/g, "") || "";
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
        }
      } catch (err) {
        toast.error("Failed to load combos");
      } finally {
        setLoading(false);
      }
    };
    load();

    // Load cart from localStorage
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

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-2xl font-light text-gray-600 tracking-widest">Curating our best combos...</p>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-white py-28">

        {/* LUXURY HEADER */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-gray-900 tracking-tight leading-none">
              Premium Combo Offers
            </h1>
            <p className="mt-6 text-xl lg:text-2xl text-gray-600 font-light tracking-wide">
              Curated bundles for the ultimate experience
            </p>
          </div>
        </div>

        {/* SMOOTH ANIMATED LUXURY GRID */}
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 lg:gap-14 xl:gap-16">
            {combos.map((combo, index) => (
              <motion.div
                key={combo._id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <PremiumComboCard combo={combo} onAdd={addToCart} />
              </motion.div>
            ))}
          </div>

          {combos.length === 0 && (
            <div className="text-center py-40">
              <p className="text-4xl text-gray-400 font-light">No combos available yet</p>
            </div>
          )}
        </div>

        {/* Floating Cart Button — NOW ROUTES TO /user/cart */}
        {cartCount > 0 && (
          <button
            onClick={() => router.push('/user/cart')} // ← GOES TO DEDICATED CART PAGE
            className="fixed bottom-28 right-8 z-50 bg-gray-900 text-white w-20 h-20 rounded-full shadow-2xl hover:shadow-amber-600/40 hover:scale-110 transition-all duration-500 flex items-center justify-center"
          >
            <ShoppingCart size={38} />
            <span className="absolute -top-5 -right-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-2xl">
              {cartCount}
            </span>
          </button>
        )}

        {/* REMOVED OLD CART MODAL — NOW WE HAVE FULL CART PAGE */}
      </div>

      <Footer />
    </>
  );
}

// LUXURY COMBO CARD — UNCHANGED
function PremiumComboCard({ combo, onAdd }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-full"
    >
      {/* Gold shimmer */}
      <div className="absolute -inset-1 bg-gradient-to-br from-amber-200/30 via-orange-100/15 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* 4:3 Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {combo.image ? (
          <Image
            src={combo.image}
            alt={combo.title}
            fill
            className="object-cover transition-transform duration-1200 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}

        {/* Smart overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between text-white">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold leading-tight drop-shadow-2xl">
              {combo.title}
            </h3>
            <p className="text-white/90 text-sm lg:text-base font-light leading-relaxed drop-shadow-lg mt-3 line-clamp-2">
              {combo.description || "Premium curated combo"}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl lg:text-4xl font-bold drop-shadow-2xl">
                {combo.price}
              </div>
              <div className="text-lg font-light text-white/90 drop-shadow">SAR</div>
            </div>

            <button
              onClick={() => onAdd(combo)}
              className="group/btn relative px-8 lg:px-10 py-4 bg-white text-gray-900 rounded-3xl font-bold text-base lg:text-lg hover:bg-gray-50 transition-all duration-500 flex items-center gap-3 overflow-hidden shadow-2xl"
            >
              <span className="relative z-10">Add to Cart</span>
              <ShoppingCart className="w-6 h-6 relative z-10 group-hover/btn:translate-x-2 transition" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/40 to-orange-500/40 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-600" />
            </button>
          </div>
        </div>

        {/* Combo Badge */}
        <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full text-xs lg:text-sm font-bold shadow-2xl uppercase tracking-wider">
          Combo Deal
        </div>
      </div>
    </motion.div>
  );
}