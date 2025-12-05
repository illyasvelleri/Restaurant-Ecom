// app/user/menu/page.js → FINAL ULTRA PREMIUM MENU 2025
// Only 3 categories: Food · Drinks · Desserts

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, ShoppingCart, Heart, X, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import Footer from "../../components/footer";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  // Only 3 categories — clean and luxurious
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

  // Smart filtering: map old categories → new ones
  const normalizeCategory = (cat) => {
    if (!cat) return "Food";
    if (["Appetizers", "Mains", "Pasta", "Burgers", "Salads"].includes(cat)) return "Food";
    if (cat === "Drinks") return "Drinks";
    if (cat === "Desserts") return "Desserts";
    return "Food"; // fallback
  };

  const filteredItems = products
    .filter(p => p.status === 'active')
    .filter(item => {
      const itemCat = normalizeCategory(item.category);
      const matchesCategory = selectedCategory === "All" || itemCat === selectedCategory;
      const matchesSearch = searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      if (exists) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast("Added", {
      icon: "Success",
      style: { background: '#000', color: '#fff', borderRadius: '24px' }
    });
  };

  const updateQty = (id, change) => {
    setCart(prev => prev
      .map(i => i._id === id ? { ...i, quantity: i.quantity + change } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0).toFixed(0);
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  const sendWhatsApp = () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (!whatsappNumber) return toast.error("WhatsApp not configured");

    const items = cart.map(i => `${i.quantity}× ${i.name}`).join("%0A");
    const msg = encodeURIComponent(`*New Order*\n\n${items}\n\n*Total: ${total} SAR*`);
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
    toast.success("Order sent via WhatsApp");
    setCart([]);
    setShowCart(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/50 text-xl tracking-widest">Loading exquisite dishes...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white pb-32">

        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-3xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-4xl font-light tracking-wider">Menu</h1>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={22} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search menu..."
                    className="w-80 lg:w-96 pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl focus:outline-none focus:border-white/20 transition placeholder:text-white/30 text-base"
                  />
                </div>
              </div>
            </div>

            {/* Mobile-First Category Tabs — Beautiful on every screen */}
            <div className="flex flex-wrap justify-center gap-4 px-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
        flex-1 min-w-0 max-w-[160px]  /* perfect size on mobile */
        px-8 py-4
        rounded-full
        text-base sm:text-lg font-medium
        whitespace-nowrap
        transition-all duration-300
        border-2
        ${selectedCategory === cat
                      ? "bg-white text-black border-white shadow-lg"
                      : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/20"
                    }
      `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Grid – 2 Columns Mobile & Desktop */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group bg-white/4 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/6 transition-all duration-500"
              >
                <div className="relative h-96 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-zinc-900 to-black" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70" />

                  <button
                    onClick={() => toggleFavorite(item._id)}
                    className="absolute top-8 right-8 p-4 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition"
                  >
                    <Heart
                      size={22}
                      className={favorites.includes(item._id) ? "fill-white" : "text-white/50"}
                    />
                  </button>
                </div>

                <div className="p-10">
                  <h3 className="text-2xl font-medium mb-4">{item.name}</h3>
                  <p className="text-white/60 text-base leading-relaxed mb-10">
                    {item.description || "Prepared with precision and passion"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-light tracking-tight">
                      {item.price} <span className="text-white/40 text-xl">SAR</span>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className="px-12 py-5 bg-white text-black rounded-3xl font-medium hover:bg-gray-100 transition flex items-center gap-3"
                    >
                      <ShoppingCart size={22} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-32">
              <p className="text-2xl text-white/30 font-light">No items found</p>
            </div>
          )}
        </div>

        {/* Floating Cart */}
        {cartCount > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-10 right-10 z-50 bg-white text-black p-7 rounded-full shadow-2xl hover:scale-110 transition"
          >
            <ShoppingCart size={32} />
            <span className="absolute -top-4 -right-4 bg-black text-white text-lg font-medium w-12 h-12 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        )}

        {/* Cart Bottom Sheet */}
        {showCart && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-end">
            <div className="bg-black border-t border-white/10 w-full max-w-2xl mx-auto rounded-t-3xl">
              <div className="flex justify-between items-center p-10 border-b border-white/10">
                <h2 className="text-2xl font-light">Your Order ({cartCount})</h2>
                <button onClick={() => setShowCart(false)} className="p-3 hover:bg-white/10 rounded-xl transition">
                  <X size={28} />
                </button>
              </div>

              <div className="p-10 space-y-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center border-b border-white/5 pb-6">
                    <div>
                      <p className="text-lg font-medium">{item.quantity}× {item.name}</p>
                      <p className="text-white/50">{item.price} SAR each</p>
                    </div>
                    <div className="flex items-center gap-5">
                      <button onClick={() => updateQty(item._id, -1)} className="w-12 h-12 rounded-full border border-white/20 hover:bg-white/10 transition">
                        <Minus size={20} />
                      </button>
                      <span className="w-16 text-center text-xl">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, 1)} className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-200 transition">
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 border-t border-white/10">
                <div className="flex justify-between text-3xl font-light mb-10">
                  <span>Total</span>
                  <span>{total} SAR</span>
                </div>
                <button
                  onClick={sendWhatsApp}
                  className="w-full py-6 bg-white text-black rounded-3xl font-medium hover:bg-gray-100 transition text-lg"
                >
                  Send Order via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}