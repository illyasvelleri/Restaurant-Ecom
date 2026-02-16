// // app/user/combos/page.js → UPDATED 2025 (DYNAMIC CURRENCY FROM PUBLIC API)

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { ShoppingCart } from "lucide-react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import Footer from "../../components/footer";

// export default function CombosPage() {
//   const router = useRouter();
//   const [cart, setCart] = useState([]);
//   const [combos, setCombos] = useState([]);
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [currency, setCurrency] = useState("SAR"); // ← NEW: dynamic currency
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [comboRes, settingsRes] = await Promise.all([
//           fetch("/api/admin/combos"),
//           fetch("/api/restaurantDetails") // ← updated to public endpoint
//         ]);

//         if (comboRes.ok) {
//           const data = await comboRes.json();
//           const normalized = Array.isArray(data)
//             ? data.map(c => ({
//                 _id: c._id,
//                 name: c.title || "Unnamed Combo",
//                 price: c.price || 0,
//                 image: c.image || "",
//                 description: c.description || "",
//                 productIds: c.productIds || [],
//               }))
//             : [];
//           setCombos(normalized);
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
//         toast.error("Failed to load combos or settings");
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

//   const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

//   if (loading) return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <p className="text-2xl font-light text-gray-600 tracking-widest">Curating our best combos...</p>
//     </div>
//   );

//   return (
//     <>
//       <div className="min-h-screen bg-white py-28">

//         {/* LUXURY HEADER */}
//         <div className="border-b border-gray-100">
//           <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center">
//             <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-gray-900 tracking-tight leading-none">
//               Premium Combo Offers
//             </h1>
//             <p className="mt-6 text-xl lg:text-2xl text-gray-600 font-light tracking-wide">
//               Curated bundles for the ultimate experience
//             </p>
//           </div>
//         </div>

//         {/* SMOOTH ANIMATED LUXURY GRID */}
//         <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 lg:gap-14 xl:gap-16">
//             {combos.map((combo, index) => (
//               <motion.div
//                 key={combo._id}
//                 initial={{ opacity: 0, y: 60 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
//                 whileHover={{ y: -8 }}
//                 className="h-full"
//               >
//                 <PremiumComboCard combo={combo} onAdd={addToCart} currency={currency} />
//               </motion.div>
//             ))}
//           </div>

//           {combos.length === 0 && (
//             <div className="text-center py-40">
//               <p className="text-4xl text-gray-400 font-light">No combos available yet</p>
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

// // UPDATED PREMIUM COMBO CARD — now accepts currency prop
// function PremiumComboCard({ combo, onAdd, currency = "SAR" }) {
//   return (
//     <motion.div
//       whileHover={{ y: -8 }}
//       className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-full"
//     >
//       {/* Gold shimmer */}
//       <div className="absolute -inset-1 bg-gradient-to-br from-amber-200/30 via-orange-100/15 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 -z-10" />

//       {/* 4:3 Image */}
//       <div className="relative aspect-[4/3] overflow-hidden">
//         {combo.image ? (
//           <Image
//             src={combo.image}
//             alt={combo.title}
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
//               {combo.title}
//             </h3>
//             <p className="text-white/90 text-sm lg:text-base font-light leading-relaxed drop-shadow-lg mt-3 line-clamp-2">
//               {combo.description || "Premium curated combo"}
//             </p>
//           </div>

//           <div className="flex items-end justify-between">
//             <div>
//               <div className="text-3xl lg:text-4xl font-bold drop-shadow-2xl">
//                 {combo.price}
//               </div>
//               <div className="text-lg font-light text-white/90 drop-shadow">
//                 {currency} {/* ← DYNAMIC CURRENCY */}
//               </div>
//             </div>

//             <button
//               onClick={() => onAdd(combo)}
//               className="group/btn relative px-8 lg:px-10 py-4 bg-white text-gray-900 rounded-3xl font-bold text-base lg:text-lg hover:bg-gray-50 transition-all duration-500 flex items-center gap-3 overflow-hidden shadow-2xl"
//             >
//               <span className="relative z-10">Add to Cart</span>
//               <ShoppingCart className="w-6 h-6 relative z-10 group-hover/btn:translate-x-2 transition" />
//               <div className="absolute inset-0 bg-gradient-to-r from-amber-400/40 to-orange-500/40 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-600" />
//             </button>
//           </div>
//         </div>

//         {/* Combo Badge */}
//         <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full text-xs lg:text-sm font-bold shadow-2xl uppercase tracking-wider">
//           Combo Deal
//         </div>
//       </div>
//     </motion.div>
//   );
// }
// app/user/combos/page.js → CLEAN MODERN REDESIGN 2025

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CombosPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [combos, setCombos] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [currency, setCurrency] = useState("SAR");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [comboRes, settingsRes] = await Promise.all([
          fetch("/api/admin/combos"),
          fetch("/api/restaurantDetails")
        ]);

        if (comboRes.ok) {
          const data = await comboRes.json();
          const normalized = Array.isArray(data)
            ? data.map(c => ({
                _id: c._id,
                name: c.title || "Unnamed Combo",
                price: c.price || 0,
                image: c.image || "",
                description: c.description || "",
                productIds: c.productIds || [],
              }))
            : [];
          setCombos(normalized);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.whatsapp?.replace(/\D/g, "") || "";
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
          const fetchedCurrency = settings.currency || "SAR";
          setCurrency(fetchedCurrency);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load combos", {
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

    toast.success("Combo added to order", {
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

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base font-light text-gray-600 tracking-wide">
            Loading combo offers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16">

        {/* Clean Modern Header */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full tracking-widest mb-4">
                SPECIAL OFFERS
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 tracking-tight">
                Combo Deals
              </h1>
              <p className="text-base md:text-lg text-gray-300 font-light max-w-2xl mx-auto">
                Curated bundles for the ultimate dining experience at exceptional value
              </p>
              
              {/* Savings Badge */}
              <div className="mt-8 inline-block bg-white text-gray-900 px-6 md:px-8 py-3 md:py-4 rounded-full">
                <span className="text-sm md:text-base font-semibold">Save up to 30% with combos</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Combos Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {combos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg md:text-xl text-gray-400 font-light">No combo offers available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {combos.map((combo, index) => (
                <motion.div
                  key={combo._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <ModernComboCard 
                    combo={combo} 
                    onAdd={addToCart} 
                    currency={currency}
                    index={index}
                  />
                </motion.div>
              ))}
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

// Modern Combo Card - Clean & Responsive
function ModernComboCard({ combo, onAdd, currency = "SAR", index }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-200 hover:ring-gray-900 hover:shadow-lg transition-all duration-300 group">
      
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {combo.image ? (
          <Image
            src={combo.image}
            alt={combo.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-100 to-gray-50" />
        )}
        
        {/* Combo Badge */}
        <div className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          COMBO DEAL
        </div>

        {/* Items Count */}
        {combo.productIds && combo.productIds.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold">
            {combo.productIds.length} Items
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8">
        
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {combo.name}
        </h3>
        
        {/* Description */}
        {combo.description && (
          <p className="text-sm md:text-base text-gray-600 font-light mb-6 line-clamp-2">
            {combo.description}
          </p>
        )}

        {/* Price & Button Row */}
        <div className="flex items-end justify-between gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
              Combo Price
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-gray-900">
                {combo.price}
              </span>
              <span className="text-base md:text-lg text-gray-600 font-medium">
                {currency}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium mt-1 line-through">
              Was {(parseFloat(combo.price) * 1.3).toFixed(0)} {currency}
            </p>
          </div>

          <button
            onClick={() => onAdd(combo)}
            className="px-6 md:px-8 py-3 md:py-4 bg-gray-900 text-white text-sm md:text-base font-semibold rounded-xl hover:bg-gray-800 active:scale-95 transition-all duration-200 whitespace-nowrap"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}