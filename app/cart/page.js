"use client";

import { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  Clock,
  Tag,
  MapPin,
  CreditCard,
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Image from "next/image";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Margherita Pizza", price: 12.99, quantity: 2, image: "/Images/pizza.png", category: "Pizza" },
    { id: 2, name: "Spaghetti Carbonara", price: 14.99, quantity: 1, image: "/Images/burger.png", category: "Pasta" },
    { id: 3, name: "Caesar Salad", price: 8.99, quantity: 1, image: "/Images/salad.png", category: "Salads" },
    { id: 4, name: "Chocolate Cake", price: 6.99, quantity: 2, image: "/Images/pizza.png", category: "Desserts" },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState("standard");

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo({ code: "SAVE10", discount: 0.10, type: "percentage" });
    } else if (promoCode.toUpperCase() === "FLAT5") {
      setAppliedPromo({ code: "FLAT5", discount: 5, type: "flat" });
    } else {
      setAppliedPromo(null);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryOption === "express" ? 4.99 : 2.99;
  const discount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? subtotal * appliedPromo.discount
      : appliedPromo.discount
    : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal + deliveryFee - discount + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
            <Image src="/Images/empty-cart.png" width={120} height={120} alt="Empty Cart" className="mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
            <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SECTION */}
            <div className="lg:col-span-2 space-y-5">
              {/* Delivery Options */}
              <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
                <h3 className="text-lg font-bold flex items-center mb-4">
                  <Clock className="mr-2 text-orange-500" size={20} />
                  Delivery Option
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { type: "standard", label: "Standard", time: "30-45 mins", price: 2.99 },
                    { type: "express", label: "Express ⚡", time: "15-20 mins", price: 4.99 },
                  ].map(option => (
                    <button
                      key={option.type}
                      onClick={() => setDeliveryOption(option.type)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        deliveryOption === option.type
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex justify-between font-semibold text-gray-900 mb-1">
                        {option.label}
                        <span className="text-orange-500">${option.price}</span>
                      </div>
                      <p className="text-sm text-gray-500">{option.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                    >
                      <div className="w-20 h-20 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Image src={item.image} width={60} height={60} alt={item.name} />
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                        <p className="text-lg font-bold text-orange-500">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center justify-center sm:justify-end gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-orange-500"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-orange-500"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-100 rounded-full transition"
                      >
                        <Trash2 size={18} className="text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Tag className="mr-2 text-orange-500" size={20} /> Promo Code
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="mt-3 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-sm text-green-700">✓ Code “{appliedPromo.code}” applied</span>
                    <button
                      onClick={() => {
                        setAppliedPromo(null);
                        setPromoCode("");
                      }}
                      className="text-green-700 hover:text-green-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Try: SAVE10 or FLAT5</p>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                {/* Address */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start">
                    <MapPin size={18} className="text-orange-500 mr-2 mt-1" />
                    <div>
                      <p className="font-semibold">Delivery Address</p>
                      <p className="text-sm text-gray-600">123 Main Street, Apt 4B</p>
                      <p className="text-sm text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>
                  <button className="text-sm text-orange-500 mt-2 hover:text-orange-600">
                    Change Address
                  </button>
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-orange-500">${total.toFixed(2)}</span>
                </div>

                {/* Payment */}
                <div className="mb-6">
                  <p className="font-semibold mb-2 text-gray-900">Payment Method</p>
                  <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard size={20} className="text-orange-500 mr-3" />
                      <span className="font-medium">•••• 4242</span>
                    </div>
                    <span className="text-sm text-gray-500">Change</span>
                  </button>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform">
                  Proceed to Checkout
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">🔒 Secure checkout with SSL encryption</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
