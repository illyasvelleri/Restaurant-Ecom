// components/MainContent.js → UPDATED 2025 (DYNAMIC CURRENCY FROM PUBLIC API)

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { ShoppingCart, ChevronRight, Plus, Minus, X } from "lucide-react";

// export default function MainContent() {
//   const router = useRouter();
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);
//   const [specialDishes, setSpecialDishes] = useState([]);
//   const [popularDishes, setPopularDishes] = useState([]);
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [currency, setCurrency] = useState("SAR"); // ← NEW: dynamic currency
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [specialRes, popularRes, settingsRes] = await Promise.all([
//           fetch("/api/user/products"),
//           fetch("/api/user/popular"),
//           fetch("/api/restaurantDetails"), // ← changed to public endpoint (same as Footer)
//         ]);

//         if (specialRes.ok) {
//           const all = await specialRes.json();
//           const active = all.filter((p) => p.status === "active");
//           const shuffled = [...active].sort(() => Math.random() - 0.5);
//           setSpecialDishes(shuffled.slice(0, 8));
//         }

//         if (popularRes.ok) {
//           const data = await popularRes.json();
//           setPopularDishes(data.map((d) => d.product).slice(0, 8));
//         }

//         if (settingsRes.ok) {
//           const settings = await settingsRes.json();
//           // Get whatsapp (as before)
//           const wa = settings.whatsapp?.replace(/\D/g, "") || "";
//           if (wa) setWhatsappNumber(wa);

//           // Get currency from public settings
//           const fetchedCurrency = settings.currency || "SAR";
//           setCurrency(fetchedCurrency);
//         }
//       } catch (err) {
//         console.error("Failed to load data:", err);
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
//     setCart((prev) => {
//       const exists = prev.find((i) => i._id === item._id);
//       let newCart;

//       if (exists) {
//         newCart = prev.map((i) =>
//           i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       } else {
//         newCart = [...prev, { ...item, quantity: 1 }];
//       }

//       localStorage.setItem("cart", JSON.stringify(newCart));
//       return newCart;
//     });

//     toast.success("Added to order", {
//       style: { borderRadius: "24px", background: "#111", color: "#fff" },
//     });
//   };

//   const updateQty = (id, change) => {
//     setCart((prev) => {
//       const updated = prev
//         .map((i) => (i._id === id ? { ...i, quantity: i.quantity + change } : i))
//         .filter((i) => i.quantity > 0);

//       localStorage.setItem("cart", JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const total = cart
//     .reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0)
//     .toFixed(0);
//   const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <p className="text-2xl font-light text-gray-600 tracking-widest">
//           Preparing the finest selections...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Chef's Specials */}
//       {specialDishes.length > 0 && (
//         <section className="py-24 lg:py-32">
//           <div className="max-w-7xl mx-auto px-6">
//             <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20 text-gray-900 tracking-tight">
//               Chef's Specials
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-12">
//               {specialDishes.map((dish) => (
//                 <PremiumFoodCard
//                   key={dish._id}
//                   dish={dish}
//                   onAdd={addToCart}
//                   currency={currency} // ← pass currency to card
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Currently Craved */}
//       {popularDishes.length > 0 && (
//         <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
//           <div className="max-w-7xl mx-auto px-6">
//             <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20 text-gray-900 tracking-tight">
//               Currently Craved
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-12">
//               {popularDishes.map((dish) => (
//                 <PremiumFoodCard
//                   key={dish._id}
//                   dish={dish}
//                   onAdd={addToCart}
//                   isPopular
//                   currency={currency} // ← pass currency to card
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Final CTA */}
//       <div className="py-24 lg:py-32 text-center">
//         <Link
//           href="/user/menu"
//           className="group inline-flex items-center gap-4 px-16 py-6 lg:px-20 lg:py-8 bg-gray-900 text-white rounded-full text-xl lg:text-2xl font-medium shadow-2xl hover:shadow-amber-600/30 transform hover:scale-105 transition-all duration-700"
//         >
//           View Full Menu
//           <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition duration-500" />
//         </Link>
//       </div>

