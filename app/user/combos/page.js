// app/user/combos/page.js → PRO LUXURY REDESIGN

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ShoppingBag, Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function CombosPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [combos, setCombos] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [currency, setCurrency] = useState("SAR");
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
          const wa = settings.whatsapp?.replace(/\D/g, "") || "";
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
          const fetchedCurrency = settings.currency || "SAR";
          setCurrency(fetchedCurrency);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load combos", {
          style: { borderRadius: "12px", background: "#1a1a1a", color: "#fff" },
        });
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
        setCart([]);
      }
    }
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      let newCart;
      if (exists) {
        newCart = prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        newCart = [...prev, { ...item, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    toast.success("Added to your selection", {
      style: { borderRadius: "12px", background: "#000", color: "#fff", fontSize: "14px", fontWeight: "600", letterSpacing: "0.1em" },
    });
  };

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-black mx-auto mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Initializing Offers</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* LUXURY HERO SECTION */}
      <section className="bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-white/10 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 mb-6 border border-white/10 px-4 py-2 rounded-full">
              <Sparkles size={12} /> Curated Experiences
            </span>
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6">
              Exclusive <span className="font-serif italic text-white/40">Combos</span>
            </h1>
            <p className="text-sm md:text-base text-gray-400 font-light max-w-xl mx-auto tracking-wide leading-relaxed">
              Precision-crafted pairings designed for the discerning palate, offered with exceptional value.
            </p>
          </motion.div>
        </div>
      </section>

      {/* GRID SECTION */}
      <div className="max-w-7xl mx-auto px-6 -mt-12">
        {combos.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">No active offers at this time</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {combos.map((combo, index) => (
              <ModernComboCard
                key={combo._id}
                combo={combo}
                onAdd={addToCart}
                currency={currency}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* PRO FLOATING CART */}
      <AnimatePresence>
        {/* Floating Cart Button */}
        {cartCount > 0 && (
          <button
            onClick={() => router.push('/user/cart')}
            className="fixed bottom-24 right-6 z-50 bg-gray-900 text-white w-14 h-14 md:w-16 md:h-16 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center justify-center shadow-lg"
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
            <span className="absolute -top-2 -right-2 bg-gray-900 text-white w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs md:text-sm font-medium border-2 border-white">
              {cartCount}
            </span>
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModernComboCard({ combo, onAdd, currency, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {combo.image ? (
          <Image
            src={combo.image}
            alt={combo.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index < 2}
          />
        ) : (
          <div className="h-full bg-gray-50" />
        )}

        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="bg-black/90 backdrop-blur-md text-white text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
            Signature
          </span>
          <span className="bg-white/90 backdrop-blur-md text-black text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm">
            {combo.productIds?.length || 0} Elements
          </span>
        </div>
      </div>

      <div className="p-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-light tracking-tight text-black max-w-[70%] leading-tight">
            {combo.name}
          </h3>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
            <p className="text-2xl font-bold tracking-tighter text-black">
              {combo.price} <span className="text-xs font-medium tracking-normal ml-0.5">{currency}</span>
            </p>
          </div>
        </div>

        {combo.description && (
          <p className="text-sm text-gray-500 font-light mb-10 line-clamp-2 leading-relaxed tracking-wide">
            {combo.description}
          </p>
        )}

        <button
          onClick={() => onAdd(combo)}
          className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
        >
          Add to Order
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}