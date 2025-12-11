// // components/MainContent.js → ULTRA PREMIUM BLACK & WHITE HOMEPAGE 2025
// // Mobile-first • Pure monochrome • Michelin-level elegance

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { ShoppingCart, ChevronRight, Send, Plus, Minus, X } from "lucide-react";

// export default function MainContent() {
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);
//   const [specialDishes, setSpecialDishes] = useState([]);
//   const [popularDishes, setPopularDishes] = useState([]);
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [specialRes, popularRes, settingsRes] = await Promise.all([
//           fetch("/api/user/products"),
//           fetch("/api/user/popular"),
//           fetch("/api/admin/settings"),
//         ]);

//         if (specialRes.ok) {
//           const all = await specialRes.json();
//           const active = all.filter((p) => p.status === "active");
//           const shuffled = [...active].sort(() => Math.random() - 0.5);
//           setSpecialDishes(shuffled.slice(0, 6)); // Show more on mobile
//         }

//         if (popularRes.ok) {
//           const data = await popularRes.json();
//           setPopularDishes(data.map((d) => d.product).slice(0, 6));
//         }

//         if (settingsRes.ok) {
//           const settings = await settingsRes.json();
//           const wa = settings.restaurant?.whatsapp?.replace(/\D/g, "") || "";
//           if (wa) setWhatsappNumber(wa);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const addToCart = (item) => {
//     setCart((prev) => {
//       const exists = prev.find((i) => i._id === item._id);
//       if (exists) {
//         return prev.map((i) =>
//           i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       }
//       return [...prev, { ...item, quantity: 1 }];
//     });
//     toast("Added", {
//       icon: "Success",
//       style: { background: "#000", color: "#fff", borderRadius: "24px" },
//     });
//   };

//   const updateQty = (id, change) => {
//     setCart((prev) =>
//       prev
//         .map((i) => (i._id === id ? { ...i, quantity: i.quantity + change } : i))
//         .filter((i) => i.quantity > 0)
//     );
//   };

//   const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0).toFixed(0);
//   const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

//   const sendOrder = () => {
//     if (cart.length === 0) return toast.error("Cart is empty");
//     if (!whatsappNumber) return toast.error("WhatsApp not configured");

//     const items = cart.map((i) => `${i.quantity}× ${i.name}`).join("%0A");
//     const msg = encodeURIComponent(`*New Order*\n\n${items}\n\n*Total: ${total} SAR*`);
//     window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
//     toast.success("Order sent");
//     setCart([]);
//     setShowCart(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <p className="text-white/50 text-xl tracking-widest">Curating excellence...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-black text-white">

//         {/* Hero Header */}
//         <div className="pt-24 pb-32 px-6 text-center">
//           <h1 className="text-5xl md:text-7xl font-light tracking-wider mb-6">
//             Culinary <span className="font-medium">Artistry</span>
//           </h1>
//           <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
//             Every plate is a masterpiece. Every bite, an experience.
//           </p>
//           <Link
//             href="/user/menu"
//             className="inline-flex items-center gap-4 mt-12 px-12 py-6 bg-white text-black rounded-full font-medium text-lg hover:bg-white/10 hover:bg-white/20 transition"
//           >
//             Explore Menu
//             <ChevronRight size={24} />
//           </Link>
//         </div>

//         {/* Special Dishes Today */}
//         {specialDishes.length > 0 && (
//           <section className="py-20 border-t border-white/10">
//             <div className="max-w-7xl mx-auto px-6">
//               <h2 className="text-4xl md:text-5xl font-light text-center mb-16 tracking-wider">
//                 Chef's <span className="font-medium">Specials</span>
//               </h2>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//                 {specialDishes.map((dish) => (
//                   <DishCard key={dish._id} dish={dish} onAdd={addToCart} />
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Popular Selection */}
//         {popularDishes.length > 0 && (
//           <section className="py-20 border-t border-white/10">
//             <div className="max-w-7xl mx-auto px-6">
//               <h2 className="text-4xl md:text-5xl font-light text-center mb-16 tracking-wider">
//                 Currently <span className="font-medium">Craved</span>
//               </h2>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//                 {popularDishes.map((dish) => (
//                   <DishCard key={dish._id} dish={dish} onAdd={addToCart} isPopular />
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* CTA Footer */}
//         <div className="py-24 text-center border-t border-white/10">
//           <Link
//             href="/user/menu"
//             className="inline-flex items-center gap-4 px-16 py-6 bg-white text-black rounded-full text-xl font-medium hover:bg-gray-100 transition"
//           >
//             View Full Menu
//             <ChevronRight size={28} />
//           </Link>
//         </div>

//         {/* Floating Cart Button */}
//         {cartCount > 0 && (
//           <button
//             onClick={() => setShowCart(true)}
//             className="fixed bottom-8 right-8 z-50 bg-white text-black p-7 rounded-full shadow-2xl hover:scale-110 transition-all"
//           >
//             <ShoppingCart size={32} />
//             <span className="absolute -top-4 -right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium">
//               {cartCount}
//             </span>
//           </button>
//         )}

