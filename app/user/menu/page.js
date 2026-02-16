// // app/user/menu/page.js → UPDATED 2025 (DYNAMIC CURRENCY FROM PUBLIC API)

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { Search, ShoppingCart, X, Plus, Minus } from "lucide-react";
// import toast from "react-hot-toast";
// import Footer from "../../components/footer";

// export default function MenuPage() {
//   const router = useRouter();
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [cart, setCart] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [currency, setCurrency] = useState("SAR"); // ← NEW: dynamic currency
//   const [loading, setLoading] = useState(true);
//   const [showCart, setShowCart] = useState(false);

//   const categories = ["All", "Food", "Drinks", "Desserts"];

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [prodRes, settingsRes] = await Promise.all([
//           fetch('/api/user/products'),
//           fetch('/api/restaurantDetails') // ← updated to public endpoint
//         ]);

//         if (prodRes.ok) {
//           const data = await prodRes.json();
//           setProducts(Array.isArray(data) ? data : []);
//         }

//         if (settingsRes.ok) {
//           const settings = await settingsRes.json();
//           // WhatsApp
//           const wa = settings.whatsapp?.replace(/\D/g, '') || "";
//           if (wa && wa.length >= 10) setWhatsappNumber(wa);
//           // Currency
//           const fetchedCurrency = settings.currency || "SAR";
//           setCurrency(fetchedCurrency);
//         }
//       } catch (err) {
//         toast.error("Failed to load menu or settings");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();

//     // Load cart from localStorage
//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) {
//       try {
//         setCart(JSON.parse(savedCart));
//       } catch (e) {
//         setCart([]);
//       }
//     }
//   }, []);

//   const normalizeCategory = (cat) => {
//     if (!cat) return "Food";
//     if (["Appetizers", "Mains", "Pasta", "Burgers", "Salads"].includes(cat)) return "Food";
//     return cat;
//   };

//   const filteredItems = products
//     .filter(p => p.status === 'active')
//     .filter(item => {
//       const itemCat = normalizeCategory(item.category);
//       const matchesCat = selectedCategory === "All" || itemCat === selectedCategory;
//       const matchesSearch = !searchQuery ||
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
//       return matchesCat && matchesSearch;
//     });

//   const addToCart = (item) => {
//     setCart(prev => {
//       const exists = prev.find(i => i._id === item._id);
//       let newCart;

//       if (exists) {
//         newCart = prev.map(i =>
//           i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       } else {
//         newCart = [...prev, { ...item, quantity: 1 }];
//       }

//       localStorage.setItem("cart", JSON.stringify(newCart));
//       return newCart;
//     });

//     toast.success("Added to order", {
//       style: { borderRadius: "24px", background: "#111", color: "#fff" }
//     });
//   };

//   const updateQty = (id, change) => {
//     setCart(prev => {
//       const updated = prev
//         .map(i =>
//           i._id === id ? { ...i, quantity: i.quantity + change } : i
//         )
//         .filter(i => i.quantity > 0);

//       localStorage.setItem("cart", JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0).toFixed(0);
//   const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

//   if (loading) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <p className="text-2xl font-light text-gray-600 tracking-widest">Curating excellence...</p>
//     </div>
//   );

//   return (
//     <>
//       <div className="min-h-screen bg-white py-28">

//         {/* HEADER */}
//         <div className="border-b border-gray-100">
//           <div className="max-w-7xl mx-auto px-6 lg:px-8">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 py-16 lg:py-24">
//               <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-gray-900 tracking-tight text-center lg:text-left leading-none">
//                 Explore Our Menu
//               </h1>

//               <div className="relative w-full max-w-xl lg:max-w-2xl xl:max-w-3xl">
//                 <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" size={32} />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search for dishes..."
//                   className="w-full pl-24 pr-12 py-7 lg:py-8 bg-gray-50/80 border border-gray-200 rounded-full 
//                      text-xl lg:text-2xl xl:text-3xl font-light
//                      focus:outline-none focus:ring-4 focus:ring-amber-100/60 
//                      transition-all duration-500 text-gray-900 
//                      placeholder:text-gray-500 backdrop-blur-sm
//                      shadow-inner"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-wrap justify-center gap-6 lg:gap-8 pb-16 lg:pb-20">
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`
//                     px-10 lg:px-14 py-5 rounded-full text-lg lg:text-xl font-medium 
//                     transition-all duration-500 border-2 shadow-md hover:shadow-xl
//                     ${selectedCategory === cat
//                       ? "bg-gray-900 text-white border-gray-900"
//                       : "bg-white text-gray-700 border-gray-200 hover:border-gray-900 hover:text-gray-900"
//                     }
//                   `}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* GRID */}
//         <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-14 xl:gap-16">
//             {filteredItems.map((item, index) => (
//               <motion.div
//                 key={item._id}
//                 initial={{ opacity: 0, y: 60 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
//                 whileHover={{ y: -8 }}
//                 className="h-full"
//               >
//                 <PixelPerfectCard dish={item} onAdd={addToCart} currency={currency} />
//               </motion.div>
//             ))}
//           </div>

