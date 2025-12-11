// app/user/menu/page.js → FINAL PIXEL-PERFECT 2025 LUXURY MENU

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ShoppingCart, X, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import Footer from "../../components/footer";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const categories = ["All", "Food", "Drinks", "Desserts"];

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, settingsRes] = await Promise.all([
          fetch('/api/user/products'),
          fetch('/api/admin/settings')
        ]);

        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(Array.isArray(data) ? data : []);
        }
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.restaurant?.whatsapp?.replace(/\D/g, '');
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
        }
      } catch (err) {
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const normalizeCategory = (cat) => {
    if (!cat) return "Food";
    if (["Appetizers", "Mains", "Pasta", "Burgers", "Salads"].includes(cat)) return "Food";
    return cat;
  };

  const filteredItems = products
    .filter(p => p.status === 'active')
    .filter(item => {
      const itemCat = normalizeCategory(item.category);
      const matchesCat = selectedCategory === "All" || itemCat === selectedCategory;
      const matchesSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      if (exists) return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success("Added to order", { style: { borderRadius: "24px", background: "#111", color: "#fff" } });
  };

  const updateQty = (id, change) => {
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: i.quantity + change } : i).filter(i => i.quantity > 0));
  };

  const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0).toFixed(0);
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  const sendWhatsApp = () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    const items = cart.map(i => `${i.quantity}× ${i.name}`).join("%0A");
    const msg = encodeURIComponent(`*New Order*\n\n${items}\n\n*Total: ${total} SAR*`);
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
    toast.success("Order sent");
    setCart([]);
    setShowCart(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-2xl font-light text-gray-600 tracking-widest">Curating excellence...</p>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-white">

        {/* ABSOLUTELY PERFECT HEADER */}
        {/* PERFECT SINGLE-LINE HEADER — 2025 LUXURY EDITION */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            {/* Title + Search — ONE PERFECT ROW ON PC */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 py-16 lg:py-24">

              {/* Left: Title — Single Line, Elegant */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-gray-900 tracking-tight text-center lg:text-left leading-none">
                Explore Our Menu
              </h1>

              {/* Right: Search Bar — Perfectly Aligned */}
              <div className="relative w-full max-w-xl lg:max-w-2xl xl:max-w-3xl">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" size={32} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for dishes..."
                  className="w-full pl-24 pr-12 py-7 lg:py-8 bg-gray-50/80 border border-gray-200 rounded-full 
                     text-xl lg:text-2xl xl:text-3xl font-light
                     focus:outline-none focus:ring-4 focus:ring-amber-100/60 
                     transition-all duration-500 text-gray-900 
                     placeholder:text-gray-500 backdrop-blur-sm
                     shadow-inner"
                />
              </div>
            </div>

            {/* Category Pills — Elegant & Centered */}
            <div className="flex flex-wrap justify-center gap-6 lg:gap-8 pb-16 lg:pb-20">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
            px-10 lg:px-14 py-5 rounded-full text-lg lg:text-xl font-medium 
            transition-all duration-500 border-2 shadow-md hover:shadow-xl
            ${selectedCategory === cat
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                    }
          `}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* PERFECT GRID — NO MORE BORING SPACING */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-14 xl:gap-16">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <PixelPerfectCard key={item._id} dish={item} onAdd={addToCart} />
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-40">
              <p className="text-4xl text-gray-400 font-light">No dishes found</p>
            </div>
          )}
        </div>

        {/* Floating Cart */}
        {cartCount > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-28 right-8 z-50 bg-gray-900 text-white w-20 h-20 rounded-full shadow-2xl hover:shadow-amber-600/40 hover:scale-110 transition-all duration-500 flex items-center justify-center"
          >
            <ShoppingCart size={38} />
            <span className="absolute -top-5 -right-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-2xl">
              {cartCount}
            </span>
          </button>
        )}

        {/* FINAL RESPONSIVE LUXURY CART — PERFECT ON ALL DEVICES */}
        {showCart && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xl z-50 flex items-end lg:items-center justify-center p-4">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white w-full max-w-2xl mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] lg:h-auto lg:max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 lg:p-8 border-b border-gray-100 flex justify-between items-center flex-shrink-0 bg-white">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Your Order ({cartCount})</h2>
                <button onClick={() => setShowCart(false)} className="p-3 hover:bg-gray-100 rounded-full transition">
                  <X size={36} />
                </button>
              </div>

              {/* Scrollable Items */}
              <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-6">
                {cart.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-6 bg-gray-50/80 p-6 rounded-3xl shadow-md"
                  >
                    <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">{item.name}</h4>
                        <p className="text-gray-600 text-sm lg:text-base mt-1">{item.price} SAR each</p>
                      </div>
                      <div className="flex items-center gap-5 mt-4">
                        <button onClick={() => updateQty(item._id, -1)} className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-900 transition">
                          <Minus size={20} />
                        </button>
                        <span className="text-2xl lg:text-3xl font-bold w-16 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item._id, 1)} className="w-12 h-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition">
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total + Checkout */}
              <div className="p-6 lg:p-8 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-white flex-shrink-0">
                <div className="flex justify-between text-3xl lg:text-4xl font-bold mb-8 text-gray-900">
                  <span>Total</span>
                  <span>{total} SAR</span>
                </div>
                <button
                  onClick={sendWhatsApp}
                  className="w-full py-7 bg-gray-900 text-white rounded-3xl font-bold text-xl lg:text-2xl hover:bg-gray-800 transition shadow-2xl"
                >
                  Checkout via WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <Footer />
      </div >
    </>
  );
}

// PIXEL-PERFECT 2025 LUXURY CARD
function PixelPerfectCard({ dish, onAdd }) {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700">
      {/* Gold shimmer */}
      <div className="absolute -inset-1 bg-gradient-to-br from-amber-200/25 via-orange-100/15 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* 4:3 Image with overlay */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-1200 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}

        {/* Perfect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        {/* Content over image */}
        <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between text-white">
          {/* Top: Name + Description */}
          <div className="mb-3">
            <h3 className="text-2xl lg:text-3xl font-bold leading-tight drop-shadow-2xl max-w-[70%]">
              {dish.name}
            </h3>
            <p className="text-sm lg:text-base font-light leading-relaxed drop-shadow-md mt-2 opacity-95 line-clamp-2">
              {dish.description || "Premium ingredients, exceptional taste"}
            </p>
          </div>

          {/* Bottom: Price + Button */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl lg:text-4xl font-bold drop-shadow-2xl">
                {dish.price}
              </div>
              <div className="text-lg font-light text-white/90 drop-shadow">SAR</div>
            </div>

            <button
              onClick={() => onAdd(dish)}
              className="group/btn relative px-8 lg:px-10 py-4 bg-white text-gray-900 rounded-3xl font-bold text-base lg:text-lg hover:bg-gray-50 transition-all duration-500 flex items-center gap-3 overflow-hidden shadow-2xl"
            >
              <span className="relative z-10">Add to Cart</span>
              <ShoppingCart className="w-6 h-6 relative z-10 group-hover/btn:translate-x-2 transition" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/40 to-orange-500/40 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}