//         {/* Cart Bottom Sheet */}
//         {showCart && (
//           <div className="fixed inset-0 bg-black/90 z-50 flex items-end">
//             <div className="bg-black border-t border-white/10 w-full max-w-2xl mx-auto rounded-t-3xl">
//               <div className="flex justify-between items-center p-8 border-b border-white/10">
//                 <h2 className="text-2xl font-light">Your Order ({cartCount})</h2>
//                 <button onClick={() => setShowCart(false)} className="p-3 hover:bg-white/10 rounded-xl transition">
//                   <X size={28} />
//                 </button>
//               </div>

//               <div className="p-8 space-y-6 max-h-96 overflow-y-auto">
//                 {cart.map((item) => (
//                   <div key={item._id} className="flex justify-between items-center border-b border-white/5 pb-6">
//                     <div>
//                       <p className="text-lg font-medium">{item.quantity}× {item.name}</p>
//                       <p className="text-white/50">{item.price} SAR each</p>
//                     </div>
//                     <div className="flex items-center gap-5">
//                       <button onClick={() => updateQty(item._id, -1)} className="w-12 h-12 rounded-full border border-white/20 hover:bg-white/10 transition">
//                         <Minus size={20} />
//                       </button>
//                       <span className="w-16 text-center text-xl">{item.quantity}</span>
//                       <button onClick={() => updateQty(item._id, 1)} className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-200 transition">
//                         <Plus size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="p-8 border-t border-white/10">
//                 <div className="flex justify-between text-3xl font-light mb-10">
//                   <span>Total</span>
//                   <span>{total} SAR</span>
//                 </div>
//                 <button
//                   onClick={sendOrder}
//                   className="w-full py-6 bg-white text-black rounded-3xl font-medium hover:bg-gray-100 transition text-lg"
//                 >
//                   Send Order via WhatsApp
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// // Premium Dish Card — No ratings, no timers, pure elegance
// function DishCard({ dish, onAdd, isPopular = false }) {
//   return (
//     <div className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500">
//       <div className="relative h-80 overflow-hidden">
//         {dish.image ? (
//           <Image
//             src={dish.image}
//             alt={dish.name}
//             fill
//             className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
//           />
//         ) : (
//           <div className="h-full bg-gradient-to-br from-zinc-900 to-black" />
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

//         {isPopular && (
//           <div className="absolute top-8 left-8 bg-white text-black px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
//             Craved
//           </div>
//         )}
//       </div>

//       <div className="p-10">
//         <h3 className="text-2xl font-medium mb-4">{dish.name}</h3>
//         <p className="text-white/60 text-base leading-relaxed mb-10">
//           {dish.description || "Crafted with intention and served with passion"}
//         </p>

//         <div className="flex items-center justify-between">
//           <div className="text-4xl font-light tracking-tight">
//             {dish.price} <span className="text-white/40 text-xl">SAR</span>
//           </div>

//           <button
//             onClick={() => onAdd(dish)}
//             className="px-10 py-5 bg-white text-black rounded-3xl font-medium hover:bg-gray-100 transition flex items-center gap-3"
//           >
//             <ShoppingCart size={22} />
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/MainContent.js → FINAL 2025 LUXURY HOMEPAGE WITH SLOW PARALLAX HERO

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { ShoppingCart, ChevronRight, Send, Plus, Minus, X } from "lucide-react";

