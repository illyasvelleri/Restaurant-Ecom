


"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";
import { Plus, Minus, Trash2, Save } from "lucide-react";

export const dynamic = 'force-dynamic';

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.has("edit");
  const editOrderId = searchParams.get("edit");

  const [cart, setCart] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [currency, setCurrency] = useState("SAR");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        // Fetch products from the SAME API as your menu to get currentPrice
        const productsRes = await fetch("/api/user/products");
        const allProducts = productsRes.ok ? await productsRes.json() : [];

        if (isEditMode && editOrderId) {
          const res = await fetch(`/api/user/updateOrder?orderId=${editOrderId}`);
          if (res.ok) {
            const order = await res.json();

            const mappedCart = order.items.map(item => {
              // FIX: Find by ID, not by Name
              const originalProduct = allProducts.find(p =>
                (p._id?.toString() === item._id?.toString()) || (p._id?.toString() === item.productId?.toString())
              );

              // Rule: Use currentPrice from API (Dynamic), then item.price
              const finalPrice = originalProduct?.currentPrice || item.price;

              return {
                _id: item._id,
                name: item.name,
                price: parseFloat(finalPrice).toString(),
                quantity: item.quantity,
                addons: originalProduct?.addons || item.addons || [],
                selectedAddons: item.selectedAddons || [],
                image: originalProduct?.image || item.image || null
              };
            });

            setCart(mappedCart);
            if (mappedCart.length > 0) setSelectedItemIndex(0);
          }
        } else {
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            const parsed = JSON.parse(savedCart);

            // Sync with latest dynamic prices from the server
            // Sync with latest dynamic prices from the server
            const updatedPricingCart = parsed.map(item => {
              // FIX: ONLY search by ID. Never search by name.
              const originalProduct = allProducts.find(p => p._id === item._id);

              // Priority: currentPrice (Dynamic) > original price > fallback to cart price
              const latestPrice = originalProduct?.currentPrice || originalProduct?.price || item.price;

              return {
                ...item,
                price: latestPrice.toString()
              };
            });

            setCart(updatedPricingCart);
            if (updatedPricingCart.length > 0) setSelectedItemIndex(0);
          }
        }

        const resSet = await fetch("/api/restaurantDetails");
        if (resSet.ok) {
          const data = await resSet.json();
          setCurrency(data.currency || "SAR");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to sync prices");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isEditMode, editOrderId, router]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      // CRITICAL: Use parseFloat for decimals like 1.3
      const base = parseFloat(item.price || 0) * (item.quantity || 1);
      const addons = (item.selectedAddons || []).reduce((sum, a) => sum + parseFloat(a.price || 0), 0) * (item.quantity || 1);
      return total + base + addons;
    }, 0).toFixed(2);
  };

  const total = calculateTotal();
  const cartCount = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const updateCart = (newCart) => {
    setCart(newCart);
    if (!isEditMode) {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  const updateQty = (index, change) => {
    const newCart = [...cart];
    newCart[index].quantity = Math.max(0, (newCart[index].quantity || 0) + change);
    if (newCart[index].quantity === 0) {
      newCart.splice(index, 1);
      if (selectedItemIndex >= newCart.length && newCart.length > 0) {
        setSelectedItemIndex(0);
      } else if (selectedItemIndex === index) {
        setSelectedItemIndex(Math.max(0, index - 1));
      }
    }
    updateCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    if (selectedItemIndex >= newCart.length && newCart.length > 0) {
      setSelectedItemIndex(0);
    } else if (selectedItemIndex === index) {
      setSelectedItemIndex(Math.max(0, index - 1));
    }
    updateCart(newCart);
    toast.success("Item removed");
  };

  const toggleAddon = (addonIndex) => {
    const newCart = [...cart];
    const item = newCart[selectedItemIndex];
    if (!item.addons?.[addonIndex]) return;
    if (!item.selectedAddons) item.selectedAddons = [];
    const existing = item.selectedAddons.findIndex(a => a.name === item.addons[addonIndex].name);
    if (existing > -1) {
      item.selectedAddons.splice(existing, 1);
    } else {
      item.selectedAddons.push(item.addons[addonIndex]);
    }
    updateCart(newCart);
  };

  const handleSaveChanges = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/updateOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: editOrderId,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity || 1,
            price: parseFloat(item.price || 0),
            addons: item.addons || [],
            selectedAddons: item.selectedAddons || []
          })),
          totalAmount: parseFloat(total)
        })
      });

      if (res.ok) {
        toast.success("Order updated!");
        router.push(`/user/checkout?edit=${editOrderId}`);
      }
    } catch (err) {
      toast.error("Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-light text-gray-900 mb-6">Your cart is empty</h1>
        <button onClick={() => router.push("/user/menu")} className="px-8 py-4 bg-gray-900 text-white rounded-full">Explore Menu</button>
      </div>
    );
  }

  const selectedItem = cart[selectedItemIndex] || {};

  return (
    <div className="min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-gray-900">{isEditMode ? "Edit Order" : "Your Cart"}</h1>
        <p className="text-gray-500 mt-2">{cartCount} items · {total} {currency}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cart.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedItemIndex(index)}
              className={`relative bg-white rounded-3xl p-4 border transition-all cursor-pointer ${selectedItemIndex === index ? 'border-gray-900 shadow-xl' : 'border-gray-100 hover:border-gray-200'}`}
            >
              <div className="aspect-square relative rounded-2xl overflow-hidden mb-4 bg-gray-50">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
              <p className="text-gray-900 font-bold mb-4">{item.price} {currency}</p>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center bg-gray-50 rounded-xl p-1">
                  <button onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }} className="w-8 h-8 flex items-center justify-center"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }} className="w-8 h-8 flex items-center justify-center"><Plus size={14} /></button>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeItem(index); }} className="text-red-500 p-2"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {selectedItem.addons?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 p-8 bg-gray-50 rounded-3xl">
              <h2 className="text-xl font-bold mb-6">Extras for {selectedItem.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedItem.addons.map((addon, idx) => {
                  const isSelected = selectedItem.selectedAddons?.some(a => a.name === addon.name);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleAddon(idx)}
                      className={`p-4 rounded-2xl text-left border transition-all ${isSelected ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-100'}`}
                    >
                      <p className="font-bold text-sm">{addon.name}</p>
                      <p className="text-xs opacity-70">+{addon.price} {currency}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-gray-900 text-white p-6 rounded-3xl shadow-2xl z-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Grand Total</p>
            <p className="text-2xl font-bold">{total} {currency}</p>
          </div>
          <button
            onClick={() => isEditMode ? handleSaveChanges() : router.push("/user/checkout")}
            className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100"
          >
            {isEditMode ? "Update Order" : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartContent />
    </Suspense>
  );
}