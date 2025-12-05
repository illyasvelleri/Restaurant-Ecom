// app/user/popular/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Star, Plus, Minus, X } from "lucide-react";
import Footer from "../../components/footer";
import toast from "react-hot-toast";

export default function PopularPage() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [popularRes, settingsRes] = await Promise.all([
          fetch("/api/user/popular"),
          fetch("/api/admin/settings"),
        ]);

        if (popularRes.ok) {
          const data = await popularRes.json();
          setPopularItems(Array.isArray(data) ? data.map((p) => p.product) : []);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.restaurant?.whatsapp?.replace(/\D/g, "");
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
        }
      } catch (err) {
        toast.error("Failed to load popular items");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    toast("Added", {
      icon: "Success",
      style: { background: "#000", color: "#fff", borderRadius: "24px" },
    });
  };

  const updateQty = (id, change) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i._id === id ? { ...i, quantity: i.quantity + change } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const total = cart
    .reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0)
    .toFixed(0);

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  const sendWhatsApp = () => {
    if (cart.length === 0) return toast.error("Cart is empty");

    const items = cart.map((i) => `${i.quantity}× ${i.name}`).join("%0A");
    const msg = encodeURIComponent(
      `*Popular Items Order*\n\n${items}\n\n*Total: ${total} SAR*`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
    toast.success("Order sent via WhatsApp");
    setCart([]);
    setShowCart(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 text-xl tracking-[0.3em]">
          Loading premium items...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white pb-32">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-5xl font-light tracking-wide mb-4">
            Popular Items
          </h1>
          <p className="text-white/40 text-lg tracking-widest">
            Best-selling dishes curated for you
          </p>
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

        {/* Item Grid - 2 cols */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            {popularItems.map((item) => (
              <div
                key={item._id}
                className="group bg-white/4 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/6 transition-all duration-500"
              >
                {/* Image */}
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

                  <div className="absolute top-8 left-8 px-6 py-3 rounded-full bg-white text-black font-semibold tracking-wider text-sm flex items-center gap-2">
                    <Star size={18} className="text-black" />
                    Popular
                  </div>

                  <button
                    onClick={() => toggleFavorite(item._id)}
                    className="absolute top-8 right-8 p-4 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition"
                  >
                    <Heart
                      size={22}
                      className={
                        favorites.includes(item._id)
                          ? "fill-white"
                          : "text-white/50"
                      }
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-10">
                  <h3 className="text-2xl font-medium mb-4">{item.name}</h3>

                  <p className="text-white/60 leading-relaxed mb-10">
                    {item.description || "Loved by everyone"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-light tracking-tight">
                      {item.price}{" "}
                      <span className="text-white/40 text-xl">SAR</span>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className="px-12 py-5 bg-white text-black rounded-3xl font-medium hover:bg-gray-200 transition flex items-center gap-3"
                    >
                      <ShoppingCart size={22} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {popularItems.length === 0 && (
            <div className="text-center py-32">
              <p className="text-2xl text-white/30 font-light">No items found</p>
            </div>
          )}
        </div>

        {/* Cart Bottom Sheet */}
        {showCart && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-end">
            <div className="bg-black border-t border-white/10 w-full max-w-2xl mx-auto rounded-t-3xl">
              <div className="flex justify-between items-center p-10 border-b border-white/10">
                <h2 className="text-2xl font-light">Your Order ({cartCount})</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-3 hover:bg-white/10 rounded-xl transition"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="p-10 space-y-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-b border-white/5 pb-6"
                  >
                    <div>
                      <p className="text-lg font-medium">
                        {item.quantity}× {item.name}
                      </p>
                      <p className="text-white/50">{item.price} SAR each</p>
                    </div>

                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => updateQty(item._id, -1)}
                        className="w-12 h-12 rounded-full border border-white/20 hover:bg-white/10 transition"
                      >
                        <Minus size={20} />
                      </button>

                      <span className="w-16 text-center text-xl">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQty(item._id, 1)}
                        className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-200 transition"
                      >
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

      <Footer />
    </>
  );
}
