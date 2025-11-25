// app/user/combos/page.js   ← FINAL & STUNNING

'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Star, Send, Plus, Minus, X, Package } from "lucide-react";
import Header from "../../components/navbar";
import Footer from "../../components/footer";
import toast from 'react-hot-toast';

export default function ComboOffersPage() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [combos, setCombos] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState(""); // ← No hardcoded number
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [comboRes, settingsRes] = await Promise.all([
          fetch('/api/admin/combos'),        // ← Fetches real combos from admin
          fetch('/api/admin/settings')
        ]);

        if (comboRes.ok) {
          const data = await comboRes.json();
          setCombos(Array.isArray(data) ? data : []);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.restaurant?.whatsapp?.replace(/\D/g, '');
          if (wa && wa.length >= 10) {
            setWhatsappNumber(wa);
          } else {
            toast.error("WhatsApp number not set in Admin Settings");
          }
        }
      } catch (err) {
        toast.error("Failed to load combo offers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addToCart = (combo) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === combo._id);
      if (exists) {
        return prev.map(i => i._id === combo._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...combo, quantity: 1, name: combo.title, price: combo.price }];
    });
    toast.success(`"${combo.title}" added to cart!`);
  };

  const updateQty = (id, change) => {
    setCart(prev => prev
      .map(i => i._id === id ? { ...i, quantity: i.quantity + change } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0).toFixed(2);

  const sendWhatsApp = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (!whatsappNumber) {
      toast.error("WhatsApp not configured");
      return;
    }

    const items = cart.map(i => `${i.quantity}x ${i.name} - ${i.price} SAR`).join('%0A');
    const msg = encodeURIComponent(
`*New Combo Order!*\n\n` +
`*Items:*\n${items}\n\n` +
`*Total: ${total} SAR*\n\n` +
`Please reply with name and delivery address`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    toast.success("Order sent via WhatsApp!");
    setCart([]);
    setShowCart(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <div className="text-3xl font-bold text-orange-600">Loading Combo Deals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4">
          Limited Time <span className="text-orange-500">Combo Deals</span>
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
          Save big with our exclusive combo offers — perfect for families & parties!
        </p>
      </div>

      {/* Floating Cart */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all"
      >
        <ShoppingCart size={28} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold">
            {cart.reduce((a, b) => a + b.quantity, 0)}
          </span>
        )}
      </button>

      {/* Combos Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {combos.length === 0 ? (
          <div className="text-center py-20">
            <Package size={100} className="mx-auto mb-8 text-gray-300" />
            <h3 className="text-4xl font-bold text-gray-900 mb-4">No Combo Offers Yet</h3>
            <p className="text-xl text-gray-500">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {combos.map((combo) => (
              <div
                key={combo._id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-3"
              >
                {/* Image */}
                <div className="relative h-64 bg-gradient-to-br from-orange-100 to-red-50">
                  {combo.image ? (
                    <Image
                      src={combo.image}
                      alt={combo.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={120} className="text-orange-200" />
                    </div>
                  )}

                  {/* Combo Badge */}
                  <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full shadow-xl flex items-center gap-2">
                    <Star size={18} className="fill-current" />
                    Combo Deal
                  </div>

                  {/* Heart */}
                  <button
                    onClick={() => toggleFavorite(combo._id)}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:scale-110 transition"
                  >
                    <Heart
                      size={22}
                      className={favorites.includes(combo._id) ? "fill-red-500 text-red-500" : "text-gray-600"}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{combo.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{combo.description || "Limited time combo offer"}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-4xl font-bold text-orange-600">{combo.price} SAR</span>
                      {combo.originalPrice && (
                        <span className="block text-lg text-gray-500 line-through mt-1">
                          {combo.originalPrice} SAR
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(combo)}
                    className="w-full py-4 bg-orange-600 text-white font-bold text-lg rounded-2xl hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    <ShoppingCart size={22} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button onClick={() => setShowCart(false)}><X size={28} /></button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item._id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.price} SAR each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(item._id, -1)} className="p-2 bg-gray-300 rounded-full"><Minus size={16} /></button>
                      <span className="font-bold w-10 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, 1)} className="p-2 bg-orange-500 text-white rounded-full"><Plus size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>Total</span>
                  <span>{total} SAR</span>
                </div>
                <button
                  onClick={sendWhatsApp}
                  className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <Send size={24} />
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