export default function MainContent() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [specialDishes, setSpecialDishes] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [specialRes, popularRes, settingsRes] = await Promise.all([
          fetch("/api/user/products"),
          fetch("/api/user/popular"),
          fetch("/api/admin/settings"),
        ]);

        if (specialRes.ok) {
          const all = await specialRes.json();
          const active = all.filter((p) => p.status === "active");
          const shuffled = [...active].sort(() => Math.random() - 0.5);
          setSpecialDishes(shuffled.slice(0, 8));
        }

        if (popularRes.ok) {
          const data = await popularRes.json();
          setPopularDishes(data.map((d) => d.product).slice(0, 8));
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const wa = settings.restaurant?.whatsapp?.replace(/\D/g, "") || "";
          if (wa) setWhatsappNumber(wa);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success("Added to cart");
  };

  const updateQty = (id, change) => {
    setCart((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity + change } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0).toFixed(0);
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  const sendOrder = () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (!whatsappNumber) return toast.error("WhatsApp not configured");

    const items = cart.map((i) => `${i.quantity}× ${i.name}`).join("%0A");
    const msg = encodeURIComponent(`*New Order*\n\n${items}\n\n*Total: ${total} SAR*`);
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
    toast.success("Order sent");
    setCart([]);
    setShowCart(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-2xl font-light text-gray-600 tracking-widest">Preparing the finest selections...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Chef's Specials */}
      {specialDishes.length > 0 && (
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20 text-gray-900 tracking-tight">
              Chef's Specials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-12">
              {specialDishes.map(dish => <PremiumFoodCard key={dish._id} dish={dish} onAdd={addToCart} />)}
            </div>
          </div>
        </section>
      )}

      {/* Currently Craved */}
      {popularDishes.length > 0 && (
        <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20 text-gray-900 tracking-tight">
              Currently Craved
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-12">
              {popularDishes.map((dish) => (
                <PremiumFoodCard key={dish._id} dish={dish} onAdd={addToCart} isPopular />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <div className="py-24 lg:py-32 text-center">
        <Link
          href="/user/menu"
          className="group inline-flex items-center gap-4 px-16 py-6 lg:px-20 lg:py-8 bg-gray-900 text-white rounded-full text-xl lg:text-2xl font-medium shadow-2xl hover:shadow-amber-600/30 transform hover:scale-105 transition-all duration-700"
        >
          View Full Menu
          <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition duration-500" />
        </Link>
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white p-5 lg:p-7 rounded-full shadow-2xl hover:shadow-amber-600/40 hover:scale-110 transition-all duration-500 flex items-center gap-4"
        >
          <ShoppingCart size={28} />
          <span className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium shadow-xl">
            {cartCount}
          </span>
        </button>
      )}

      {/* Cart Bottom Sheet */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-w-2xl mx-auto rounded-t-3xl shadow-2xl overflow-hidden">
            <div className="p-6 lg:p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Your Order ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X size={32} />
              </button>
            </div>
            <div className="p-6 lg:p-8 max-h-96 overflow-y-auto space-y-6">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-6 bg-gray-50 p-6 rounded-3xl">
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">{item.quantity}× {item.name}</h4>
                    <p className="text-gray-600 mt-1">{item.price} SAR each</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => updateQty(item._id, -1)} className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-900 transition">
                      <Minus size={20} />
                    </button>
                    <span className="text-2xl font-bold w-16 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, 1)} className="w-12 h-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 lg:p-8 border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white">
              <div className="flex justify-between text-3xl font-bold mb-8 text-gray-900">
                <span>Total</span>
                <span>{total} SAR</span>
              </div>
              <button
                onClick={sendOrder}
                className="w-full py-6 lg:py-7 bg-gray-900 text-white rounded-3xl font-bold text-xl hover:bg-gray-800 transition shadow-xl"
              >
                Send Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// 2025 ULTRA-LUXURY CARD — EXACT 4:3 IMAGE RATIO
// 2025 PRO-LEVEL LUXURY CARD — CONTENT OVER IMAGE


// ULTRA-PREMIUM 2025 FOOD CARD — PERFECTED FOR ALL DEVICES
// FINAL 2025 LUXURY FOOD CARD — PERFECT ON EVERY DEVICE
function PremiumFoodCard({ dish, onAdd, isPopular = false }) {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700">
      {/* Gold shimmer on hover */}
      <div className="absolute -inset-1 bg-gradient-to-br from-amber-200/25 via-orange-100/15 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* 4:3 Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-1200 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width:1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}

        {/* Smart overlay — works on dark & light images */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* CONTENT — Top + Bottom only */}
        <div className="absolute inset-0 flex flex-col justify-between">

          {/* TOP: Name + Badge + Short Description */}
          <div className="p-5 lg:p-7">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white drop-shadow-2xl leading-tight max-w-[75%]">
                {dish.name}
              </h3>
              {isPopular && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs lg:text-sm font-bold px-3.5 py-1.5 rounded-full shadow-xl uppercase tracking-wider">
                  Most Craved
                </span>
              )}
            </div>

            {/* Concise description — always visible, never hidden */}
            <p className="text-white/90 text-sm lg:text-base font-light leading-snug drop-shadow-md">
              {dish.description || "Premium ingredients, exceptional taste"}
            </p>
          </div>

          {/* BOTTOM: Price + Perfect Add Button */}
          <div className="px-5 lg:px-7 pb-5 lg:pb-7">
            <div className="flex items-center justify-between">
              {/* Price */}
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white drop-shadow-2xl">
                  {dish.price}
                </div>
                <div className="text-lg text-white/80 font-light drop-shadow">SAR</div>
              </div>

              {/* PERFECT ADD TO CART BUTTON — Zomato/Talabat Style */}
              <button
                onClick={() => onAdd(dish)}
                className="group/btn relative flex items-center gap-2.5 px-7 lg:px-9 py-4 bg-white text-gray-900 rounded-2xl font-bold text-base lg:text-lg hover:bg-gray-50 transition-all duration-400 shadow-xl overflow-hidden"
              >
                <span className="relative z-10">Add</span>
                <Plus className="w-5 h-5 lg:w-6 lg:h-6 relative z-10 transition group-hover/btn:scale-110" />
                
                {/* Gold flash effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/40 to-orange-500/40 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}