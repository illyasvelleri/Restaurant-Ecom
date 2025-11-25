// app/user/menu/page.js   ← FINAL & FLAWLESS (NO NUMBER ANYWHERE)

'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Star, Search, X, Send, Plus, Minus } from "lucide-react";
import Header from "../../components/navbar";
import Footer from "../../components/footer";
import toast from 'react-hot-toast';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState(""); // ← No hardcoded number
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const categories = ["All", "Pizza", "Burgers", "Pasta", "Salads", "Desserts", "Drinks", "Appetizers"];

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, settingsRes] = await Promise.all([
          fetch('/api/user/products'),
          fetch('/api/admin/settings')
        ]);

        // Load products
        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(Array.isArray(data) ? data : []);
        }

        // Load WhatsApp number — ONLY from DB
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.restaurant?.whatsapp?.replace(/\D/g, ''); // Remove +, spaces, etc.

          if (wa && wa.length >= 10) {
            setWhatsappNumber(wa);
          } else {
            setWhatsappNumber("");
            toast.error("WhatsApp number not set in Admin → Settings → Restaurant");
          }
        } else {
          toast.error("Failed to load WhatsApp settings");
        }
      } catch (err) {
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredItems = products
    .filter(p => p.status === 'active')
    .filter(item =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
    toast.success("Added to cart!");
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
      toast.error("WhatsApp not configured. Please contact admin.");
      return;
    }

    const items = cart.map(i => `${i.quantity}x ${i.name} - ${i.price} SAR`).join('%0A');
    const msg = encodeURIComponent(
`*New Order*\n\n` +
`*Items:*\n${items}\n\n` +
`*Total: ${total} SAR*\n\n` +
`Please reply with your name and delivery address`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    toast.success("Order sent to WhatsApp!");
    setCart([]);
    setShowCart(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <div className="text-2xl font-semibold text-orange-600">Loading delicious menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Header />

      {/* Search & Filter */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dishes..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="hidden sm:flex items-center gap-3 mt-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
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

      {/* Menu Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={180}
                    height={180}
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
                )}
                {item.popular && (
                  <div className="absolute top-4 left-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                    Popular
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(item._id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition"
                >
                  <Heart
                    size={18}
                    className={favorites.includes(item._id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description || "Delicious dish"}</p>
                <div className="flex items-center space-x-1 mb-4">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{item.rating || 4.8}</span>
                  <span className="text-sm text-gray-400">({item.reviews || 200}+)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">{item.price} SAR</div>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all shadow-md flex items-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No dishes found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center flex">
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

      <Footer />
    </div>
  );
}