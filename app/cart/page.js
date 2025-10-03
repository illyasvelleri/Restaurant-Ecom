"use client";
import { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Tag, Clock, MapPin, CreditCard } from "lucide-react";
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
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="text-8xl mb-6">
              <Image src="/Images/empty-cart.png" width={100} height={100} alt="Empty Cart" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 text-center">Add some delicious items to get started!</p>
            <button className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all shadow-lg">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Options */}
              <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="mr-2 text-orange-500" size={20} />
                  Delivery Option
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryOption("standard")}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      deliveryOption === "standard"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Standard</span>
                      <span className="text-sm font-bold text-orange-500">$2.99</span>
                    </div>
                    <p className="text-sm text-gray-500">30-45 mins</p>
                  </button>
                  <button
                    onClick={() => setDeliveryOption("express")}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      deliveryOption === "express"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Express ⚡</span>
                      <span className="text-sm font-bold text-orange-500">$4.99</span>
                    </div>
                    <p className="text-sm text-gray-500">15-20 mins</p>
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all"
                    >
                      {/* Item Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Image src={item.image} width={60} height={60} alt={item.name} className="object-contain" />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                        <p className="text-lg font-bold text-orange-500">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center"
                        >
                          <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center"
                        >
                          <Plus size={16} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 sm:p-2.5 rounded-full hover:bg-red-50 transition-all group"
                      >
                        <Trash2 size={18} className="text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Tag className="mr-2 text-orange-500" size={20} />
                  Promo Code
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-md whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                    <span className="text-sm text-green-700 font-medium">
                      ✓ Code "{appliedPromo.code}" applied!
                    </span>
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
                <p className="text-xs text-gray-500 mt-3">Try: SAVE10 or FLAT5</p>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                {/* Delivery Address */}
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-start mb-2">
                    <MapPin size={18} className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Delivery Address</p>
                      <p className="text-sm text-gray-600">123 Main Street, Apt 4B</p>
                      <p className="text-sm text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>
                  <button className="text-sm text-orange-500 font-medium hover:text-orange-600 mt-2">
                    Change Address
                  </button>
                </div>

                {/* Price Breakdown */}
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
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-orange-500">${total.toFixed(2)}</span>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Payment Method</p>
                  <button className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-orange-500 transition-all flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard size={20} className="text-orange-500 mr-3" />
                      <span className="font-medium text-gray-900">•••• 4242</span>
                    </div>
                    <span className="text-sm text-gray-500">Change</span>
                  </button>
                </div>

                {/* Checkout Button */}
                <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Proceed to Checkout
                </button>

                {/* Security Note */}
                <p className="text-xs text-center text-gray-500 mt-4">
                  🔒 Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