//       {/* Floating Cart Button */}
//       {cartCount > 0 && (
//         <button
//           onClick={() => router.push("/user/cart")}
//           className="fixed bottom-28 right-6 z-50 bg-gray-900 text-white p-5 lg:p-7 rounded-full shadow-2xl hover:shadow-amber-600/40 hover:scale-110 transition-all duration-500 flex items-center gap-4"
//         >
//           <ShoppingCart size={28} />
//           <span className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium shadow-xl">
//             {cartCount}
//           </span>
//         </button>
//       )}
//     </div>
//   );
// }
// // UPDATED PREMIUM FOOD CARD — ALL CONTENT INSIDE IMAGE, 2 PER ROW MOBILE
// function PremiumFoodCard({ dish, onAdd, isPopular = false, currency = "SAR" }) {
//   return (
//     <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
//       {/* Image – Hero with strong overlay */}
//       <div className="relative aspect-[4/3] overflow-hidden">
//         {dish.image ? (
//           <>
//             <Image
//               src={dish.image}
//               alt={dish.name}
//               fill
//               className="object-cover transition-transform duration-700 group-hover:scale-105"
//               sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//               priority
//             />

//             {/* Dark gradient overlay for text readability */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

//             {/* Popular badge (top-right) */}
//             {isPopular && (
//               <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
//                 Most Craved
//               </div>
//             )}

//             {/* ALL CONTENT INSIDE IMAGE – bottom aligned */}
//             <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
//               {/* Dish Name – big & bold */}
//               <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight line-clamp-2 mb-1.5 drop-shadow-lg">
//                 {dish.name}
//               </h3>

//               {/* Description – light, elegant, short */}
//               {dish.description && (
//                 <p className="text-sm sm:text-base text-white/90 font-light leading-snug line-clamp-2 mb-3 drop-shadow">
//                   {dish.description}
//                 </p>
//               )}

//               {/* Price + Currency + Add Button – clean row */}
//               <div className="flex items-center justify-between">
//                 {/* Price – large & prominent */}
//                 <div className="flex items-baseline gap-1.5">
//                   <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow-lg">
//                     {dish.price}
//                   </span>
//                   <span className="text-base sm:text-lg font-medium text-white/90 drop-shadow">
//                     {currency}
//                   </span>
//                 </div>

//                 {/* Add Button – bold, white, rounded */}
//                 <button
//                   onClick={() => onAdd(dish)}
//                   className="bg-white text-gray-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-100 active:scale-95 transition shadow-lg flex items-center gap-2"
//                 >
//                   Add
//                   <Plus size={18} className="sm:size-20" />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
//             🍲
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }










"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ChevronRight, Plus, ShoppingBag } from "lucide-react";

