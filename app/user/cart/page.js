


// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import toast from "react-hot-toast";
// import Image from "next/image";
// import { Plus, Minus, Trash2, Save } from "lucide-react";

// export const dynamic = 'force-dynamic';

// function CartContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const isEditMode = searchParams.has("edit");
//   const editOrderId = searchParams.get("edit");

//   const [cart, setCart] = useState([]);
//   const [selectedItemIndex, setSelectedItemIndex] = useState(0);
//   const [currency, setCurrency] = useState("SAR");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     const loadCart = async () => {
//       try {
//         // Fetch products from the SAME API as your menu to get currentPrice
//         const productsRes = await fetch("/api/user/products");
//         const allProducts = productsRes.ok ? await productsRes.json() : [];

//         if (isEditMode && editOrderId) {
//           const res = await fetch(`/api/user/updateOrder?orderId=${editOrderId}`);
//           if (res.ok) {
//             const order = await res.json();

//             const mappedCart = order.items.map(item => {
//               // FIX: Find by ID, not by Name
//               const originalProduct = allProducts.find(p =>
//                 (p._id?.toString() === item._id?.toString()) || (p._id?.toString() === item.productId?.toString())
//               );

//               // Rule: Use currentPrice from API (Dynamic), then item.price
//               const finalPrice = originalProduct?.currentPrice || item.price;

//               return {
//                 _id: item._id,
//                 name: item.name,
//                 price: parseFloat(finalPrice).toString(),
//                 quantity: item.quantity,
//                 addons: originalProduct?.addons || item.addons || [],
//                 selectedAddons: item.selectedAddons || [],
//                 image: originalProduct?.image || item.image || null
//               };
//             });

//             setCart(mappedCart);
//             if (mappedCart.length > 0) setSelectedItemIndex(0);
//           }
//         } else {
//           const savedCart = localStorage.getItem("cart");
//           if (savedCart) {
//             const parsed = JSON.parse(savedCart);

//             // Sync with latest dynamic prices from the server
//             // Sync with latest dynamic prices from the server
//             const updatedPricingCart = parsed.map(item => {
//               // FIX: ONLY search by ID. Never search by name.
//               const originalProduct = allProducts.find(p => p._id === item._id);

//               // Priority: currentPrice (Dynamic) > original price > fallback to cart price
//               const latestPrice = originalProduct?.currentPrice || originalProduct?.price || item.price;

//               return {
//                 ...item,
//                 price: latestPrice.toString()
//               };
//             });

//             setCart(updatedPricingCart);
//             if (updatedPricingCart.length > 0) setSelectedItemIndex(0);
//           }
//         }

//         const resSet = await fetch("/api/restaurantDetails");
//         if (resSet.ok) {
//           const data = await resSet.json();
//           setCurrency(data.currency || "SAR");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to sync prices");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCart();
//   }, [isEditMode, editOrderId, router]);

//   const calculateTotal = () => {
//     return cart.reduce((total, item) => {
//       // CRITICAL: Use parseFloat for decimals like 1.3
//       const base = parseFloat(item.price || 0) * (item.quantity || 1);
//       const addons = (item.selectedAddons || []).reduce((sum, a) => sum + parseFloat(a.price || 0), 0) * (item.quantity || 1);
//       return total + base + addons;
//     }, 0).toFixed(2);
//   };

//   const total = calculateTotal();
//   const cartCount = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

//   const updateCart = (newCart) => {
//     setCart(newCart);
//     if (!isEditMode) {
//       localStorage.setItem("cart", JSON.stringify(newCart));
//     }
//   };

//   const updateQty = (index, change) => {
//     const newCart = [...cart];
//     newCart[index].quantity = Math.max(0, (newCart[index].quantity || 0) + change);
//     if (newCart[index].quantity === 0) {
//       newCart.splice(index, 1);
//       if (selectedItemIndex >= newCart.length && newCart.length > 0) {
//         setSelectedItemIndex(0);
//       } else if (selectedItemIndex === index) {
//         setSelectedItemIndex(Math.max(0, index - 1));
//       }
//     }
//     updateCart(newCart);
//   };

//   const removeItem = (index) => {
//     const newCart = [...cart];
//     newCart.splice(index, 1);
//     if (selectedItemIndex >= newCart.length && newCart.length > 0) {
//       setSelectedItemIndex(0);
//     } else if (selectedItemIndex === index) {
//       setSelectedItemIndex(Math.max(0, index - 1));
//     }
//     updateCart(newCart);
//     toast.success("Item removed");
//   };

