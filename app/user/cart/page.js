// app/user/cart/page.js → FINAL 2025 LUXURY CART PAGE (WITH ADDONS + TOTAL)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Footer from "../../components/footer";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    // Load cart from localStorage
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

    // Load WhatsApp number
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/restaurantDetails");
        if (res.ok) {
          const data = await res.json();
          const wa = data.restaurant?.whatsapp?.replace(/\D/g, "") || "";
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
        }
      } catch (err) {
        console.error("Failed to load WhatsApp");
      }
    };
    loadSettings();
  }, []);

  // Update cart in localStorage
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Update quantity
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

  // Remove item
  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
    if (selectedItemIndex >= newCart.length && newCart.length > 0) {
      setSelectedItemIndex(0);
    }
    toast.success("Item removed");
  };

  // Select addon for selected item
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

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = parseFloat(item.price || 0) * item.quantity;
      const addonsPrice = (item.selectedAddons || []).reduce((sum, a) => sum + parseFloat(a.price || 0), 0) * item.quantity;
      return total + itemPrice + addonsPrice;
    }, 0).toFixed(2);
  };

  const total = calculateTotal();
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const sendWhatsApp = () => {
    if (cart.length === 0) return toast.error("Cart is empty");

    let message = "*Order Summary*\n\n";
    cart.forEach(item => {
      message += `*${item.quantity}× ${item.name}* - ${item.price} SAR\n`;
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        message += "  Addons:\n";
        item.selectedAddons.forEach(a => {
          message += `    • ${a.name} +${a.price} SAR\n`;
        });
      }
      const itemTotal = (parseFloat(item.price) + (item.selectedAddons || []).reduce((s, a) => s + parseFloat(a.price || 0), 0)) * item.quantity;
      message += `  Subtotal: ${itemTotal.toFixed(2)} SAR\n\n`;
    });
    message += `*Grand Total: ${total} SAR*`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
    toast.success("Order sent via WhatsApp!");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <ShoppingCart size={100} className="text-gray-300 mb-8" />
        <h1 className="text-4xl font-light text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-xl text-gray-600 text-center max-w-md">
          Explore our popular dishes and add your favorites
        </p>
        <button
          onClick={() => router.push("/user/popular")}
          className="mt-10 px-10 py-5 bg-gray-900 text-white rounded-3xl font-bold text-xl hover:bg-gray-800 transition shadow-2xl"
        >
          Browse Menu
        </button>
        <Footer />
      </div>
    );
  }

  const selectedItem = cart[selectedItemIndex];

  return (
    <>
      <div className="min-h-screen bg-white">

        {/* LUXURY HEADER */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <h1 className="text-5xl lg:text-7xl font-light text-gray-900 tracking-tight">Your Order</h1>
            <p className="mt-4 text-xl text-gray-600">{cartCount} items • {total} SAR</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* HORIZONTAL SCROLLING CART ITEMS */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Selected Items</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {cart.map((item, index) => (
                <motion.div
                  key={item._id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedItemIndex(index)}
                  className={`flex-shrink-0 w-80 rounded-3xl overflow-hidden shadow-lg cursor-pointer transition-all ${
                    selectedItemIndex === index ? 'ring-4 ring-orange-500 shadow-2xl' : 'hover:shadow-xl'
                  }`}
                >
                  <div className="relative h-48">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold">{item.name}</h3>
                      <p className="text-lg">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">{item.price} SAR</p>
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            + Addons ({item.selectedAddons.length})
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
                          <Minus size={20} />
                        </button>
                        <span className="text-2xl font-bold w-12 text-center">{item.quantity}</span>
                        <button onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }} className="p-3 rounded-full bg-gray-900 text-white">
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ADDONS SECTION FOR SELECTED ITEM */}
          {selectedItem && selectedItem.addons && selectedItem.addons.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Add Extras to "{selectedItem.name}"
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedItem.addons.map((addon, idx) => {
                  const isSelected = (selectedItem.selectedAddons || []).some(a => a.name === addon.name);
                  return (
                    <motion.div
                      key={idx}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleAddon(idx)}
                      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50 shadow-xl' 
                          : 'border-gray-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{addon.name}</h4>
                          <p className="text-lg text-gray-600 mt-1">+{addon.price} SAR</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-400'
                        }`}>
                          {isSelected && <div className="w-4 h-4 bg-white rounded-full" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TOTAL & CHECKOUT */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Order Total</h2>
              <p className="text-5xl font-bold text-orange-600">{total} SAR</p>
            </div>

            <button
              onClick={sendWhatsApp}
              className="w-full py-7 bg-gray-900 text-white rounded-3xl font-bold text-2xl hover:bg-gray-800 transition shadow-2xl flex items-center justify-center gap-4"
            >
              <ShoppingCart size={32} />
              Send Order via WhatsApp
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}