//           {filteredItems.length === 0 && (
//             <div className="text-center py-40">
//               <p className="text-4xl text-gray-400 font-light">No dishes found</p>
//             </div>
//           )}
//         </div>

//         {/* Floating Cart Button — ROUTES TO /user/cart */}
//         {cartCount > 0 && (
//           <button
//             onClick={() => router.push('/user/cart')}
//             className="fixed bottom-28 right-8 z-50 bg-gray-900 text-white w-20 h-20 rounded-full shadow-2xl hover:shadow-amber-600/40 hover:scale-110 transition-all duration-500 flex items-center justify-center"
//           >
//             <ShoppingCart size={38} />
//             <span className="absolute -top-5 -right-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-2xl">
//               {cartCount}
//             </span>
//           </button>
//         )}

//       </div>

//       <Footer />
//     </>
//   );
// }

// // UPDATED PIXEL-PERFECT CARD — now accepts currency prop
// function PixelPerfectCard({ dish, onAdd, currency = "SAR" }) {
//   return (
//     <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700">
//       <div className="absolute -inset-1 bg-gradient-to-br from-amber-200/25 via-orange-100/15 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 -z-10" />

//       <div className="relative aspect-[4/3] overflow-hidden">
//         {dish.image ? (
//           <Image
//             src={dish.image}
//             alt={dish.name}
//             fill
//             className="object-cover transition-transform duration-1200 group-hover:scale-110"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             priority
//           />
//         ) : (
//           <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200" />
//         )}

//         <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

//         <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between text-white">
//           <div className="mb-3">
//             <h3 className="text-2xl lg:text-3xl font-bold leading-tight drop-shadow-2xl max-w-[70%]">
//               {dish.name}
//             </h3>
//             <p className="text-sm lg:text-base font-light leading-relaxed drop-shadow-md mt-2 opacity-95 line-clamp-2">
//               {dish.description || "Premium ingredients, exceptional taste"}
//             </p>
//           </div>

//           <div className="flex items-end justify-between">
//             <div>
//               <div className="text-3xl lg:text-4xl font-bold drop-shadow-2xl">
//                 {dish.price}
//               </div>
//               <div className="text-lg font-light text-white/90 drop-shadow">
//                 {currency} {/* ← DYNAMIC CURRENCY */}
//               </div>
//             </div>

