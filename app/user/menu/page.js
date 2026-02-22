




"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

export default function MenuPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [currency, setCurrency] = useState("SAR");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Food", "Drinks", "Desserts"];

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, settingsRes] = await Promise.all([
          fetch('/api/user/products'),
          fetch('/api/restaurantDetails')
        ]);

        if (prodRes.ok) {
          const data = await prodRes.json();
          console.log("Fetched Products:", data);
          setProducts(Array.isArray(data) ? data : []);
        } else {
          console.error("Product API error:", prodRes.status);
          setProducts([]);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.whatsapp?.replace(/\D/g, '') || "";
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
          setCurrency(settings.currency || "SAR");
        }
      } catch (err) {
        console.error("LOAD ERROR:", err);
        setProducts([]);
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    load();

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { setCart([]); }
    }
  }, []);

  // Ensure items are only "active"
  const activeProducts = Array.isArray(products) ? products.filter(p => p.status === 'active') : [];

  const filteredItems = activeProducts.filter(item => {
    // FIX: Better normalization. If it's not explicitly Drinks or Desserts, it's Food.
    const rawCat = item.category || "Food";
    const itemCat = (rawCat === "Drinks" || rawCat === "Desserts") ? rawCat : "Food";

    const matchesCat = selectedCategory === "All" || itemCat === selectedCategory;
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      const newCart = exists
        ? prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
    toast.success("Added to order");
  };

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light mb-8">Our Menu</h1>

          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:border-black"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm transition-all ${selectedCategory === cat ? "bg-black text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <motion.div key={item._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PremiumMenuCard product={item} onAdd={addToCart} currency={currency} />
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-400">No dishes found in this category.</div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => router.push('/user/cart')}
          className="fixed bottom-24 right-6 z-50 bg-gray-900 text-white w-14 h-14 md:w-16 md:h-16 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center justify-center shadow-lg"
        >
          <svg
            className="w-6 h-6 md:w-7 md:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span className="absolute -top-2 -right-2 bg-gray-900 text-white w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs md:text-sm font-medium border-2 border-white">
            {cartCount}
          </span>
        </button>
      )}
    </div>
  );
}




// ── Card Component ───────────────────────────────────────────────────
function PremiumMenuCard({ product, onAdd, currency }) {
  if (!product) return null;

  const displayPrice = product.currentPrice || product.price;
  const isSale =
    product.isDynamic && Number(displayPrice) < Number(product.price);

  return (
    <div className="card-wrap">
      <div className="card-inner">
        {/* IMAGE */}
        <div className="card-image-wrap">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="card-image"
            />
          ) : (
            <div className="card-image-placeholder">🍽️</div>
          )}

          {/* Badge */}
          {product.isDynamic && (
            <div className={`card-badge ${isSale ? "badge-sale" : "badge-trend"}`}>
              {product.activeRuleName || (isSale ? "Privilege" : "Trending")}
            </div>
          )}

          {/* Mobile: + button pinned to bottom-right of image */}
          <button
            className="card-plus-mobile"
            onClick={(e) => { e.preventDefault(); onAdd(product); }}
            aria-label="Add to cart"
          >
            <Plus size={16} strokeWidth={2} />
          </button>
        </div>

        {/* TEXT */}
        <div className="card-body">
          <h3 className="card-name">{product.name}</h3>

          {product.description && (
            <p className="card-desc">{product.description}</p>
          )}

          {/* PRICE */}
          <div className="card-price-row">
            <span className="price-main">{displayPrice}</span>
            <span className="price-currency">{currency}</span>

            {product.isDynamic &&
              Number(displayPrice) !== Number(product.price) && (
                <span className="price-original">{product.price}</span>
              )}
          </div>

          {/* Desktop: full-width button */}
          <button
            className="card-btn-desktop"
            onClick={(e) => { e.preventDefault(); onAdd(product); }}
          >
            <Plus size={16} strokeWidth={2} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      <style>{`
        /* ── Google Font ── */
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;1,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #f7f6f3;
          color: #1a1a1a;
        }

        /* ── CARD WRAPPER ── */
        .card-wrap {
          width: 100%;
          height: 100%;
        }

        .card-inner {
          background: #ffffff;
          border: 1px solid #ececec;
          border-radius: 2rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: border-color 0.3s ease, box-shadow 0.4s ease, transform 0.3s ease;
        }

        .card-inner:hover {
          border-color: #d8d8d8;
          box-shadow: 0 20px 60px rgba(0,0,0,0.07);
          transform: translateY(-2px);
        }

        /* ── IMAGE ── */
        .card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #f3f3f1;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .card-image-wrap {
            aspect-ratio: 4 / 3;
          }
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 1s ease;
        }

        .card-inner:hover .card-image {
          transform: scale(1.06);
        }

        .card-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          background: #f0eeea;
        }

        /* ── BADGE ── */
        .card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: white;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          z-index: 2;
          font-family: 'DM Sans', sans-serif;
        }

        .badge-sale  { background: rgba(16, 185, 129, 0.88); }
        .badge-trend { background: rgba(249, 115, 22, 0.88); }

        /* ── MOBILE PLUS BUTTON (pinned bottom-right of image) ── */
        .card-plus-mobile {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1a1a1a;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        }

        .card-plus-mobile:active { transform: scale(0.92); }
        .card-plus-mobile:hover  { background: #000; }

        @media (min-width: 768px) {
          .card-plus-mobile { display: none; }
        }

        /* ── BODY ── */
        .card-body {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          padding: 14px 16px 16px;
        }

        @media (min-width: 768px) {
          .card-body {
            padding: 20px 20px 20px;
          }
        }

        /* ── NAME ── */
        .card-name {
          font-size: 15px;
          font-weight: 300;
          color: #1a1a1a;
          line-height: 1.25;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        @media (min-width: 768px) {
          .card-name {
            font-size: 22px;
            margin-bottom: 8px;
          }
        }

        /* ── DESCRIPTION ── */
        .card-desc {
          font-size: 11px;
          font-weight: 300;
          color: #9a9a9a;
          line-height: 1.55;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-bottom: 12px;
          font-style: italic;
        }

        @media (min-width: 768px) {
          .card-desc {
            font-size: 13px;
            margin-bottom: 16px;
          }
        }

        /* ── PRICE ── */
        .card-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: auto;
          padding-bottom: 2px;
        }

        .price-main {
          font-size: 22px;
          font-weight: 400;
          color: #1a1a1a;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        @media (min-width: 768px) {
          .price-main { font-size: 28px; }
        }

        .price-currency {
          font-size: 9px;
          font-weight: 500;
          color: #b0b0b0;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .price-original {
          font-size: 20px;
          font-weight: 300;
          color: #dcdcdc;
          text-decoration: line-through;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        @media (min-width: 768px) {
          .price-original { font-size: 26px; }
        }

        /* ── DESKTOP BUTTON ── */
        .card-btn-desktop {
          display: none;
        }

        @media (min-width: 768px) {
          .card-btn-desktop {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            background: #1a1a1a;
            color: white;
            border: none;
            cursor: pointer;
            padding: 16px;
            border-radius: 1.2rem;
            margin-top: 20px;
            font-family: 'DM Sans', sans-serif;
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.28em;
            text-transform: uppercase;
            transition: background 0.2s, transform 0.15s;
          }

          .card-btn-desktop:hover  { background: #000; }
          .card-btn-desktop:active { transform: scale(0.98); }
        }
      `}</style>
    </div>
  );
}