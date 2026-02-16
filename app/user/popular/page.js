// // app/user/popular/page.js → UPDATED 2025 (DYNAMIC CURRENCY FROM PUBLIC API)

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { ShoppingCart } from "lucide-react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import Footer from "../../components/footer";

// export default function PopularPage() {
//   const router = useRouter();
//   const [cart, setCart] = useState([]);
//   const [popularItems, setPopularItems] = useState([]);
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [currency, setCurrency] = useState("SAR"); // ← NEW: dynamic currency
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [popularRes, settingsRes] = await Promise.all([
//           fetch("/api/user/popular"),
//           fetch("/api/restaurantDetails") // ← updated to public endpoint
//         ]);

//         if (popularRes.ok) {
//           const data = await popularRes.json();
//           setPopularItems(Array.isArray(data) ? data.map(p => p.product) : []);
//         }

//         if (settingsRes.ok) {
//           const settings = await settingsRes.json();
//           // WhatsApp
//           const wa = settings.whatsapp?.replace(/\D/g, "") || "";
//           if (wa && wa.length >= 10) setWhatsappNumber(wa);
//           // Currency
//           const fetchedCurrency = settings.currency || "SAR";
//           setCurrency(fetchedCurrency);
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load popular items or settings");
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

//   const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0).toFixed(0);
//   const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

//   if (loading) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <p className="text-2xl font-light text-gray-600 tracking-widest">Curating our best sellers...</p>
//     </div>
//   );

//   return (
//     <>
//       <div className="min-h-screen bg-white py-28">

//         {/* LUXURY HEADER */}
//         <div className="border-b border-gray-100">
//           <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center">
//             <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-gray-900 tracking-tight leading-none">
//               Most Loved Dishes
//             </h1>
//             <p className="mt-6 text-xl lg:text-2xl text-gray-600 font-light tracking-wide">
//               Our guests’ all-time favorites
//             </p>
//           </div>
//         </div>

//         {/* SMOOTH ANIMATED LUXURY GRID */}
//         <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 lg:gap-14 xl:gap-16">
//             {popularItems.map((item, index) => (
//               <motion.div
//                 key={item._id}
//                 initial={{ opacity: 0, y: 60 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
//                 whileHover={{ y: -8 }}
//                 className="h-full"
//               >
//                 <PremiumFoodCard dish={item} onAdd={addToCart} currency={currency} />
//               </motion.div>
//             ))}
//           </div>
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

// // UPDATED PREMIUM FOOD CARD — now accepts currency prop
// function PremiumFoodCard({ dish, onAdd, currency = "SAR" }) {
//   return (
//     <motion.div
//       whileHover={{ y: -8 }}
//       className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-full"
//     >
//       {/* Gold shimmer */}
//       <div className="absolute -inset-1 bg-gradient-to-br from-amber-200/30 via-orange-100/15 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 -z-10" />

//       {/* 4:3 Image */}
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

//         {/* Smart overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

//         {/* Content */}
//         <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between text-white">
//           <div>
//             <h3 className="text-2xl lg:text-3xl font-bold leading-tight drop-shadow-2xl">
//               {dish.name}
//             </h3>
//             <p className="text-white/90 text-sm lg:text-base font-light leading-relaxed drop-shadow-lg mt-3 line-clamp-2">
//               {dish.description || "Handcrafted with premium ingredients"}
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
//     </motion.div>
//   );
// }

// app/user/popular/page.js → PREMIUM REDESIGN 2025
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, ShoppingBag } from "lucide-react";


export default function PopularPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [currency, setCurrency] = useState("SAR");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [popularRes, settingsRes] = await Promise.all([
          fetch("/api/user/popular"),
          fetch("/api/restaurantDetails")
        ]);

        if (popularRes.ok) {
          const data = await popularRes.json();
          setPopularItems(Array.isArray(data) ? data.map(p => p.product) : []);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setCurrency(settings.currency || "SAR");
        }
      } catch (err) {
        console.error(err);
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

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      const newCart = exists
        ? prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
    toast.success("Added to order", {
      style: { borderRadius: "24px", background: "#111", color: "#fff" },
    });
  };

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl font-light text-gray-400 tracking-[0.3em] animate-pulse">PREPARING...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white pt-24 md:pt-32 pb-16">
        {/* Header - Large Light Typography */}
        <div className="max-w-7xl mx-auto px-4 mb-16 md:mb-24 pt-24">
          <div className="inline-block bg-gray-900 text-white text-[10px] font-black tracking-[0.3em] px-4 py-1.5 mb-6 uppercase">
            Curated
          </div>
          <h1 className="text-5xl md:text-8xl font-light text-gray-900 tracking-tighter leading-[0.9] mb-6">
            Most Loved <br /> <span className="text-gray-300">Dishes</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-500 font-light max-w-2xl">
            A collection of our most requested flavors and guest favorites.
          </p>
        </div>

        {/* Grid - 1 Col on Mobile, 2 Col on Desktop for Row Style Cards */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            {popularItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PremiumFoodCard dish={item} onAdd={addToCart} currency={currency} />
              </motion.div>
            ))}
          </div>

          {popularItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400 font-light italic">Currently updating our favorites...</p>
            </div>
          )}
        </div>

        {/* Floating Cart Button */}
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

// THE REDESIGNED HORIZONTAL CARD
function PremiumFoodCard({ dish, onAdd, currency = "SAR" }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-[3rem] p-3 md:p-5 flex items-center gap-6 md:gap-10 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-500 min-h-[160px] md:min-h-[220px]">

      {/* COLUMN 1: WIDE IMAGE */}
      <div className="relative h-32 w-32 md:h-48 md:w-56 flex-shrink-0 overflow-hidden rounded-[2.2rem] bg-gray-50">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 150px, 400px"
          />
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-4xl">🍽️</div>
        )}

        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full shadow-sm">
          <span className="text-[10px] font-medium uppercase tracking-widest text-gray-900">Popular</span>
        </div>
      </div>

      {/* COLUMN 2: CONTENT - START ALIGNED */}
      <div className="flex flex-col justify-between flex-grow min-w-0 h-full py-2">
        <div className="text-left">
          <h3 className="text-xl md:text-3xl font-light text-gray-900 mb-2 md:mb-3 line-clamp-1 leading-tight tracking-tight">
            {dish.name}
          </h3>
          {dish.description && (
            <p className="text-sm md:text-lg text-gray-500 font-light line-clamp-2 md:line-clamp-3 leading-relaxed">
              {dish.description}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col text-left">
            <span className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-[0.2em] mb-1">Price</span>
            <div className="flex items-baseline gap-1 md:gap-2">
              <span className="text-2xl md:text-4xl font-medium text-gray-900 leading-none tracking-tighter">
                {dish.price}
              </span>
              <span className="text-xs md:text-lg font-light text-gray-400">
                {currency}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onAdd(dish);
            }}
            className="h-14 w-14 md:h-16 md:w-16 bg-gray-900 text-white rounded-[1.8rem] flex items-center justify-center hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
          >
            <Plus size={28} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}