export default function MainContent() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [specialDishes, setSpecialDishes] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [currency, setCurrency] = useState("SAR");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [specialRes, popularRes, settingsRes] = await Promise.all([
          fetch("/api/user/products"),
          fetch("/api/user/popular"),
          fetch("/api/restaurantDetails"),
        ]);

        if (specialRes.ok) {
          const all = await specialRes.json();
          const active = all.filter((p) => p.status === "active");
          setSpecialDishes(active.sort(() => Math.random() - 0.5).slice(0, 8));
        }

        if (popularRes.ok) {
          const data = await popularRes.json();
          // Added safety: filter out null products
          const items = Array.isArray(data) 
            ? data.filter(d => d.product).map((d) => d.product).slice(0, 4) 
            : [];
          setPopularDishes(items); 
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setCurrency(settings.currency || "SAR");
        }
      } catch (err) {
        console.error("Failed to load data:", err);
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
        console.error("Cart parse error");
      }
    }
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      const newCart = exists 
        ? prev.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    toast.success("Added to order", {
      style: { borderRadius: "24px", background: "#111", color: "#fff", fontSize: "14px" },
    });
  };

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl font-light text-gray-400 tracking-[0.3em] animate-pulse">
          PREPARING...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {specialDishes.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 pt-24">
            <h2 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight tracking-tight mb-12">
              Chef's Specials
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              {specialDishes.map((dish) => (
                <PremiumFoodCard key={dish._id} dish={dish} onAdd={addToCart} currency={currency} />
              ))}
            </div>
          </div>
        </section>
      )}

      {popularDishes.length > 0 && (
        <section className="py-20 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight tracking-tight mb-12 text-left">
              Currently Craved
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              {popularDishes.map((dish) => (
                <PremiumFoodCard 
                  key={dish._id} 
                  dish={dish} 
                  onAdd={addToCart} 
                  currency={currency} 
                  isPopular 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="py-32 text-center">
        <Link
          href="/user/menu"
          className="group inline-flex items-center gap-6 px-12 py-6 bg-black text-white rounded-full text-xl font-bold hover:scale-105 transition-transform duration-500 shadow-2xl"
        >
          Explore Full Menu
          <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </Link>
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

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function PremiumFoodCard({ dish, onAdd, currency = "SAR", isPopular = false }) {
  if (!dish) return null; // Safety check
  return (
    <div className="group bg-white border border-gray-100 rounded-[3rem] p-3 md:p-5 flex items-center gap-6 md:gap-10 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-500 min-h-[160px] md:min-h-[220px]">
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
        {isPopular && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full shadow-sm">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-900">Popular</span>
          </div>
        )}
      </div>

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
// components/MainContent.js → PERFECT FINAL VERSION 2025

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import toast from "react-hot-toast";

// export default function MainContent() {
//   const router = useRouter();
//   const [cart, setCart] = useState([]);
//   const [specialDishes, setSpecialDishes] = useState([]);
//   const [popularDishes, setPopularDishes] = useState([]);
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [currency, setCurrency] = useState("SAR");
//   const [loading, setLoading] = useState(true);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   // Banner slides
//   const bannerSlides = [
//     {
//       title: "Fresh Daily",
//       subtitle: "Premium ingredients delivered every morning",
//       bgColor: "from-gray-900 to-gray-800"
//     },
//     {
//       title: "Fast Delivery",
//       subtitle: "Hot meals in 20-30 minutes",
//       bgColor: "from-gray-800 to-gray-900"
//     },
//     {
//       title: "Chef's Special",
//       subtitle: "Exclusive dishes crafted with passion",
//       bgColor: "from-gray-900 to-black"
//     }
//   ];

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [specialRes, popularRes, settingsRes] = await Promise.all([
//           fetch("/api/user/products"),
//           fetch("/api/user/popular"),
//           fetch("/api/restaurantDetails"),
//         ]);

//         if (specialRes.ok) {
//           const all = await specialRes.json();
//           const active = all.filter((p) => p.status === "active");
//           const shuffled = [...active].sort(() => Math.random() - 0.5);
//           setSpecialDishes(shuffled.slice(0, 9));
//         }

//         if (popularRes.ok) {
//           const data = await popularRes.json();
//           setPopularDishes(data.map((d) => d.product).slice(0, 8));
//         }

//         if (settingsRes.ok) {
//           const settings = await settingsRes.json();
//           const wa = settings.whatsapp?.replace(/\D/g, "") || "";
//           if (wa) setWhatsappNumber(wa);
//           const fetchedCurrency = settings.currency || "SAR";
//           setCurrency(fetchedCurrency);
//         }
//       } catch (err) {
//         console.error("Failed to load data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();

//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) {
//       try {
//         setCart(JSON.parse(savedCart));
//       } catch (e) {
//         setCart([]);
//       }
//     }
//   }, []);

//   // Auto carousel
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
//     }, 4000);
//     return () => clearInterval(timer);
//   }, []);

//   const addToCart = (item) => {
//     setCart((prev) => {
//       const exists = prev.find((i) => i._id === item._id);
//       let newCart;

//       if (exists) {
//         newCart = prev.map((i) =>
//           i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       } else {
//         newCart = [...prev, { ...item, quantity: 1 }];
//       }

//       localStorage.setItem("cart", JSON.stringify(newCart));
//       return newCart;
//     });

//     toast.success("Added to order", {
//       style: { 
//         borderRadius: "12px", 
//         background: "#1a1a1a", 
//         color: "#fff",
//         padding: "16px 24px",
//         fontSize: "15px",
//         fontWeight: "500"
//       },
//     });
//   };

//   const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0).toFixed(0);
//   const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-base font-light text-gray-600 tracking-wide">
//             Loading menu...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
      
//       {/* Auto Carousel Banner */}
//       <div className="px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
//         <div className="max-w-7xl mx-auto relative h-48 md:h-56 lg:h-64 overflow-hidden rounded-2xl">
//           {bannerSlides.map((slide, index) => (
//             <div
//               key={index}
//               className={`absolute inset-0 transition-opacity duration-1000 ${
//                 index === currentSlide ? 'opacity-100' : 'opacity-0'
//               }`}
//             >
//               <div className={`h-full bg-gradient-to-r ${slide.bgColor} flex items-center justify-center rounded-2xl`}>
//                 <div className="text-center text-white px-6">
//                   <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-2 md:mb-3">
//                     {slide.title}
//                   </h2>
//                   <p className="text-sm md:text-base lg:text-lg font-light text-gray-300">
//                     {slide.subtitle}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {/* Carousel Indicators */}
//           <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
//             {bannerSlides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentSlide(index)}
//                 className={`h-1.5 rounded-full transition-all ${
//                   index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-1.5'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Chef's Specials - 3 per row mobile */}
//       {specialDishes.length > 0 && (
//         <section className="py-10 md:py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="mb-6 md:mb-8">
//               <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">
//                 Chef's Specials
//               </h2>
//               <div className="w-14 h-0.5 bg-gray-900 mt-3"></div>
//             </div>

//             {/* Grid: 3 columns mobile, 4 columns desktop */}
//             <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
//               {specialDishes.map((dish) => (
//                 <SpecialFoodCard
//                   key={dish._id}
//                   dish={dish}
//                   onAdd={addToCart}
//                   currency={currency}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Popular Selections - 2 per row, vertical list */}
//       {popularDishes.length > 0 && (
//         <section className="py-10 md:py-12 bg-gray-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="mb-6 md:mb-8">
//               <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">
//                 Popular Selections
//               </h2>
//               <div className="w-14 h-0.5 bg-gray-900 mt-3"></div>
//             </div>

//             {/* Grid: 2 columns ALL screens */}
//             <div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-6">
//               {popularDishes.map((dish) => (
//                 <PopularFoodCard
//                   key={dish._id}
//                   dish={dish}
//                   onAdd={addToCart}
//                   currency={currency}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* View Full Menu CTA */}
//       <div className="py-14 md:py-16 text-center">
//         <Link
//           href="/user/menu"
//           className="inline-block px-12 md:px-16 py-5 md:py-6 bg-gray-900 text-white text-base md:text-lg font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300 rounded-full shadow-sm"
//         >
//           View Full Menu
//         </Link>
//       </div>

//       {/* Floating Cart Button */}
//       {cartCount > 0 && (
//         <button
//           onClick={() => router.push("/user/cart")}
//           className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-gray-900 text-white w-14 h-14 md:w-16 md:h-16 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center justify-center shadow-lg"
//         >
//           <svg 
//             className="w-6 h-6 md:w-7 md:h-7" 
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path 
//               strokeLinecap="round" 
//               strokeLinejoin="round" 
//               strokeWidth={1.5} 
//               d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
//             />
//           </svg>
//           <span className="absolute -top-2 -right-2 bg-gray-900 text-white w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold border-2 border-white">
//             {cartCount}
//           </span>
//         </button>
//       )}
//     </div>
//   );
// }

// // Special Food Card - EVERYTHING ON IMAGE
// function SpecialFoodCard({ dish, onAdd, currency = "SAR" }) {
//   return (
//     <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      
//       {/* Image with ALL content overlay */}
//       <div className="relative aspect-square overflow-hidden bg-gray-50">
//         {dish.image ? (
//           <>
//             <Image
//               src={dish.image}
//               alt={dish.name}
//               fill
//               className="object-cover transition-transform duration-700 group-hover:scale-110"
//               sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
//             />
//             {/* Strong Dark Gradient */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
//             {/* ALL Content ON Image */}
//             <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-between">
              
//               {/* Top: Name */}
//               <div>
//                 <h3 className="text-sm md:text-base lg:text-lg font-bold text-white line-clamp-1 leading-tight">
//                   {dish.name}
//                 </h3>
//               </div>

//               {/* Bottom: Description, Price & Button */}
//               <div>
//                 {dish.description && (
//                   <p className="text-[10px] md:text-xs text-white/90 font-normal line-clamp-1 leading-tight mb-2">
//                     {dish.description}
//                   </p>
//                 )}
                
//                 <div className="flex items-end justify-between gap-2">
//                   <div>
//                     <div className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-none">
//                       {dish.price}
//                     </div>
//                     <div className="text-[10px] md:text-xs text-white/80 font-medium">
//                       {currency}
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => onAdd(dish)}
//                     className="px-3 md:px-4 py-1.5 md:py-2 bg-white text-gray-900 text-[10px] md:text-xs font-bold rounded-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 whitespace-nowrap shadow-md"
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="h-full bg-gradient-to-br from-gray-100 to-gray-50" />
//         )}
//       </div>
//     </div>
//   );
// }

// // Popular Food Card - 2 per row, larger cards
// function PopularFoodCard({ dish, onAdd, currency = "SAR" }) {
//   return (
//     <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      
//       {/* Image with ALL content overlay */}
//       <div className="relative aspect-square overflow-hidden bg-gray-50">
//         {dish.image ? (
//           <>
//             <Image
//               src={dish.image}
//               alt={dish.name}
//               fill
//               className="object-cover transition-transform duration-700 group-hover:scale-110"
//               sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//             />
//             {/* Strong Dark Gradient */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
//             {/* Popular Badge */}
//             <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
//               ★ Popular
//             </div>
            
//             {/* ALL Content ON Image */}
//             <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-between">
              
//               {/* Top: Name */}
//               <div>
//                 <h3 className="text-base md:text-lg lg:text-xl font-bold text-white line-clamp-2 leading-tight">
//                   {dish.name}
//                 </h3>
//               </div>

//               {/* Bottom: Description, Price & Button */}
//               <div>
//                 {dish.description && (
//                   <p className="text-xs md:text-sm text-white/95 font-normal line-clamp-2 leading-relaxed mb-3">
//                     {dish.description}
//                   </p>
//                 )}
                
//                 <div className="flex items-end justify-between gap-3">
//                   <div>
//                     <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-none">
//                       {dish.price}
//                     </div>
//                     <div className="text-xs md:text-sm text-white/90 font-medium">
//                       {currency}
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => onAdd(dish)}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-white text-gray-900 text-xs md:text-sm font-bold rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200 whitespace-nowrap shadow-lg"
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="h-full bg-gradient-to-br from-gray-100 to-gray-50" />
//         )}
//       </div>
//     </div>
//   );
// }


// // components/MainContent.js → PREMIUM REDESIGN 2025

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import toast from "react-hot-toast";

// export default function MainContent() {
//   const router = useRouter();
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);
//   const [specialDishes, setSpecialDishes] = useState([]);
//   const [popularDishes, setPopularDishes] = useState([]);
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [currency, setCurrency] = useState("SAR");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [specialRes, popularRes, settingsRes] = await Promise.all([
//           fetch("/api/user/products"),
//           fetch("/api/user/popular"),
//           fetch("/api/restaurantDetails"),
//         ]);

//         if (specialRes.ok) {
//           const all = await specialRes.json();
//           const active = all.filter((p) => p.status === "active");
//           const shuffled = [...active].sort(() => Math.random() - 0.5);
//           setSpecialDishes(shuffled.slice(0, 8));
//         }

//         if (popularRes.ok) {
//           const data = await popularRes.json();
//           setPopularDishes(data.map((d) => d.product).slice(0, 8));
//         }

//         if (settingsRes.ok) {
//           const settings = await settingsRes.json();
//           const wa = settings.whatsapp?.replace(/\D/g, "") || "";
//           if (wa) setWhatsappNumber(wa);
//           const fetchedCurrency = settings.currency || "SAR";
//           setCurrency(fetchedCurrency);
//         }
//       } catch (err) {
//         console.error("Failed to load data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();

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
//     setCart((prev) => {
//       const exists = prev.find((i) => i._id === item._id);
//       let newCart;

//       if (exists) {
//         newCart = prev.map((i) =>
//           i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       } else {
//         newCart = [...prev, { ...item, quantity: 1 }];
//       }

//       localStorage.setItem("cart", JSON.stringify(newCart));
//       return newCart;
//     });

//     toast.success("Added to order", {
//       style: { 
//         borderRadius: "12px", 
//         background: "#1a1a1a", 
//         color: "#fff",
//         padding: "16px 24px",
//         fontSize: "15px",
//         fontWeight: "500"
//       },
//     });
//   };

//   const updateQty = (id, change) => {
//     setCart((prev) => {
//       const updated = prev
//         .map((i) => (i._id === id ? { ...i, quantity: i.quantity + change } : i))
//         .filter((i) => i.quantity > 0);

//       localStorage.setItem("cart", JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const total = cart
//     .reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0)
//     .toFixed(0);
//   const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-base font-light text-gray-600 tracking-wide">
//             Loading menu...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Chef's Specials */}
//       {specialDishes.length > 0 && (
//         <section className="py-16 md:py-20 lg:py-28">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12 md:mb-16">
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight mb-3">
//                 Chef's Specials
//               </h2>
//               <div className="w-16 h-0.5 bg-gray-900 mx-auto"></div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
//               {specialDishes.map((dish) => (
//                 <PremiumFoodCard
//                   key={dish._id}
//                   dish={dish}
//                   onAdd={addToCart}
//                   currency={currency}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Currently Craved */}
//       {popularDishes.length > 0 && (
//         <section className="py-16 md:py-20 lg:py-28 bg-gray-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12 md:mb-16">
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight mb-3">
//                 Popular Selections
//               </h2>
//               <div className="w-16 h-0.5 bg-gray-900 mx-auto"></div>
//             </div>
            
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
//               {popularDishes.map((dish) => (
//                 <PremiumFoodCard
//                   key={dish._id}
//                   dish={dish}
//                   onAdd={addToCart}
//                   isPopular
//                   currency={currency}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* View Full Menu CTA */}
//       <div className="py-16 md:py-20 lg:py-24 text-center">
//         <Link
//           href="/user/menu"
//           className="inline-block px-10 md:px-14 lg:px-16 py-4 md:py-5 bg-gray-900 text-white text-base md:text-lg font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300"
//         >
//           View Full Menu
//         </Link>
//       </div>

//       {/* Floating Cart Button */}
//       {cartCount > 0 && (
//         <button
//           onClick={() => router.push("/user/cart")}
//           className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-gray-900 text-white w-14 h-14 md:w-16 md:h-16 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center justify-center shadow-lg"
//         >
//           <svg 
//             className="w-6 h-6 md:w-7 md:h-7" 
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path 
//               strokeLinecap="round" 
//               strokeLinejoin="round" 
//               strokeWidth={1.5} 
//               d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
//             />
//           </svg>
//           <span className="absolute -top-2 -right-2 bg-gray-900 text-white w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs md:text-sm font-medium border-2 border-white">
//             {cartCount}
//           </span>
//         </button>
//       )}
//     </div>
//   );
// }

// // Premium Food Card Component
// function PremiumFoodCard({ dish, onAdd, isPopular = false, currency = "SAR" }) {
//   return (
//     <div className="group bg-white border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-300">
//       {/* Image Container */}
//       <div className="relative aspect-square overflow-hidden bg-gray-50">
//         {dish.image ? (
//           <Image
//             src={dish.image}
//             alt={dish.name}
//             fill
//             className="object-cover transition-transform duration-700 group-hover:scale-105"
//             sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
//             priority
//           />
//         ) : (
//           <div className="h-full bg-gradient-to-br from-gray-100 to-gray-50" />
//         )}
        
//         {isPopular && (
//           <div className="absolute top-3 right-3 bg-gray-900 text-white text-xs font-medium px-3 py-1 tracking-wide">
//             POPULAR
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="p-4 md:p-5">
//         <h3 className="text-sm md:text-base lg:text-lg font-medium text-gray-900 mb-2 line-clamp-2 leading-snug">
//           {dish.name}
//         </h3>

//         {dish.description && (
//           <p className="text-xs md:text-sm text-gray-500 font-light mb-3 md:mb-4 line-clamp-2 leading-relaxed">
//             {dish.description}
//           </p>
//         )}

//         {/* Price and Add Button */}
//         <div className="flex items-center justify-between gap-3">
//           <div>
//             <div className="text-lg md:text-xl lg:text-2xl font-medium text-gray-900">
//               {dish.price}
//             </div>
//             <div className="text-xs md:text-sm text-gray-500 font-light">
//               {currency}
//             </div>
//           </div>

//           <button
//             onClick={() => onAdd(dish)}
//             className="px-4 md:px-5 lg:px-6 py-2 md:py-2.5 bg-gray-900 text-white text-xs md:text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300 whitespace-nowrap"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

