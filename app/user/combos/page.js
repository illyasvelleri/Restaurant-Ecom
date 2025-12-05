'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Star, Send, Plus, Minus, X, Package } from "lucide-react";
import Footer from "../../components/footer";
import toast from "react-hot-toast";

export default function ComboOffersPage() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [combos, setCombos] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [comboRes, settingsRes] = await Promise.all([
          fetch("/api/admin/combos"),
          fetch("/api/admin/settings"),
        ]);

        if (comboRes.ok) {
          const data = await comboRes.json();
          setCombos(Array.isArray(data) ? data : []);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.restaurant?.whatsapp?.replace(/\D/g, "");
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
          else toast.error("WhatsApp number not set in Admin Settings");
        }
      } catch {
        toast.error("Failed to load combo offers");
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

  const addToCart = (combo) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === combo._id);
      if (exists) {
        return prev.map((i) =>
          i._id === combo._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...combo, quantity: 1, name: combo.title, price: combo.price }];
    });
    toast.success(`"${combo.title}" added to cart!`);
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
    .toFixed(2);

  const sendWhatsApp = () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (!whatsappNumber) return toast.error("WhatsApp not configured");

    const items = cart
      .map((i) => `${i.quantity}x ${i.name} - ${i.price} SAR`)
      .join("%0A");

    const msg = encodeURIComponent(
      `*New Combo Order!*\n\n*Items:*\n${items}\n\n*Total: ${total} SAR*\n\nPlease reply with your name & delivery address.`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
    setCart([]);
    setShowCart(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-3xl font-light">Loading Combos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-light tracking-wide mb-3">
          Premium <span className="font-bold">Combo Deals</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Curated black-and-white combo experience — premium, clean & minimal.
        </p>
      </div>

      {/* Floating Cart */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 z-50 bg-white text-black p-5 rounded-full shadow-2xl hover:scale-110 transition-all"
      >
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {cart.reduce((a, b) => a + b.quantity, 0)}
          </span>
        )}
      </button>

      {/* COMBO GRID */}
      <div className="container mx-auto px-6 pb-32">
        {combos.length === 0 ? (
          <div className="text-center py-20">
            <Package size={90} className="mx-auto mb-8 text-gray-600" />
            <h3 className="text-3xl font-bold">No Combos Yet</h3>
            <p className="text-gray-400">Check again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {combos.map((combo) => (
              <div
                key={combo._id}
                className="bg-neutral-900 rounded-3xl border border-neutral-800 shadow-xl overflow-hidden group hover:-translate-y-2 transition-all"
              >
                {/* IMAGE */}
                <div className="relative h-60 bg-neutral-800">
                  {combo.image ? (
                    <Image
                      src={combo.image}
                      alt={combo.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={110} className="text-neutral-700" />
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-4 left-4 px-4 py-1 bg-white text-black text-sm rounded-full shadow">
                    <Star size={14} className="inline-block mr-1" /> Combo
                  </div>

                  {/* Favorite */}
                  <button
                    onClick={() => toggleFavorite(combo._id)}
                    className="absolute top-3 right-3 p-3 bg-white/70 backdrop-blur rounded-full hover:scale-110 transition"
                  >
                    <Heart
                      size={20}
                      className={
                        favorites.includes(combo._id)
                          ? "fill-black text-black"
                          : "text-black"
                      }
                    />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {combo.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {combo.description || "Premium curated combo"}
                  </p>

                  <div className="flex justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold">{combo.price} SAR</span>
                      {combo.originalPrice && (
                        <p className="text-gray-500 line-through text-sm">{combo.originalPrice} SAR</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(combo)}
                    className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
          <div className="bg-neutral-900 w-full max-w-md rounded-t-3xl shadow-2xl border border-neutral-800">
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <button onClick={() => setShowCart(false)}><X size={26} /></button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 bg-neutral-800 p-4 rounded-2xl mb-3"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-gray-400 text-sm">{item.price} SAR</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item._id, -1)}
                        className="p-2 bg-neutral-700 rounded-full"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-8 text-center font-bold">{item.quantity}</span>

                      <button
                        onClick={() => updateQty(item._id, 1)}
                        className="p-2 bg-white text-black rounded-full"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-neutral-800">
                <div className="flex justify-between text-lg font-bold mb-5">
                  <span>Total</span>
                  <span>{total} SAR</span>
                </div>

                <button
                  onClick={sendWhatsApp}
                  className="w-full py-4 bg-white text-black rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200"
                >
                  <Send size={20} />
                  Send Order via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