//   const toggleAddon = (addonIndex) => {
//     const newCart = [...cart];
//     const item = newCart[selectedItemIndex];
//     if (!item.addons?.[addonIndex]) return;
//     if (!item.selectedAddons) item.selectedAddons = [];
//     const existing = item.selectedAddons.findIndex(a => a.name === item.addons[addonIndex].name);
//     if (existing > -1) {
//       item.selectedAddons.splice(existing, 1);
//     } else {
//       item.selectedAddons.push(item.addons[addonIndex]);
//     }
//     updateCart(newCart);
//   };

//   const handleSaveChanges = async () => {
//     if (cart.length === 0) {
//       toast.error("Cart is empty");
//       return;
//     }
//     setSaving(true);
//     try {
//       const res = await fetch("/api/user/updateOrder", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           orderId: editOrderId,
//           items: cart.map(item => ({
//             name: item.name,
//             quantity: item.quantity || 1,
//             price: parseFloat(item.price || 0),
//             addons: item.addons || [],
//             selectedAddons: item.selectedAddons || []
//           })),
//           totalAmount: parseFloat(total)
//         })
//       });

//       if (res.ok) {
//         toast.success("Order updated!");
//         router.push(`/user/checkout?edit=${editOrderId}`);
//       }
//     } catch (err) {
//       toast.error("Error saving changes");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
//         <h1 className="text-3xl font-light text-gray-900 mb-6">Your cart is empty</h1>
//         <button onClick={() => router.push("/user/menu")} className="px-8 py-4 bg-gray-900 text-white rounded-full">Explore Menu</button>
//       </div>
//     );
//   }

//   const selectedItem = cart[selectedItemIndex] || {};

//   return (
//     <div className="min-h-screen">
//       <div className="text-center mb-10">
//         <h1 className="text-3xl md:text-4xl font-light text-gray-900">{isEditMode ? "Edit Order" : "Your Cart"}</h1>
//         <p className="text-gray-500 mt-2">{cartCount} items · {total} {currency}</p>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {cart.map((item, index) => (
//             <div
//               key={index}
//               onClick={() => setSelectedItemIndex(index)}
//               className={`relative bg-white rounded-3xl p-4 border transition-all cursor-pointer ${selectedItemIndex === index ? 'border-gray-900 shadow-xl' : 'border-gray-100 hover:border-gray-200'}`}
//             >
//               <div className="aspect-square relative rounded-2xl overflow-hidden mb-4 bg-gray-50">
//                 {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
//               </div>
//               <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
//               <p className="text-gray-900 font-bold mb-4">{item.price} {currency}</p>