//             <button
//               onClick={() => onAdd(dish)}
//               className="group/btn relative px-8 lg:px-10 py-4 bg-white text-gray-900 rounded-3xl font-bold text-base lg:text-lg hover:bg-gray-50 transition-all duration-500 flex items-center gap-3 overflow-hidden shadow-2xl"
//             >
//               <span className="relative z-10">Add to Cart</span>
//               <ShoppingCart className="w-6 h-6 relative z-10 group-hover/btn:translate-x-2 transition" />
//               <div className="absolute inset-0 bg-gradient-to-r from-amber-400/40 to-orange-500/40 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-600" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/user/menu/page.js → PREMIUM REDESIGN 2025 - REFINED

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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
          setProducts(Array.isArray(data) ? data : []);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.whatsapp?.replace(/\D/g, '') || "";
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
          const fetchedCurrency = settings.currency || "SAR";
          setCurrency(fetchedCurrency);
        }
      } catch (err) {
        toast.error("Failed to load menu", {
          style: {
            borderRadius: "12px",
            background: "#1a1a1a",
            color: "#fff",
            padding: "16px 24px",
            fontSize: "15px",
            fontWeight: "500"
          },
        });
      } finally {
        setLoading(false);
      }
    };
    load();

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  const normalizeCategory = (cat) => {
    if (!cat) return "Food";
    if (["Appetizers", "Mains", "Pasta", "Burgers", "Salads"].includes(cat)) return "Food";
    return cat;
  };

  const filteredItems = products
    .filter(p => p.status === 'active')
    .filter(item => {
      const itemCat = normalizeCategory(item.category);
      const matchesCat = selectedCategory === "All" || itemCat === selectedCategory;
      const matchesSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      let newCart;

      if (exists) {
        newCart = prev.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [...prev, { ...item, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    toast.success("Added to order", {
      style: {
        borderRadius: "12px",
        background: "#1a1a1a",
        color: "#fff",
        padding: "16px 24px",
        fontSize: "15px",
        fontWeight: "500"
      },
    });
  };

  const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0).toFixed(0);
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base font-light text-gray-600 tracking-wide">
            Loading menu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white pt-24 md:pt-28 pb-16">

        {/* Header - Reduced spacing */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-10 md:py-14">
              <div className="text-center mb-8">
                <div className="inline-block bg-gray-900 text-white text-xs md:text-sm font-medium px-4 py-2 tracking-widest mb-4">
                  FULL MENU
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight mb-6">
                  Explore Our Menu
                </h1>

                {/* Search Bar - ROUNDED */}
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search dishes..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-full text-base font-light text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filters - ROUNDED, Reduced spacing */}
              <div className="flex flex-wrap justify-center gap-3 pb-6 md:pb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 md:px-8 py-3 rounded-full text-sm md:text-base font-medium tracking-wide transition-all duration-300 ${selectedCategory === cat
                        ? "bg-gray-900 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid - Reduced top spacing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="h-full"
              >
                <PremiumMenuCard dish={item} onAdd={addToCart} currency={currency} />
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg md:text-xl text-gray-400 font-light">No dishes found</p>
            </div>
          )}
        </div>

        {/* Floating Cart Button */}
        {cartCount > 0 && (
          <button
            onClick={() => router.push('/user/cart')}
            className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 bg-gray-900 text-white w-14 h-14 md:w-16 md:h-16 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center justify-center shadow-lg"
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
    </>
  );
}

// Premium Menu Card Component - Modern Rounded Corners
function PremiumMenuCard({ dish, onAdd, currency = "SAR" }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            priority
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-100 to-gray-50" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 lg:p-6">
        <h3 className="text-sm md:text-base lg:text-lg font-medium text-gray-900 mb-2 line-clamp-2 leading-snug">
          {dish.name}
        </h3>

        {dish.description && (
          <p className="text-xs md:text-sm text-gray-600 font-light mb-4 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>
        )}

        {/* Price and Add Button - SINGLE ROW */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg md:text-xl lg:text-2xl font-medium text-gray-900">
              {dish.price}
            </div>
            <div className="text-xs md:text-sm text-gray-500 font-light">
              {currency}
            </div>
          </div>

          <button
            onClick={() => onAdd(dish)}
            className="px-4 md:px-5 lg:px-6 py-2 md:py-2.5 bg-gray-900 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-gray-800 transition-colors duration-300 whitespace-nowrap"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}