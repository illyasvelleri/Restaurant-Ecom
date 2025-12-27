// app/user/cart/page.js → FINAL 2025 LUXURY BLACK & WHITE (HORIZONTAL SCROLL + PC PERFECT)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Footer from "../../components/footer";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
        if (parsed.length > 0) setSelectedItemIndex(0);
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQty = (index, change) => {
    const newCart = [...cart];
    newCart[index].quantity += change;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
      if (selectedItemIndex >= newCart.length && newCart.length > 0) {
        setSelectedItemIndex(0);
      }
    }
    updateCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
    if (selectedItemIndex >= newCart.length && newCart.length > 0) {
      setSelectedItemIndex(0);
    }
    toast.success("Item removed");
  };

  const toggleAddon = (addonIndex) => {
    const newCart = [...cart];
    const item = newCart[selectedItemIndex];
    if (!item.selectedAddons) item.selectedAddons = [];

    const existing = item.selectedAddons.findIndex(a => a.name === item.addons[addonIndex].name);
    if (existing > -1) {
      item.selectedAddons.splice(existing, 1);
    } else {
      item.selectedAddons.push(item.addons[addonIndex]);
    }
    updateCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const base = parseFloat(item.price || 0) * item.quantity;
      const addons = (item.selectedAddons || []).reduce((sum, a) => sum + parseFloat(a.price || 0), 0) * item.quantity;
      return total + base + addons;
    }, 0).toFixed(2);
  };

  const total = calculateTotal();
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <ShoppingCart size={100} className="text-gray-300 mb-8" />
        <h1 className="text-5xl font-light text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-xl text-gray-600 mb-10 max-w-md">
          Discover our finest dishes and add your favorites
        </p>
        <button
          onClick={() => router.push("/user/popular")}
          className="px-12 py-6 bg-black text-white rounded-full font-bold text-xl hover:bg-gray-800 transition shadow-2xl"
        >
          Explore Menu
        </button>
        <Footer />
      </div>
    );
  }

  const selectedItem = cart[selectedItemIndex] || {};

  return (
    <>
      <div className="min-h-screen bg-white">

        {/* LUXURY BLACK & WHITE HEADER */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
            <h1 className="text-6xl lg:text-8xl font-light text-gray-900 tracking-tight leading-none">
              Your Order
            </h1>
            <p className="mt-6 text-2xl lg:text-3xl text-gray-600 font-light">
              {cartCount} items • {total} SAR
            </p>
          </div>
        </div>

        {/* HORIZONTAL SCROLLING CART ITEMS — ELEGANT & SPACIOUS */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
            Selected Items
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
            {cart.map((item, index) => (
              <motion.div
                key={item._id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedItemIndex(index)}
                className={`flex-shrink-0 w-96 rounded-3xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 border-4 ${
                  selectedItemIndex === index ? 'border-black shadow-black/20' : 'border-transparent'
                }`}
              >
                <div className="relative h-64">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-3xl font-bold drop-shadow-2xl">{item.name}</h3>
                    <p className="text-xl mt-2">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="p-8 bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-4xl font-bold text-gray-900">{item.price} SAR</p>
                    <div className="flex items-center gap-6">
                      <button
                        onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }}
                        className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                      >
                        <Minus size={28} />
                      </button>
                      <span className="text-4xl font-bold w-20 text-center">{item.quantity}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }}
                        className="w-14 h-14 rounded-full bg-black text-white hover:bg-gray-800 transition flex items-center justify-center"
                      >
                        <Plus size={28} />
                      </button>
                    </div>
                  </div>
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Addons:</p>
                      <div className="flex flex-wrap gap-3">
                        {item.selectedAddons.map((addon, i) => (
                          <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">
                            {addon.name} (+{addon.price} SAR)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ADDONS FOR SELECTED ITEM */}
        {selectedItem.addons && selectedItem.addons.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 bg-gray-50">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Customize "{selectedItem.name}"
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {selectedItem.addons.map((addon, idx) => {
                const isSelected = (selectedItem.selectedAddons || []).some(a => a.name === addon.name);
                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleAddon(idx)}
                    className={`p-8 rounded-3xl shadow-lg transition-all duration-500 ${
                      isSelected
                        ? 'bg-black text-white shadow-2xl'
                        : 'bg-white border-2 border-gray-200 hover:border-black'
                    }`}
                  >
                    <p className="text-xl font-bold mb-2">{addon.name}</p>
                    <p className={`text-lg ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                      +{addon.price} SAR
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* PROCEED TO CHECKOUT */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="bg-black rounded-3xl p-12 shadow-2xl inline-block">
            <p className="text-5xl font-bold text-white mb-8">{total} SAR</p>
            <button
              onClick={() => router.push('/user/checkout')}
              className="px-20 py-8 bg-white text-black rounded-full font-bold text-2xl lg:text-3xl hover:bg-gray-100 transition shadow-2xl flex items-center gap-6 mx-auto"
            >
              Proceed to Checkout
              <ShoppingCart size={40} />
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}