//               <div className="flex items-center justify-between gap-2">
//                 <div className="flex items-center bg-gray-50 rounded-xl p-1">
//                   <button onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }} className="w-8 h-8 flex items-center justify-center"><Minus size={14} /></button>
//                   <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
//                   <button onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }} className="w-8 h-8 flex items-center justify-center"><Plus size={14} /></button>
//                 </div>
//                 <button onClick={(e) => { e.stopPropagation(); removeItem(index); }} className="text-red-500 p-2"><Trash2 size={18} /></button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <AnimatePresence>
//           {selectedItem.addons?.length > 0 && (
//             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 p-8 bg-gray-50 rounded-3xl">
//               <h2 className="text-xl font-bold mb-6">Extras for {selectedItem.name}</h2>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {selectedItem.addons.map((addon, idx) => {
//                   const isSelected = selectedItem.selectedAddons?.some(a => a.name === addon.name);
//                   return (
//                     <button
//                       key={idx}
//                       onClick={() => toggleAddon(idx)}
//                       className={`p-4 rounded-2xl text-left border transition-all ${isSelected ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-100'}`}
//                     >
//                       <p className="font-bold text-sm">{addon.name}</p>
//                       <p className="text-xs opacity-70">+{addon.price} {currency}</p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-gray-900 text-white p-6 rounded-3xl shadow-2xl z-50">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-[10px] uppercase tracking-widest text-gray-400">Grand Total</p>
//             <p className="text-2xl font-bold">{total} {currency}</p>
//           </div>
//           <button
//             onClick={() => isEditMode ? handleSaveChanges() : router.push("/user/checkout")}
//             className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100"
//           >
//             {isEditMode ? "Update Order" : "Checkout"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function CartPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <CartContent />
//     </Suspense>
//   );
// }









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

  // ── LOADING ────────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f4f1", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 36, height: 36, border: "1.5px solid #e0ddd8", borderTopColor: "#1a1a1a", borderRadius: "50%", margin: "0 auto 14px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 13, fontWeight: 300, color: "#888", letterSpacing: "0.06em" }}>Syncing your cart…</p>
        </div>
      </div>
    </>
  );

  // ── EMPTY CART ─────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        `}</style>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5f4f1", fontFamily: "'DM Sans', sans-serif", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🛒</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 200, color: "#1a1a1a", letterSpacing: "-0.03em", marginBottom: 10 }}>Your cart is empty</h1>
          <p style={{ fontSize: 14, fontWeight: 300, color: "#b0a898", marginBottom: 32, fontStyle: "italic" }}>Add something delicious from the menu</p>
          <button
            onClick={() => router.push("/user/menu")}
            style={{ padding: "16px 36px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 999, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Explore Menu
          </button>
        </div>
      </>
    );
  }

  const selectedItem = cart[selectedItemIndex] || {};

  // ── MAIN CART ──────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }

        *, *::before, *::after { box-sizing: border-box; }

        .cart-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5f4f1;
          padding-bottom: 120px;
        }

        /* ── TOP BAR ── */
        .cart-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(245,244,241,0.88);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cart-back-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 300; color: #888;
          background: none; border: none; cursor: pointer;
          letter-spacing: 0.02em; padding: 8px 12px;
          border-radius: 999px; transition: background 0.2s, color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .cart-back-btn:hover { background: rgba(0,0,0,0.05); color: #1a1a1a; }
        .cart-topbar-center {
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase; color: #b0a898;
        }
        .cart-topbar-count {
          font-size: 12px; font-weight: 300; color: #888;
          background: #eceae5; padding: 6px 12px;
          border-radius: 999px; letter-spacing: 0.04em;
        }

        /* ── HERO ── */
        .cart-hero {
          text-align: center;
          padding: 40px 24px 28px;
          animation: fadeUp 0.5s ease both;
        }
        .cart-hero-title {
          font-size: clamp(26px, 6vw, 44px);
          font-weight: 200;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0 0 6px;
        }
        .cart-hero-sub {
          font-size: 13px;
          font-weight: 300;
          color: #b0a898;
          font-style: italic;
        }

        /* ── CONTENT WRAP ── */
        .cart-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* ── ITEM GRID ── */
        .cart-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (min-width: 640px) { .cart-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
        @media (min-width: 900px) { .cart-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }

        /* ── ITEM CARD ── */
        .cart-item-card {
          background: #fff;
          border: 1.5px solid #eceae5;
          border-radius: 24px;
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.4s ease both;
        }
        .cart-item-card:hover {
          border-color: #c8c5be;
          box-shadow: 0 8px 28px rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }
        .cart-item-card.selected {
          border-color: #1a1a1a;
          box-shadow: 0 0 0 1px #1a1a1a, 0 12px 36px rgba(0,0,0,0.10);
        }

        /* ── ITEM IMAGE ── */
        .cart-item-image-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #f3f3f1;
          overflow: hidden;
          flex-shrink: 0;
        }
        .cart-item-image-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
        }

        /* ── ITEM BODY ── */
        .cart-item-body {
          padding: 12px 14px 14px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .cart-item-name {
          font-size: 14px;
          font-weight: 300;
          color: #1a1a1a;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }
        .cart-item-price {
          font-size: 18px;
          font-weight: 300;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
        }
        .cart-item-price-currency {
          font-size: 9px;
          font-weight: 400;
          color: #b0a898;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-left: 3px;
        }

        /* ── QTY CONTROLS ── */
        .cart-item-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          gap: 8px;
        }
        .cart-qty-wrap {
          display: flex;
          align-items: center;
          background: #f5f4f1;
          border-radius: 12px;
          padding: 3px;
          gap: 2px;
        }
        .cart-qty-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer;
          border-radius: 9px;
          transition: background 0.15s;
          color: #1a1a1a;
        }
        .cart-qty-btn:hover { background: rgba(0,0,0,0.07); }
        .cart-qty-num {
          width: 28px;
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          color: #1a1a1a;
          letter-spacing: -0.01em;
          font-family: 'DM Sans', sans-serif;
        }
        .cart-remove-btn {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer;
          border-radius: 10px; color: #d0897a;
          transition: background 0.15s, color 0.15s;
        }
        .cart-remove-btn:hover { background: #fdf0ee; color: #c0604a; }

        /* ── ADDONS PANEL ── */
        .cart-addons-panel {
          background: #fff;
          border: 1px solid #eceae5;
          border-radius: 24px;
          padding: 28px 24px;
          margin-bottom: 20px;
        }
        .cart-addons-title {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b0a898;
          margin-bottom: 6px;
        }
        .cart-addons-item-name {
          font-size: 20px;
          font-weight: 200;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .cart-addons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 600px) { .cart-addons-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px) { .cart-addons-grid { grid-template-columns: repeat(4, 1fr); } }

        .cart-addon-btn {
          padding: 14px 16px;
          border-radius: 16px;
          text-align: left;
          border: 1.5px solid #eceae5;
          background: #fafaf9;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .cart-addon-btn.selected {
          background: #1a1a1a;
          border-color: #1a1a1a;
        }
        .cart-addon-name {
          font-size: 13px;
          font-weight: 300;
          color: #1a1a1a;
          margin-bottom: 3px;
          display: block;
        }
        .cart-addon-btn.selected .cart-addon-name { color: #fff; }
        .cart-addon-price {
          font-size: 11px;
          font-weight: 300;
          color: #b0a898;
          display: block;
        }
        .cart-addon-btn.selected .cart-addon-price { color: rgba(255,255,255,0.55); }

        /* ── STICKY FOOTER ── */
        .cart-footer {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 560px;
          background: #1a1a1a;
          border-radius: 22px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.22);
          z-index: 50;
        }
        .cart-footer-total-label {
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 3px;
        }
        .cart-footer-total-value {
          font-size: 26px;
          font-weight: 200;
          color: #fff;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .cart-footer-currency {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.1em;
          margin-left: 4px;
        }
        .cart-footer-btn {
          background: #fff;
          color: #1a1a1a;
          border: none;
          border-radius: 14px;
          padding: 14px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .cart-footer-btn:hover { background: #f0ede8; }
        .cart-footer-btn:active { transform: scale(0.97); }
        .cart-footer-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>

      <div className="cart-page">

        {/* TOP BAR */}
        <div className="cart-topbar">
          <button className="cart-back-btn" onClick={() => router.back()}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="cart-topbar-center">{isEditMode ? "Edit Order" : "Cart"}</span>
          <span className="cart-topbar-count">{cartCount} item{cartCount !== 1 ? "s" : ""}</span>
        </div>

        {/* HERO */}
        <div className="cart-hero">
          <h1 className="cart-hero-title">{isEditMode ? "Edit Your Order" : "Your Cart"}</h1>
          <p className="cart-hero-sub">{cartCount} items · {total} {currency}</p>
        </div>

        <div className="cart-content">

          {/* ITEM GRID */}
          <div className="cart-grid">
            {cart.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedItemIndex(index)}
                className={`cart-item-card ${selectedItemIndex === index ? "selected" : ""}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image */}
                <div className="cart-item-image-wrap">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" style={{ transition: "transform 0.8s ease" }} />
                  ) : (
                    <div className="cart-item-image-placeholder">🍽️</div>
                  )}
                </div>

                {/* Body */}
                <div className="cart-item-body">
                  <div className="cart-item-name">{item.name}</div>
                  <div style={{ marginBottom: 12 }}>
                    <span className="cart-item-price">{item.price}</span>
                    <span className="cart-item-price-currency">{currency}</span>
                  </div>

                  <div className="cart-item-controls">
                    <div className="cart-qty-wrap">
                      <button className="cart-qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }}>
                        <Minus size={12} strokeWidth={2} />
                      </button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }}>
                        <Plus size={12} strokeWidth={2} />
                      </button>
                    </div>
                    <button className="cart-remove-btn" onClick={(e) => { e.stopPropagation(); removeItem(index); }}>
                      <Trash2 size={15} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ADDONS PANEL */}
          <AnimatePresence>
            {selectedItem.addons?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="cart-addons-panel"
              >
                <div className="cart-addons-title">Extras for</div>
                <div className="cart-addons-item-name">{selectedItem.name}</div>
                <div className="cart-addons-grid">
                  {selectedItem.addons.map((addon, idx) => {
                    const isSelected = selectedItem.selectedAddons?.some(a => a.name === addon.name);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleAddon(idx)}
                        className={`cart-addon-btn ${isSelected ? "selected" : ""}`}
                      >
                        <span className="cart-addon-name">{addon.name}</span>
                        <span className="cart-addon-price">+ {addon.price} {currency}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* STICKY FOOTER */}
        <div className="cart-footer">
          <div>
            <div className="cart-footer-total-label">Grand Total</div>
            <div>
              <span className="cart-footer-total-value">{total}</span>
              <span className="cart-footer-currency">{currency}</span>
            </div>
          </div>
          <button
            className="cart-footer-btn"
            disabled={saving}
            onClick={() => isEditMode ? handleSaveChanges() : router.push("/user/checkout")}
          >
            {saving ? (
              <>
                <div style={{ width: 14, height: 14, border: "1.5px solid rgba(26,26,26,0.2)", borderTopColor: "#1a1a1a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                Saving…
              </>
            ) : isEditMode ? (
              <>
                <Save size={14} strokeWidth={1.5} />
                Update Order
              </>
            ) : (
              "Checkout →"
            )}
          </button>
        </div>

      </div>
    </>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#f5f4f1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 13, fontWeight: 300, color: "#888", letterSpacing: "0.1em" }}>Loading…</div>
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}