// components/TopRatedDishes.tsx → FINAL & 100% IDENTICAL TO MENU CARD STYLE

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, ShoppingCart, ChevronRight, X, Send, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TopRatedDishes() {
  const [dishes, setDishes] = useState([]);
  const [cart, setCart] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          fetch('/api/user/products'),
          fetch('/api/admin/settings')
        ]);

        if (productsRes.ok) {
          const allProducts = await productsRes.json();
          const active = allProducts.filter(p => p.status === 'active');
          const shuffled = [...active].sort(() => Math.random() - 0.5);
          setDishes(shuffled.slice(0, 4));
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.restaurant?.whatsapp?.replace(/\D/g, '') || '';
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
        }
      } catch (err) {
        toast.error("Failed to load dishes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      if (exists) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success("Added to cart!");
  };

  const updateQty = (id, change) => {
    setCart(prev => prev
      .map(i => i._id === id ? { ...i, quantity: i.quantity + change } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price || 0) * item.quantity, 0).toFixed(2);

  const sendWhatsApp = () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (!whatsappNumber) return toast.error("WhatsApp not configured");

    const items = cart.map(i => `${i.quantity}x ${i.name} - ${i.price} SAR`).join('%0A');
    const msg = encodeURIComponent(
`*New Order*\n\n` +
`*Items:*\n${items}\n\n` +
`*Total: ${total} SAR*\n\n` +
`Please reply with your name and address`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    toast.success("Order sent!");
    setCart([]);
    setShowCart(false);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-3xl font-bold text-orange-600">Loading Special Dishes...</p>
        </div>
      </section>
    );
  }

  if (dishes.length === 0) return null;

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Special Dishes <span className="text-orange-500">Today</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hand-picked for you — fresh, delicious, and ready in minutes
            </p>
          </div>

          {/* Floating Cart */}
          <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all"
          >
            <ShoppingCart size={28} />
            {cart.reduce((a, b) => a + b.quantity, 0) > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>

          {/* GRID — EXACT SAME AS MENU PAGE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dishes.map((dish) => (
              <div
                key={dish._id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                  {dish.image ? (
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      width={180}
                      height={180}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{dish.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {dish.description || "Delicious dish"}
                  </p>

                  <div className="flex items-center text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-xs">15–25 min</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">{dish.price} SAR</div>
                    <button
                      onClick={() => addToCart(dish)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <a
              href="/user/menu"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-full hover:shadow-2xl transition-all hover:scale-105"
            >
              Explore Full Menu
              <ChevronRight size={28} />
            </a>
          </div>
        </div>
      </section>

      {/* EXACT SAME CART MODAL AS MENU PAGE */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button onClick={() => setShowCart(false)}>
                <X size={28} />
              </button>
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
                      <button onClick={() => updateQty(item._id, -1)} className="p-2 bg-gray-300 rounded-full">
                        <Minus size={16} />
                      </button>
                      <span className="font-bold w-10 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, 1)} className="p-2 bg-orange-500 text-white rounded-full">
                        <Plus size={16} />
                      </button>
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
                  className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl hover:bg-green-700 transition flex items-center justify-center gap-3 text-lg"
                >
                  <Send size={24} />
                  Send Order via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}