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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          setSpecialDishes(shuffled.slice(0, 6));
        }

        if (popularRes.ok) {
          const data = await popularRes.json();
          setPopularDishes(data.map((d) => d.product).slice(0, 6));
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
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast("Added", {
      icon: "Success",
      style: { background: "#000", color: "#fff", borderRadius: "24px" },
    });
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/50 text-xl tracking-widest">Curating excellence...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">

        {/* FULL-SCREEN SLOW PARALLAX HERO */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Parallax Background Image */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`, // Slow parallax
            }}
          >
            <Image
              src="/Images/sandwich.jpg" // ← Put your best dish photo here
              alt="Culinary masterpiece"
              fill
              priority
              className="object-cover brightness-50 grayscale"
            />
            <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-wider mb-8 leading-tight">
              <span className="block">Where</span>
              <span className="block font-medium text-white/90">Art Meets</span>
              <span className="block">Plate</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-12 tracking-wide">
              An intimate journey through flavor, texture, and time.
            </p>
            <Link
              href="/user/menu"
              className="inline-flex items-center gap-5 px-16 py-7 bg-white text-black rounded-full text-xl font-medium hover:bg-gray-100 transition-all duration-500 shadow-2xl"
            >
              Begin Your Experience
              <ChevronRight size={28} />
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Chef's Specials */}
        {specialDishes.length > 0 && (
          <section className="py-32 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-5xl md:text-6xl font-light text-center mb-20 tracking-wider">
                Chef's <span className="font-medium">Specials</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                {specialDishes.map((dish) => (
                  <DishCard key={dish._id} dish={dish} onAdd={addToCart} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Currently Craved */}
        {popularDishes.length > 0 && (
          <section className="py-32 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-5xl md:text-6xl font-light text-center mb-20 tracking-wider">
                Currently <span className="font-medium">Craved</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                {popularDishes.map((dish) => (
                  <DishCard key={dish._id} dish={dish} onAdd={addToCart} isPopular />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <div className="py-32 text-center border-t border-white/10">
          <Link
            href="/user/menu"
            className="inline-flex items-center gap-5 px-20 py-8 bg-white text-black rounded-full text-2xl font-medium hover:bg-gray-100 transition-all shadow-2xl"
          >
            View Full Menu
            <ChevronRight size={32} />
          </Link>
        </div>

        {/* Floating Cart & Cart Sheet (same as before) */}
        {cartCount > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-8 right-8 z-50 bg-white text-black p-7 rounded-full shadow-2xl hover:scale-110 transition-all"
          >
            <ShoppingCart size={32} />
            <span className="absolute -top-4 -right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium">
              {cartCount}
            </span>
          </button>
        )}

        {showCart && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-end">
            <div className="bg-black border-t border-white/10 w-full max-w-2xl mx-auto rounded-t-3xl">
              <div className="flex justify-between items-center p-8 border-b border-white/10">
                <h2 className="text-2xl font-light">Your Order ({cartCount})</h2>
                <button onClick={() => setShowCart(false)} className="p-3 hover:bg-white/10 rounded-xl transition">
                  <X size={28} />
                </button>
              </div>
              <div className="p-8 space-y-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center border-b border-white/5 pb-6">
                    <div>
                      <p className="text-lg font-medium">{item.quantity}× {item.name}</p>
                      <p className="text-white/50">{item.price} SAR each</p>
                    </div>
                    <div className="flex items-center gap-5">
                      <button onClick={() => updateQty(item._id, -1)} className="w-12 h-12 rounded-full border border-white/20 hover:bg-white/10 transition"><Minus size={20} /></button>
                      <span className="w-16 text-center text-xl">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, 1)} className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-200 transition"><Plus size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 border-t border-white/10">
                <div className="flex justify-between text-3xl font-light mb-10">
                  <span>Total</span>
                  <span>{total} SAR</span>
                </div>
                <button
                  onClick={sendOrder}
                  className="w-full py-6 bg-white text-black rounded-3xl font-medium hover:bg-gray-100 transition text-lg"
                >
                  Send Order via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Premium Dish Card (unchanged — perfect as is)
function DishCard({ dish, onAdd, isPopular = false }) {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500">
      <div className="relative h-80 overflow-hidden">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-zinc-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        {isPopular && (
          <div className="absolute top-8 left-8 bg-white text-black px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
            Craved
          </div>
        )}
      </div>

      <div className="p-10">
        <h3 className="text-2xl font-medium mb-4">{dish.name}</h3>
        <p className="text-white/60 text-base leading-relaxed mb-10">
          {dish.description || "Crafted with intention and served with passion"}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-4xl font-light tracking-tight">
            {dish.price} <span className="text-white/40 text-xl">SAR</span>
          </div>
          <button
            onClick={() => onAdd(dish)}
            className="px-10 py-5 bg-white text-black rounded-3xl font-medium hover:bg-gray-100 transition flex items-center gap-3"
          >
            <ShoppingCart size={22} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}