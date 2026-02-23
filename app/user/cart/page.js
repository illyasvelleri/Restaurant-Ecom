







// //app/user/cart
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

//   // ── LOADING ────────────────────────────────────────────────────────
//   if (loading) return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>
//       <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f4f1", fontFamily: "'DM Sans', sans-serif" }}>
//         <div style={{ textAlign: "center" }}>
//           <div style={{ width: 36, height: 36, border: "1.5px solid #e0ddd8", borderTopColor: "#1a1a1a", borderRadius: "50%", margin: "0 auto 14px", animation: "spin 0.8s linear infinite" }} />
//           <p style={{ fontSize: 13, fontWeight: 300, color: "#888", letterSpacing: "0.06em" }}>Syncing your cart…</p>
//         </div>
//       </div>
//     </>
//   );

//   // ── EMPTY CART ─────────────────────────────────────────────────────
//   if (cart.length === 0) {
//     return (
//       <>
//         <style>{`
//           @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
//         `}</style>
//         <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5f4f1", fontFamily: "'DM Sans', sans-serif", padding: "0 24px", textAlign: "center" }}>
//           <div style={{ fontSize: 52, marginBottom: 20 }}>🛒</div>
//           <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 200, color: "#1a1a1a", letterSpacing: "-0.03em", marginBottom: 10 }}>Your cart is empty</h1>
//           <p style={{ fontSize: 14, fontWeight: 300, color: "#b0a898", marginBottom: 32, fontStyle: "italic" }}>Add something delicious from the menu</p>
//           <button
//             onClick={() => router.push("/user/menu")}
//             style={{ padding: "16px 36px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 999, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer" }}
//           >
//             Explore Menu
//           </button>
//         </div>
//       </>
//     );
//   }

//   const selectedItem = cart[selectedItemIndex] || {};

//   // ── MAIN CART ──────────────────────────────────────────────────────
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }

//         *, *::before, *::after { box-sizing: border-box; }

//         .cart-page {
//           font-family: 'DM Sans', sans-serif;
//           min-height: 100vh;
//           background: #f5f4f1;
//           padding-bottom: 120px;
//         }

//         /* ── TOP BAR ── */
//         .cart-topbar {
//           position: sticky;
//           top: 0;
//           z-index: 50;
//           background: rgba(245,244,241,0.88);
//           backdrop-filter: blur(18px);
//           border-bottom: 1px solid rgba(0,0,0,0.05);
//           padding: 14px 24px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }
//         .cart-back-btn {
//           display: flex; align-items: center; gap: 6px;
//           font-size: 13px; font-weight: 300; color: #888;
//           background: none; border: none; cursor: pointer;
//           letter-spacing: 0.02em; padding: 8px 12px;
//           border-radius: 999px; transition: background 0.2s, color 0.2s;
//           font-family: 'DM Sans', sans-serif;
//         }
//         .cart-back-btn:hover { background: rgba(0,0,0,0.05); color: #1a1a1a; }
//         .cart-topbar-center {
//           font-size: 12px; font-weight: 400;
//           letter-spacing: 0.2em; text-transform: uppercase; color: #b0a898;
//         }
//         .cart-topbar-count {
//           font-size: 12px; font-weight: 300; color: #888;
//           background: #eceae5; padding: 6px 12px;
//           border-radius: 999px; letter-spacing: 0.04em;
//         }

//         /* ── HERO ── */
//         .cart-hero {
//           text-align: center;
//           padding: 40px 24px 28px;
//           animation: fadeUp 0.5s ease both;
//         }
//         .cart-hero-title {
//           font-size: clamp(26px, 6vw, 44px);
//           font-weight: 200;
//           color: #1a1a1a;
//           letter-spacing: -0.03em;
//           line-height: 1.1;
//           margin: 0 0 6px;
//         }
//         .cart-hero-sub {
//           font-size: 13px;
//           font-weight: 300;
//           color: #b0a898;
//           font-style: italic;
//         }

//         /* ── CONTENT WRAP ── */
//         .cart-content {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 0 16px;
//         }

//         /* ── ITEM GRID ── */
//         .cart-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 12px;
//           margin-bottom: 20px;
//         }
//         @media (min-width: 640px) { .cart-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
//         @media (min-width: 900px) { .cart-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }

//         /* ── ITEM CARD ── */
//         .cart-item-card {
//           background: #fff;
//           border: 1.5px solid #eceae5;
//           border-radius: 24px;
//           padding: 0;
//           overflow: hidden;
//           cursor: pointer;
//           transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
//           display: flex;
//           flex-direction: column;
//           animation: fadeUp 0.4s ease both;
//         }
//         .cart-item-card:hover {
//           border-color: #c8c5be;
//           box-shadow: 0 8px 28px rgba(0,0,0,0.06);
//           transform: translateY(-1px);
//         }
//         .cart-item-card.selected {
//           border-color: #1a1a1a;
//           box-shadow: 0 0 0 1px #1a1a1a, 0 12px 36px rgba(0,0,0,0.10);
//         }

//         /* ── ITEM IMAGE ── */
//         .cart-item-image-wrap {
//           position: relative;
//           aspect-ratio: 1 / 1;
//           background: #f3f3f1;
//           overflow: hidden;
//           flex-shrink: 0;
//         }
//         .cart-item-image-placeholder {
//           width: 100%; height: 100%;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 28px;
//         }

//         /* ── ITEM BODY ── */
//         .cart-item-body {
//           padding: 12px 14px 14px;
//           display: flex;
//           flex-direction: column;
//           flex-grow: 1;
//         }
//         .cart-item-name {
//           font-size: 14px;
//           font-weight: 300;
//           color: #1a1a1a;
//           letter-spacing: -0.01em;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           margin-bottom: 2px;
//         }
//         .cart-item-price {
//           font-size: 18px;
//           font-weight: 300;
//           color: #1a1a1a;
//           letter-spacing: -0.03em;
//           margin-bottom: 12px;
//         }
//         .cart-item-price-currency {
//           font-size: 9px;
//           font-weight: 400;
//           color: #b0a898;
//           letter-spacing: 0.12em;
//           text-transform: uppercase;
//           margin-left: 3px;
//         }

//         /* ── QTY CONTROLS ── */
//         .cart-item-controls {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-top: auto;
//           gap: 8px;
//         }
//         .cart-qty-wrap {
//           display: flex;
//           align-items: center;
//           background: #f5f4f1;
//           border-radius: 12px;
//           padding: 3px;
//           gap: 2px;
//         }
//         .cart-qty-btn {
//           width: 30px; height: 30px;
//           display: flex; align-items: center; justify-content: center;
//           background: none; border: none; cursor: pointer;
//           border-radius: 9px;
//           transition: background 0.15s;
//           color: #1a1a1a;
//         }
//         .cart-qty-btn:hover { background: rgba(0,0,0,0.07); }
//         .cart-qty-num {
//           width: 28px;
//           text-align: center;
//           font-size: 14px;
//           font-weight: 400;
//           color: #1a1a1a;
//           letter-spacing: -0.01em;
//           font-family: 'DM Sans', sans-serif;
//         }
//         .cart-remove-btn {
//           width: 32px; height: 32px;
//           display: flex; align-items: center; justify-content: center;
//           background: none; border: none; cursor: pointer;
//           border-radius: 10px; color: #d0897a;
//           transition: background 0.15s, color 0.15s;
//         }
//         .cart-remove-btn:hover { background: #fdf0ee; color: #c0604a; }

//         /* ── ADDONS PANEL ── */
//         .cart-addons-panel {
//           background: #fff;
//           border: 1px solid #eceae5;
//           border-radius: 24px;
//           padding: 28px 24px;
//           margin-bottom: 20px;
//         }
//         .cart-addons-title {
//           font-size: 10px;
//           font-weight: 400;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           color: #b0a898;
//           margin-bottom: 6px;
//         }
//         .cart-addons-item-name {
//           font-size: 20px;
//           font-weight: 200;
//           color: #1a1a1a;
//           letter-spacing: -0.03em;
//           margin-bottom: 20px;
//         }
//         .cart-addons-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 10px;
//         }
//         @media (min-width: 600px) { .cart-addons-grid { grid-template-columns: repeat(3, 1fr); } }
//         @media (min-width: 900px) { .cart-addons-grid { grid-template-columns: repeat(4, 1fr); } }

//         .cart-addon-btn {
//           padding: 14px 16px;
//           border-radius: 16px;
//           text-align: left;
//           border: 1.5px solid #eceae5;
//           background: #fafaf9;
//           cursor: pointer;
//           transition: border-color 0.2s, background 0.2s;
//           font-family: 'DM Sans', sans-serif;
//         }
//         .cart-addon-btn.selected {
//           background: #1a1a1a;
//           border-color: #1a1a1a;
//         }
//         .cart-addon-name {
//           font-size: 13px;
//           font-weight: 300;
//           color: #1a1a1a;
//           margin-bottom: 3px;
//           display: block;
//         }
//         .cart-addon-btn.selected .cart-addon-name { color: #fff; }
//         .cart-addon-price {
//           font-size: 11px;
//           font-weight: 300;
//           color: #b0a898;
//           display: block;
//         }
//         .cart-addon-btn.selected .cart-addon-price { color: rgba(255,255,255,0.55); }

//         /* ── STICKY FOOTER ── */
//         .cart-footer {
//     width: calc(100% - 32px);
//     max-width: 560px;
//     margin: 0 auto 40px auto;           /* centers + bottom margin */
//     background: #1a1a1a;
//     border-radius: 22px;
//     padding: 18px 22px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 16px;
//     box-shadow: 0 16px 48px rgba(0,0,0,0.22);
//   }
//         .cart-footer-total-label {
//           font-size: 9px;
//           font-weight: 400;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           color: rgba(255,255,255,0.4);
//           margin-bottom: 3px;
//         }
//         .cart-footer-total-value {
//           font-size: 26px;
//           font-weight: 200;
//           color: #fff;
//           letter-spacing: -0.04em;
//           line-height: 1;
//         }
//         .cart-footer-currency {
//           font-size: 10px;
//           color: rgba(255,255,255,0.35);
//           letter-spacing: 0.1em;
//           margin-left: 4px;
//         }
//         .cart-footer-btn {
//           background: #fff;
//           color: #1a1a1a;
//           border: none;
//           border-radius: 14px;
//           padding: 14px 24px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 11px;
//           font-weight: 500;
//           letter-spacing: 0.18em;
//           text-transform: uppercase;
//           cursor: pointer;
//           white-space: nowrap;
//           transition: background 0.2s, transform 0.15s, opacity 0.2s;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           flex-shrink: 0;
//         }
//         .cart-footer-btn:hover { background: #f0ede8; }
//         .cart-footer-btn:active { transform: scale(0.97); }
//         .cart-footer-btn:disabled { opacity: 0.45; cursor: not-allowed; }
//       `}</style>

//       <div className="cart-page">

//         {/* TOP BAR */}
//         <div className="cart-topbar">
//           <button className="cart-back-btn" onClick={() => router.back()}>
//             <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
//             </svg>
//             Back
//           </button>
//           <span className="cart-topbar-center">{isEditMode ? "Edit Order" : "Cart"}</span>
//           <span className="cart-topbar-count">{cartCount} item{cartCount !== 1 ? "s" : ""}</span>
//         </div>

//         {/* HERO */}
//         <div className="cart-hero">
//           <h1 className="cart-hero-title">{isEditMode ? "Edit Your Order" : "Your Cart"}</h1>
//           <p className="cart-hero-sub">{cartCount} items · {total} {currency}</p>
//         </div>

//         <div className="cart-content">

//           {/* ITEM GRID */}
//           <div className="cart-grid">
//             {cart.map((item, index) => (
//               <div
//                 key={index}
//                 onClick={() => setSelectedItemIndex(index)}
//                 className={`cart-item-card ${selectedItemIndex === index ? "selected" : ""}`}
//                 style={{ animationDelay: `${index * 0.05}s` }}
//               >
//                 {/* Image */}
//                 <div className="cart-item-image-wrap">
//                   {item.image ? (
//                     <Image src={item.image} alt={item.name} fill className="object-cover" style={{ transition: "transform 0.8s ease" }} />
//                   ) : (
//                     <div className="cart-item-image-placeholder">🍽️</div>
//                   )}
//                 </div>

//                 {/* Body */}
//                 <div className="cart-item-body">
//                   <div className="cart-item-name">{item.name}</div>
//                   <div style={{ marginBottom: 12 }}>
//                     <span className="cart-item-price">{item.price}</span>
//                     <span className="cart-item-price-currency">{currency}</span>
//                   </div>

//                   <div className="cart-item-controls">
//                     <div className="cart-qty-wrap">
//                       <button className="cart-qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }}>
//                         <Minus size={12} strokeWidth={2} />
//                       </button>
//                       <span className="cart-qty-num">{item.quantity}</span>
//                       <button className="cart-qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }}>
//                         <Plus size={12} strokeWidth={2} />
//                       </button>
//                     </div>
//                     <button className="cart-remove-btn" onClick={(e) => { e.stopPropagation(); removeItem(index); }}>
//                       <Trash2 size={15} strokeWidth={1.5} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ADDONS PANEL */}
//           <AnimatePresence>
//             {selectedItem.addons?.length > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 8 }}
//                 transition={{ duration: 0.28, ease: "easeOut" }}
//                 className="cart-addons-panel"
//               >
//                 <div className="cart-addons-title">Extras for</div>
//                 <div className="cart-addons-item-name">{selectedItem.name}</div>
//                 <div className="cart-addons-grid">
//                   {selectedItem.addons.map((addon, idx) => {
//                     const isSelected = selectedItem.selectedAddons?.some(a => a.name === addon.name);
//                     return (
//                       <button
//                         key={idx}
//                         onClick={() => toggleAddon(idx)}
//                         className={`cart-addon-btn ${isSelected ? "selected" : ""}`}
//                       >
//                         <span className="cart-addon-name">{addon.name}</span>
//                         <span className="cart-addon-price">+ {addon.price} {currency}</span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//         </div>

//         {/* STICKY FOOTER */}
//         <div className="cart-footer">
//           <div>
//             <div className="cart-footer-total-label">Grand Total</div>
//             <div>
//               <span className="cart-footer-total-value">{total}</span>
//               <span className="cart-footer-currency">{currency}</span>
//             </div>
//           </div>
//           <button
//             className="cart-footer-btn"
//             disabled={saving}
//             onClick={() => isEditMode ? handleSaveChanges() : router.push("/user/checkout")}
//           >
//             {saving ? (
//               <>
//                 <div style={{ width: 14, height: 14, border: "1.5px solid rgba(26,26,26,0.2)", borderTopColor: "#1a1a1a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
//                 Saving…
//               </>
//             ) : isEditMode ? (
//               <>
//                 <Save size={14} strokeWidth={1.5} />
//                 Update Order
//               </>
//             ) : (
//               "Checkout →"
//             )}
//           </button>
//         </div>

//       </div>
//     </>
//   );
// }

// export default function CartPage() {
//   return (
//     <Suspense fallback={
//       <div style={{ minHeight: "100vh", background: "#f5f4f1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
//         <div style={{ fontSize: 13, fontWeight: 300, color: "#888", letterSpacing: "0.1em" }}>Loading…</div>
//       </div>
//     }>
//       <CartContent />
//     </Suspense>
//   );
// }

//app/user/cart/page.jsx
//app/user/cart/page.jsx
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";
import { Plus, Minus, Trash2, Save, Sparkles, TrendingUp } from "lucide-react";

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
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const itemsScrollRef = useRef(null);
  const addonsScrollRef = useRef(null);
  const recommendationsScrollRef = useRef(null);

  useEffect(() => {
    const loadCart = async () => {
      try {
        // Fetch products from the SAME API as your menu to get currentPrice
        const productsRes = await fetch("/api/user/products");
        const productsData = productsRes.ok ? await productsRes.json() : [];
        setAllProducts(productsData);

        if (isEditMode && editOrderId) {
          const res = await fetch(`/api/user/updateOrder?orderId=${editOrderId}`);
          if (res.ok) {
            const order = await res.json();

            const mappedCart = order.items.map(item => {
              const originalProduct = productsData.find(p =>
                (p._id?.toString() === item._id?.toString()) || (p._id?.toString() === item.productId?.toString())
              );

              const finalPrice = originalProduct?.currentPrice || item.price;

              return {
                _id: item._id,
                name: item.name,
                price: parseFloat(finalPrice).toString(),
                quantity: item.quantity,
                addons: originalProduct?.addons || item.addons || [],
                selectedAddons: item.selectedAddons || [],
                image: originalProduct?.image || item.image || null,
                category: originalProduct?.category || item.category || ""
              };
            });

            setCart(mappedCart);
            if (mappedCart.length > 0) setSelectedItemIndex(0);
          }
        } else {
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            const parsed = JSON.parse(savedCart);

            const updatedPricingCart = parsed.map(item => {
              const originalProduct = productsData.find(p => p._id === item._id);
              const latestPrice = originalProduct?.currentPrice || originalProduct?.price || item.price;

              return {
                ...item,
                price: latestPrice.toString(),
                category: originalProduct?.category || item.category || ""
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

  // Load AI recommendations when cart changes
  useEffect(() => {
    if (cart.length > 0 && allProducts.length > 0) {
      loadAIRecommendations();
    }
  }, [cart, allProducts]);

  const loadAIRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const res = await fetch("/api/user/ai-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cart,
          allProducts: allProducts,
          timeOfDay: new Date().getHours(),
          dayOfWeek: new Date().getDay(),
          currency: currency
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Fixed: use data.recommendations (matches backend response shape)
        setAiRecommendations(data.recommendations || []);
      } else {
        console.warn("AI recommendations API failed:", await res.text());
      }
    } catch (err) {
      console.error("Failed to load AI recommendations:", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
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

  const addRecommendedToCart = (product) => {
    // ── Track metrics: user added recommendation to cart ──
    fetch('/api/user/ai-recommendations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clicked: true,
        added: true,
        revenue: parseFloat(product.price || product.currentPrice || 0)
      })
    }).catch(err => console.error("Tracking failed:", err));

    const newCart = [...cart];
    const existingIndex = newCart.findIndex(item => item._id === product._id);
    
    if (existingIndex > -1) {
      newCart[existingIndex].quantity = (newCart[existingIndex].quantity || 1) + 1;
      toast.success(`Increased ${product.name} quantity`);
    } else {
      newCart.push({
        _id: product._id,
        name: product.name,
        price: product.price || product.currentPrice,
        quantity: 1,
        addons: product.addons || [],
        selectedAddons: [],
        image: product.image || null,
        category: product.category || ""
      });
      toast.success(`${product.name} added to cart!`);
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
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }

        *, *::before, *::after { box-sizing: border-box; }

        .cart-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5f4f1;
          padding-bottom: 40px;
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

        /* ── HORIZONTAL SCROLL CONTAINER ── */
        .horizontal-scroll-container {
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          margin: 0 -16px;
          padding: 0 16px 12px 16px;
        }
        .horizontal-scroll-container::-webkit-scrollbar {
          display: none;
        }

        /* ── ITEM GRID (HORIZONTAL ON MOBILE) ── */
        .cart-grid {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (min-width: 640px) { 
          .cart-grid { 
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .horizontal-scroll-container {
            overflow-x: visible;
            margin: 0;
            padding: 0;
          }
        }
        @media (min-width: 900px) { 
          .cart-grid { 
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
        }

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
          min-width: 160px;
          flex-shrink: 0;
        }
        @media (min-width: 640px) {
          .cart-item-card {
            min-width: auto;
            flex-shrink: 1;
          }
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
          display: flex;
          gap: 10px;
        }
        @media (min-width: 600px) { 
          .cart-addons-grid { 
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 900px) { 
          .cart-addons-grid { 
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .cart-addon-btn {
          padding: 14px 16px;
          border-radius: 16px;
          text-align: left;
          border: 1.5px solid #eceae5;
          background: #fafaf9;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
          min-width: 140px;
          flex-shrink: 0;
        }
        @media (min-width: 600px) {
          .cart-addon-btn {
            min-width: auto;
          }
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

        /* ── AI RECOMMENDATIONS SECTION ── */
        .ai-recommendations-section {
          background: linear-gradient(135deg, #fff 0%, #fefdfb 100%);
          border: 1.5px solid #eceae5;
          border-radius: 24px;
          padding: 28px 24px;
          margin-bottom: 24px;
          animation: fadeUp 0.5s ease both;
        }
        .ai-recommendations-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .ai-recommendations-title {
          font-size: 20px;
          font-weight: 200;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .ai-recommendations-subtitle {
          font-size: 13px;
          font-weight: 300;
          color: #b0a898;
          font-style: italic;
          margin-bottom: 20px;
        }

        /* ── RECOMMENDATION CARDS ── */
        .recommendations-grid {
          display: flex;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .recommendations-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }
        @media (min-width: 900px) {
          .recommendations-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .recommendation-card {
          background: #fff;
          border: 1.5px solid #eceae5;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          min-width: 180px;
          flex-shrink: 0;
        }
        @media (min-width: 640px) {
          .recommendation-card {
            min-width: auto;
            flex-shrink: 1;
          }
        }
        .recommendation-card:hover {
          border-color: #667eea;
          box-shadow: 0 8px 28px rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
        }

        .recommendation-image-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #f9f8f6;
          overflow: hidden;
        }
        .recommendation-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(26, 26, 26, 0.75);
          backdrop-filter: blur(10px);
          color: white;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          z-index: 2;
        }
        .recommendation-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .recommendation-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .recommendation-name {
          font-size: 14px;
          font-weight: 400;
          color: #1a1a1a;
          letter-spacing: -0.01em;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        .recommendation-reason {
          font-size: 11px;
          font-weight: 300;
          color: #888;
          margin-bottom: 12px;
          line-height: 1.4;
          font-style: italic;
        }
        .recommendation-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .recommendation-price {
          font-size: 16px;
          font-weight: 300;
          color: #1a1a1a;
          letter-spacing: -0.02em;
        }
        .recommendation-currency {
          font-size: 9px;
          color: #b0a898;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-left: 3px;
        }
        .recommendation-add-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .recommendation-add-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .recommendation-add-btn:active {
          transform: scale(0.95);
        }

        /* Loading Skeleton */
        .skeleton-card {
          background: #fff;
          border: 1.5px solid #eceae5;
          border-radius: 20px;
          overflow: hidden;
          min-width: 180px;
          flex-shrink: 0;
        }
        @media (min-width: 640px) {
          .skeleton-card {
            min-width: auto;
          }
        }
        .skeleton-image {
          aspect-ratio: 1 / 1;
          background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-body {
          padding: 14px 16px 16px;
        }
        .skeleton-line {
          height: 12px;
          background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          margin-bottom: 8px;
        }
        .skeleton-line.short {
          width: 60%;
        }
        .skeleton-line.medium {
          width: 80%;
        }

        /* ── CHECKOUT SECTION ── */
        .checkout-section {
          background: #fff;
          border: 1px solid #eceae5;
          border-radius: 24px;
          padding: 28px 24px;
          margin-bottom: 24px;
        }
        .checkout-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eceae5;
        }
        .checkout-total-label {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #b0a898;
        }
        .checkout-total-value {
          font-size: 32px;
          font-weight: 200;
          color: #1a1a1a;
          letter-spacing: -0.04em;
        }
        .checkout-currency {
          font-size: 12px;
          color: #b0a898;
          letter-spacing: 0.1em;
          margin-left: 6px;
        }
        .checkout-btn {
          width: 100%;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 16px;
          padding: 18px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .checkout-btn:hover {
          background: #2a2a2a;
        }
        .checkout-btn:active {
          transform: scale(0.98);
        }
        .checkout-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
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

          {/* ITEM GRID - HORIZONTAL SCROLL ON MOBILE */}
          <div className="horizontal-scroll-container" ref={itemsScrollRef}>
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
          </div>

          {/* ADDONS PANEL - HORIZONTAL SCROLL ON MOBILE */}
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
                <div className="horizontal-scroll-container" ref={addonsScrollRef}>
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EXISTING AI RECOMMENDATIONS SECTION – UNCHANGED */}
          <div className="ai-recommendations-section">
            <div className="ai-recommendations-header">
              <span className="ai-badge">
                <Sparkles size={12} />
                AI Powered
              </span>
            </div>
            <h2 className="ai-recommendations-title">Perfect Pairings for You</h2>
            <p className="ai-recommendations-subtitle">
              {loadingRecommendations 
                ? "Analyzing your order..." 
                : `Based on your order and ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"} preferences`
              }
            </p>

            <div className="horizontal-scroll-container" ref={recommendationsScrollRef}>
              <div className="recommendations-grid">
                {loadingRecommendations ? (
                  Array(4).fill(0).map((_, idx) => (
                    <div key={idx} className="skeleton-card">
                      <div className="skeleton-image" />
                      <div className="skeleton-body">
                        <div className="skeleton-line medium" />
                        <div className="skeleton-line short" />
                      </div>
                    </div>
                  ))
                ) : aiRecommendations.length > 0 ? (
                  aiRecommendations.map((rec, idx) => (
                    <div key={idx} className="recommendation-card" onClick={() => addRecommendedToCart(rec)}>
                      <div className="recommendation-image-wrap">
                        {rec.badge && (
                          <div className="recommendation-badge">{rec.badge}</div>
                        )}
                        {rec.image ? (
                          <Image src={rec.image} alt={rec.name} fill className="object-cover" />
                        ) : (
                          <div className="recommendation-image-placeholder">
                            {rec.emoji || "🍴"}
                          </div>
                        )}
                      </div>
                      <div className="recommendation-body">
                        <h4 className="recommendation-name">{rec.name}</h4>
                        <p className="recommendation-reason">{rec.reason}</p>
                        <div className="recommendation-price-row">
                          <div>
                            <span className="recommendation-price">{rec.price || rec.currentPrice}</span>
                            <span className="recommendation-currency">{currency}</span>
                          </div>
                          <button className="recommendation-add-btn" onClick={(e) => { e.stopPropagation(); addRecommendedToCart(rec); }}>
                            <Plus size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 20px", color: "#b0a898" }}>
                    <TrendingUp size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                    <p style={{ fontSize: 14, fontWeight: 300, fontStyle: "italic" }}>
                      No recommendations available right now
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CHECKOUT SECTION (NON-STICKY) */}
          <div className="checkout-section">
            <div className="checkout-total-row">
              <span className="checkout-total-label">Grand Total</span>
              <div>
                <span className="checkout-total-value">{total}</span>
                <span className="checkout-currency">{currency}</span>
              </div>
            </div>
            <button
              className="checkout-btn"
              disabled={saving}
              onClick={() => isEditMode ? handleSaveChanges() : router.push("/user/checkout")}
            >
              {saving ? (
                <>
                  <div style={{ width: 14, height: 14, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Saving…
                </>
              ) : isEditMode ? (
                <>
                  <Save size={14} strokeWidth={1.5} />
                  Update Order
                </>
              ) : (
                "Proceed to Checkout →"
              )}
            </button>
          </div>

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

// //app/user/cart/page.jsx
// "use client";

// import { useState, useEffect, Suspense, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import toast from "react-hot-toast";
// import Image from "next/image";
// import { Plus, Minus, Trash2, Save, Sparkles, TrendingUp } from "lucide-react";

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
//   const [aiRecommendations, setAiRecommendations] = useState([]);
//   const [loadingRecommendations, setLoadingRecommendations] = useState(false);
//   const [allProducts, setAllProducts] = useState([]);

//   const itemsScrollRef = useRef(null);
//   const addonsScrollRef = useRef(null);
//   const recommendationsScrollRef = useRef(null);

//   useEffect(() => {
//     const loadCart = async () => {
//       try {
//         // Fetch products from the SAME API as your menu to get currentPrice
//         const productsRes = await fetch("/api/user/products");
//         const productsData = productsRes.ok ? await productsRes.json() : [];
//         setAllProducts(productsData);

//         if (isEditMode && editOrderId) {
//           const res = await fetch(`/api/user/updateOrder?orderId=${editOrderId}`);
//           if (res.ok) {
//             const order = await res.json();

//             const mappedCart = order.items.map(item => {
//               const originalProduct = productsData.find(p =>
//                 (p._id?.toString() === item._id?.toString()) || (p._id?.toString() === item.productId?.toString())
//               );

//               const finalPrice = originalProduct?.currentPrice || item.price;

//               return {
//                 _id: item._id,
//                 name: item.name,
//                 price: parseFloat(finalPrice).toString(),
//                 quantity: item.quantity,
//                 addons: originalProduct?.addons || item.addons || [],
//                 selectedAddons: item.selectedAddons || [],
//                 image: originalProduct?.image || item.image || null,
//                 category: originalProduct?.category || item.category || ""
//               };
//             });

//             setCart(mappedCart);
//             if (mappedCart.length > 0) setSelectedItemIndex(0);
//           }
//         } else {
//           const savedCart = localStorage.getItem("cart");
//           if (savedCart) {
//             const parsed = JSON.parse(savedCart);

//             const updatedPricingCart = parsed.map(item => {
//               const originalProduct = productsData.find(p => p._id === item._id);
//               const latestPrice = originalProduct?.currentPrice || originalProduct?.price || item.price;

//               return {
//                 ...item,
//                 price: latestPrice.toString(),
//                 category: originalProduct?.category || item.category || ""
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

//   // Load AI recommendations when cart changes
//   useEffect(() => {
//     if (cart.length > 0 && allProducts.length > 0) {
//       loadAIRecommendations();
//     }
//   }, [cart, allProducts]);

//   const loadAIRecommendations = async () => {
//     setLoadingRecommendations(true);
//     try {
//       const res = await fetch("/api/user/ai-recommendations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           cartItems: cart,
//           allProducts: allProducts,
//           timeOfDay: new Date().getHours(),
//           dayOfWeek: new Date().getDay(),
//           currency: currency
//         })
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setAiRecommendations(data.recommendations || []);
//       }
//     } catch (err) {
//       console.error("Failed to load AI recommendations:", err);
//     } finally {
//       setLoadingRecommendations(false);
//     }
//   };

//   const calculateTotal = () => {
//     return cart.reduce((total, item) => {
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

//   const addRecommendedToCart = (product) => {
//     const newCart = [...cart];
//     const existingIndex = newCart.findIndex(item => item._id === product._id);
    
//     if (existingIndex > -1) {
//       newCart[existingIndex].quantity = (newCart[existingIndex].quantity || 1) + 1;
//       toast.success(`Increased ${product.name} quantity`);
//     } else {
//       newCart.push({
//         _id: product._id,
//         name: product.name,
//         price: product.price || product.currentPrice,
//         quantity: 1,
//         addons: product.addons || [],
//         selectedAddons: [],
//         image: product.image || null,
//         category: product.category || ""
//       });
//       toast.success(`${product.name} added to cart!`);
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

//   // ── LOADING ────────────────────────────────────────────────────────
//   if (loading) return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>
//       <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f4f1", fontFamily: "'DM Sans', sans-serif" }}>
//         <div style={{ textAlign: "center" }}>
//           <div style={{ width: 36, height: 36, border: "1.5px solid #e0ddd8", borderTopColor: "#1a1a1a", borderRadius: "50%", margin: "0 auto 14px", animation: "spin 0.8s linear infinite" }} />
//           <p style={{ fontSize: 13, fontWeight: 300, color: "#888", letterSpacing: "0.06em" }}>Syncing your cart…</p>
//         </div>
//       </div>
//     </>
//   );

//   // ── EMPTY CART ─────────────────────────────────────────────────────
//   if (cart.length === 0) {
//     return (
//       <>
//         <style>{`
//           @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
//         `}</style>
//         <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5f4f1", fontFamily: "'DM Sans', sans-serif", padding: "0 24px", textAlign: "center" }}>
//           <div style={{ fontSize: 52, marginBottom: 20 }}>🛒</div>
//           <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 200, color: "#1a1a1a", letterSpacing: "-0.03em", marginBottom: 10 }}>Your cart is empty</h1>
//           <p style={{ fontSize: 14, fontWeight: 300, color: "#b0a898", marginBottom: 32, fontStyle: "italic" }}>Add something delicious from the menu</p>
//           <button
//             onClick={() => router.push("/user/menu")}
//             style={{ padding: "16px 36px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 999, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer" }}
//           >
//             Explore Menu
//           </button>
//         </div>
//       </>
//     );
//   }

//   const selectedItem = cart[selectedItemIndex] || {};

//   // ── MAIN CART ──────────────────────────────────────────────────────
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
//         @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }

//         *, *::before, *::after { box-sizing: border-box; }

//         .cart-page {
//           font-family: 'DM Sans', sans-serif;
//           min-height: 100vh;
//           background: #f5f4f1;
//           padding-bottom: 40px;
//         }

//         /* ── TOP BAR ── */
//         .cart-topbar {
//           position: sticky;
//           top: 0;
//           z-index: 50;
//           background: rgba(245,244,241,0.88);
//           backdrop-filter: blur(18px);
//           border-bottom: 1px solid rgba(0,0,0,0.05);
//           padding: 14px 24px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }
//         .cart-back-btn {
//           display: flex; align-items: center; gap: 6px;
//           font-size: 13px; font-weight: 300; color: #888;
//           background: none; border: none; cursor: pointer;
//           letter-spacing: 0.02em; padding: 8px 12px;
//           border-radius: 999px; transition: background 0.2s, color 0.2s;
//           font-family: 'DM Sans', sans-serif;
//         }
//         .cart-back-btn:hover { background: rgba(0,0,0,0.05); color: #1a1a1a; }
//         .cart-topbar-center {
//           font-size: 12px; font-weight: 400;
//           letter-spacing: 0.2em; text-transform: uppercase; color: #b0a898;
//         }
//         .cart-topbar-count {
//           font-size: 12px; font-weight: 300; color: #888;
//           background: #eceae5; padding: 6px 12px;
//           border-radius: 999px; letter-spacing: 0.04em;
//         }

//         /* ── HERO ── */
//         .cart-hero {
//           text-align: center;
//           padding: 40px 24px 28px;
//           animation: fadeUp 0.5s ease both;
//         }
//         .cart-hero-title {
//           font-size: clamp(26px, 6vw, 44px);
//           font-weight: 200;
//           color: #1a1a1a;
//           letter-spacing: -0.03em;
//           line-height: 1.1;
//           margin: 0 0 6px;
//         }
//         .cart-hero-sub {
//           font-size: 13px;
//           font-weight: 300;
//           color: #b0a898;
//           font-style: italic;
//         }

//         /* ── CONTENT WRAP ── */
//         .cart-content {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 0 16px;
//         }

//         /* ── HORIZONTAL SCROLL CONTAINER ── */
//         .horizontal-scroll-container {
//           overflow-x: auto;
//           overflow-y: hidden;
//           -webkit-overflow-scrolling: touch;
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//           margin: 0 -16px;
//           padding: 0 16px 12px 16px;
//         }
//         .horizontal-scroll-container::-webkit-scrollbar {
//           display: none;
//         }

//         /* ── ITEM GRID (HORIZONTAL ON MOBILE) ── */
//         .cart-grid {
//           display: flex;
//           gap: 12px;
//           margin-bottom: 20px;
//         }
//         @media (min-width: 640px) { 
//           .cart-grid { 
//             display: grid;
//             grid-template-columns: repeat(3, 1fr);
//             gap: 16px;
//           }
//           .horizontal-scroll-container {
//             overflow-x: visible;
//             margin: 0;
//             padding: 0;
//           }
//         }
//         @media (min-width: 900px) { 
//           .cart-grid { 
//             grid-template-columns: repeat(4, 1fr);
//             gap: 20px;
//           }
//         }

//         /* ── ITEM CARD ── */
//         .cart-item-card {
//           background: #fff;
//           border: 1.5px solid #eceae5;
//           border-radius: 24px;
//           padding: 0;
//           overflow: hidden;
//           cursor: pointer;
//           transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
//           display: flex;
//           flex-direction: column;
//           animation: fadeUp 0.4s ease both;
//           min-width: 160px;
//           flex-shrink: 0;
//         }
//         @media (min-width: 640px) {
//           .cart-item-card {
//             min-width: auto;
//             flex-shrink: 1;
//           }
//         }
//         .cart-item-card:hover {
//           border-color: #c8c5be;
//           box-shadow: 0 8px 28px rgba(0,0,0,0.06);
//           transform: translateY(-1px);
//         }
//         .cart-item-card.selected {
//           border-color: #1a1a1a;
//           box-shadow: 0 0 0 1px #1a1a1a, 0 12px 36px rgba(0,0,0,0.10);
//         }

//         /* ── ITEM IMAGE ── */
//         .cart-item-image-wrap {
//           position: relative;
//           aspect-ratio: 1 / 1;
//           background: #f3f3f1;
//           overflow: hidden;
//           flex-shrink: 0;
//         }
//         .cart-item-image-placeholder {
//           width: 100%; height: 100%;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 28px;
//         }

//         /* ── ITEM BODY ── */
//         .cart-item-body {
//           padding: 12px 14px 14px;
//           display: flex;
//           flex-direction: column;
//           flex-grow: 1;
//         }
//         .cart-item-name {
//           font-size: 14px;
//           font-weight: 300;
//           color: #1a1a1a;
//           letter-spacing: -0.01em;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           margin-bottom: 2px;
//         }
//         .cart-item-price {
//           font-size: 18px;
//           font-weight: 300;
//           color: #1a1a1a;
//           letter-spacing: -0.03em;
//           margin-bottom: 12px;
//         }
//         .cart-item-price-currency {
//           font-size: 9px;
//           font-weight: 400;
//           color: #b0a898;
//           letter-spacing: 0.12em;
//           text-transform: uppercase;
//           margin-left: 3px;
//         }

//         /* ── QTY CONTROLS ── */
//         .cart-item-controls {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-top: auto;
//           gap: 8px;
//         }
//         .cart-qty-wrap {
//           display: flex;
//           align-items: center;
//           background: #f5f4f1;
//           border-radius: 12px;
//           padding: 3px;
//           gap: 2px;
//         }
//         .cart-qty-btn {
//           width: 30px; height: 30px;
//           display: flex; align-items: center; justify-content: center;
//           background: none; border: none; cursor: pointer;
//           border-radius: 9px;
//           transition: background 0.15s;
//           color: #1a1a1a;
//         }
//         .cart-qty-btn:hover { background: rgba(0,0,0,0.07); }
//         .cart-qty-num {
//           width: 28px;
//           text-align: center;
//           font-size: 14px;
//           font-weight: 400;
//           color: #1a1a1a;
//           letter-spacing: -0.01em;
//           font-family: 'DM Sans', sans-serif;
//         }
//         .cart-remove-btn {
//           width: 32px; height: 32px;
//           display: flex; align-items: center; justify-content: center;
//           background: none; border: none; cursor: pointer;
//           border-radius: 10px; color: #d0897a;
//           transition: background 0.15s, color 0.15s;
//         }
//         .cart-remove-btn:hover { background: #fdf0ee; color: #c0604a; }

//         /* ── ADDONS PANEL ── */
//         .cart-addons-panel {
//           background: #fff;
//           border: 1px solid #eceae5;
//           border-radius: 24px;
//           padding: 28px 24px;
//           margin-bottom: 20px;
//         }
//         .cart-addons-title {
//           font-size: 10px;
//           font-weight: 400;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           color: #b0a898;
//           margin-bottom: 6px;
//         }
//         .cart-addons-item-name {
//           font-size: 20px;
//           font-weight: 200;
//           color: #1a1a1a;
//           letter-spacing: -0.03em;
//           margin-bottom: 20px;
//         }
//         .cart-addons-grid {
//           display: flex;
//           gap: 10px;
//         }
//         @media (min-width: 600px) { 
//           .cart-addons-grid { 
//             display: grid;
//             grid-template-columns: repeat(3, 1fr);
//           }
//         }
//         @media (min-width: 900px) { 
//           .cart-addons-grid { 
//             grid-template-columns: repeat(4, 1fr);
//           }
//         }

//         .cart-addon-btn {
//           padding: 14px 16px;
//           border-radius: 16px;
//           text-align: left;
//           border: 1.5px solid #eceae5;
//           background: #fafaf9;
//           cursor: pointer;
//           transition: border-color 0.2s, background 0.2s;
//           font-family: 'DM Sans', sans-serif;
//           min-width: 140px;
//           flex-shrink: 0;
//         }
//         @media (min-width: 600px) {
//           .cart-addon-btn {
//             min-width: auto;
//           }
//         }
//         .cart-addon-btn.selected {
//           background: #1a1a1a;
//           border-color: #1a1a1a;
//         }
//         .cart-addon-name {
//           font-size: 13px;
//           font-weight: 300;
//           color: #1a1a1a;
//           margin-bottom: 3px;
//           display: block;
//         }
//         .cart-addon-btn.selected .cart-addon-name { color: #fff; }
//         .cart-addon-price {
//           font-size: 11px;
//           font-weight: 300;
//           color: #b0a898;
//           display: block;
//         }
//         .cart-addon-btn.selected .cart-addon-price { color: rgba(255,255,255,0.55); }

//         /* ── AI RECOMMENDATIONS SECTION ── */
//         .ai-recommendations-section {
//           background: linear-gradient(135deg, #fff 0%, #fefdfb 100%);
//           border: 1.5px solid #eceae5;
//           border-radius: 24px;
//           padding: 28px 24px;
//           margin-bottom: 24px;
//           animation: fadeUp 0.5s ease both;
//         }
//         .ai-recommendations-header {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           margin-bottom: 8px;
//         }
//         .ai-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 6px 12px;
//           border-radius: 999px;
//           font-size: 10px;
//           font-weight: 500;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//         }
//         .ai-recommendations-title {
//           font-size: 20px;
//           font-weight: 200;
//           color: #1a1a1a;
//           letter-spacing: -0.03em;
//           margin-bottom: 6px;
//         }
//         .ai-recommendations-subtitle {
//           font-size: 13px;
//           font-weight: 300;
//           color: #b0a898;
//           font-style: italic;
//           margin-bottom: 20px;
//         }

//         /* ── RECOMMENDATION CARDS ── */
//         .recommendations-grid {
//           display: flex;
//           gap: 12px;
//         }
//         @media (min-width: 640px) {
//           .recommendations-grid {
//             display: grid;
//             grid-template-columns: repeat(3, 1fr);
//             gap: 16px;
//           }
//         }
//         @media (min-width: 900px) {
//           .recommendations-grid {
//             grid-template-columns: repeat(4, 1fr);
//           }
//         }

//         .recommendation-card {
//           background: #fff;
//           border: 1.5px solid #eceae5;
//           border-radius: 20px;
//           overflow: hidden;
//           transition: all 0.3s ease;
//           cursor: pointer;
//           display: flex;
//           flex-direction: column;
//           min-width: 180px;
//           flex-shrink: 0;
//         }
//         @media (min-width: 640px) {
//           .recommendation-card {
//             min-width: auto;
//             flex-shrink: 1;
//           }
//         }
//         .recommendation-card:hover {
//           border-color: #667eea;
//           box-shadow: 0 8px 28px rgba(102, 126, 234, 0.15);
//           transform: translateY(-2px);
//         }

//         .recommendation-image-wrap {
//           position: relative;
//           aspect-ratio: 1 / 1;
//           background: #f9f8f6;
//           overflow: hidden;
//         }
//         .recommendation-badge {
//           position: absolute;
//           top: 10px;
//           right: 10px;
//           background: rgba(26, 26, 26, 0.75);
//           backdrop-filter: blur(10px);
//           color: white;
//           padding: 4px 10px;
//           border-radius: 999px;
//           font-size: 9px;
//           font-weight: 500;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//           z-index: 2;
//         }
//         .recommendation-image-placeholder {
//           width: 100%;
//           height: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 32px;
//         }

//         .recommendation-body {
//           padding: 14px 16px 16px;
//           display: flex;
//           flex-direction: column;
//           flex-grow: 1;
//         }
//         .recommendation-name {
//           font-size: 14px;
//           font-weight: 400;
//           color: #1a1a1a;
//           letter-spacing: -0.01em;
//           margin-bottom: 4px;
//           line-height: 1.3;
//         }
//         .recommendation-reason {
//           font-size: 11px;
//           font-weight: 300;
//           color: #888;
//           margin-bottom: 12px;
//           line-height: 1.4;
//           font-style: italic;
//         }
//         .recommendation-price-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-top: auto;
//         }
//         .recommendation-price {
//           font-size: 16px;
//           font-weight: 300;
//           color: #1a1a1a;
//           letter-spacing: -0.02em;
//         }
//         .recommendation-currency {
//           font-size: 9px;
//           color: #b0a898;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//           margin-left: 3px;
//         }
//         .recommendation-add-btn {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           border: none;
//           width: 32px;
//           height: 32px;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: transform 0.2s, box-shadow 0.2s;
//         }
//         .recommendation-add-btn:hover {
//           transform: scale(1.05);
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
//         }
//         .recommendation-add-btn:active {
//           transform: scale(0.95);
//         }

//         /* Loading Skeleton */
//         .skeleton-card {
//           background: #fff;
//           border: 1.5px solid #eceae5;
//           border-radius: 20px;
//           overflow: hidden;
//           min-width: 180px;
//           flex-shrink: 0;
//         }
//         @media (min-width: 640px) {
//           .skeleton-card {
//             min-width: auto;
//           }
//         }
//         .skeleton-image {
//           aspect-ratio: 1 / 1;
//           background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
//           background-size: 200% 100%;
//           animation: shimmer 1.5s infinite;
//         }
//         .skeleton-body {
//           padding: 14px 16px 16px;
//         }
//         .skeleton-line {
//           height: 12px;
//           background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
//           background-size: 200% 100%;
//           animation: shimmer 1.5s infinite;
//           border-radius: 6px;
//           margin-bottom: 8px;
//         }
//         .skeleton-line.short {
//           width: 60%;
//         }
//         .skeleton-line.medium {
//           width: 80%;
//         }

//         /* ── CHECKOUT SECTION ── */
//         .checkout-section {
//           background: #fff;
//           border: 1px solid #eceae5;
//           border-radius: 24px;
//           padding: 28px 24px;
//           margin-bottom: 24px;
//         }
//         .checkout-total-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-bottom: 20px;
//           padding-bottom: 20px;
//           border-bottom: 1px solid #eceae5;
//         }
//         .checkout-total-label {
//           font-size: 11px;
//           font-weight: 400;
//           letter-spacing: 0.18em;
//           text-transform: uppercase;
//           color: #b0a898;
//         }
//         .checkout-total-value {
//           font-size: 32px;
//           font-weight: 200;
//           color: #1a1a1a;
//           letter-spacing: -0.04em;
//         }
//         .checkout-currency {
//           font-size: 12px;
//           color: #b0a898;
//           letter-spacing: 0.1em;
//           margin-left: 6px;
//         }
//         .checkout-btn {
//           width: 100%;
//           background: #1a1a1a;
//           color: #fff;
//           border: none;
//           border-radius: 16px;
//           padding: 18px 24px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 12px;
//           font-weight: 500;
//           letter-spacing: 0.18em;
//           text-transform: uppercase;
//           cursor: pointer;
//           transition: background 0.2s, transform 0.15s, opacity 0.2s;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 10px;
//         }
//         .checkout-btn:hover {
//           background: #2a2a2a;
//         }
//         .checkout-btn:active {
//           transform: scale(0.98);
//         }
//         .checkout-btn:disabled {
//           opacity: 0.45;
//           cursor: not-allowed;
//         }
//       `}</style>

//       <div className="cart-page">

//         {/* TOP BAR */}
//         <div className="cart-topbar">
//           <button className="cart-back-btn" onClick={() => router.back()}>
//             <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
//             </svg>
//             Back
//           </button>
//           <span className="cart-topbar-center">{isEditMode ? "Edit Order" : "Cart"}</span>
//           <span className="cart-topbar-count">{cartCount} item{cartCount !== 1 ? "s" : ""}</span>
//         </div>

//         {/* HERO */}
//         <div className="cart-hero">
//           <h1 className="cart-hero-title">{isEditMode ? "Edit Your Order" : "Your Cart"}</h1>
//           <p className="cart-hero-sub">{cartCount} items · {total} {currency}</p>
//         </div>

//         <div className="cart-content">

//           {/* ITEM GRID - HORIZONTAL SCROLL ON MOBILE */}
//           <div className="horizontal-scroll-container" ref={itemsScrollRef}>
//             <div className="cart-grid">
//               {cart.map((item, index) => (
//                 <div
//                   key={index}
//                   onClick={() => setSelectedItemIndex(index)}
//                   className={`cart-item-card ${selectedItemIndex === index ? "selected" : ""}`}
//                   style={{ animationDelay: `${index * 0.05}s` }}
//                 >
//                   {/* Image */}
//                   <div className="cart-item-image-wrap">
//                     {item.image ? (
//                       <Image src={item.image} alt={item.name} fill className="object-cover" style={{ transition: "transform 0.8s ease" }} />
//                     ) : (
//                       <div className="cart-item-image-placeholder">🍽️</div>
//                     )}
//                   </div>

//                   {/* Body */}
//                   <div className="cart-item-body">
//                     <div className="cart-item-name">{item.name}</div>
//                     <div style={{ marginBottom: 12 }}>
//                       <span className="cart-item-price">{item.price}</span>
//                       <span className="cart-item-price-currency">{currency}</span>
//                     </div>

//                     <div className="cart-item-controls">
//                       <div className="cart-qty-wrap">
//                         <button className="cart-qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }}>
//                           <Minus size={12} strokeWidth={2} />
//                         </button>
//                         <span className="cart-qty-num">{item.quantity}</span>
//                         <button className="cart-qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }}>
//                           <Plus size={12} strokeWidth={2} />
//                         </button>
//                       </div>
//                       <button className="cart-remove-btn" onClick={(e) => { e.stopPropagation(); removeItem(index); }}>
//                         <Trash2 size={15} strokeWidth={1.5} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ADDONS PANEL - HORIZONTAL SCROLL ON MOBILE */}
//           <AnimatePresence>
//             {selectedItem.addons?.length > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 8 }}
//                 transition={{ duration: 0.28, ease: "easeOut" }}
//                 className="cart-addons-panel"
//               >
//                 <div className="cart-addons-title">Extras for</div>
//                 <div className="cart-addons-item-name">{selectedItem.name}</div>
//                 <div className="horizontal-scroll-container" ref={addonsScrollRef}>
//                   <div className="cart-addons-grid">
//                     {selectedItem.addons.map((addon, idx) => {
//                       const isSelected = selectedItem.selectedAddons?.some(a => a.name === addon.name);
//                       return (
//                         <button
//                           key={idx}
//                           onClick={() => toggleAddon(idx)}
//                           className={`cart-addon-btn ${isSelected ? "selected" : ""}`}
//                         >
//                           <span className="cart-addon-name">{addon.name}</span>
//                           <span className="cart-addon-price">+ {addon.price} {currency}</span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* AI RECOMMENDATIONS SECTION */}
//           <div className="ai-recommendations-section">
//             <div className="ai-recommendations-header">
//               <span className="ai-badge">
//                 <Sparkles size={12} />
//                 AI Powered
//               </span>
//             </div>
//             <h2 className="ai-recommendations-title">Perfect Pairings for You</h2>
//             <p className="ai-recommendations-subtitle">
//               {loadingRecommendations 
//                 ? "Analyzing your order..." 
//                 : `Based on your order and ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"} preferences`
//               }
//             </p>

//             <div className="horizontal-scroll-container" ref={recommendationsScrollRef}>
//               <div className="recommendations-grid">
//                 {loadingRecommendations ? (
//                   // Loading skeletons
//                   Array(4).fill(0).map((_, idx) => (
//                     <div key={idx} className="skeleton-card">
//                       <div className="skeleton-image" />
//                       <div className="skeleton-body">
//                         <div className="skeleton-line medium" />
//                         <div className="skeleton-line short" />
//                       </div>
//                     </div>
//                   ))
//                 ) : aiRecommendations.length > 0 ? (
//                   aiRecommendations.map((rec, idx) => (
//                     <div key={idx} className="recommendation-card" onClick={() => addRecommendedToCart(rec)}>
//                       <div className="recommendation-image-wrap">
//                         {rec.badge && (
//                           <div className="recommendation-badge">{rec.badge}</div>
//                         )}
//                         {rec.image ? (
//                           <Image src={rec.image} alt={rec.name} fill className="object-cover" />
//                         ) : (
//                           <div className="recommendation-image-placeholder">
//                             {rec.emoji || "🍴"}
//                           </div>
//                         )}
//                       </div>
//                       <div className="recommendation-body">
//                         <h4 className="recommendation-name">{rec.name}</h4>
//                         <p className="recommendation-reason">{rec.reason}</p>
//                         <div className="recommendation-price-row">
//                           <div>
//                             <span className="recommendation-price">{rec.price || rec.currentPrice}</span>
//                             <span className="recommendation-currency">{currency}</span>
//                           </div>
//                           <button className="recommendation-add-btn" onClick={(e) => { e.stopPropagation(); addRecommendedToCart(rec); }}>
//                             <Plus size={16} strokeWidth={2.5} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 20px", color: "#b0a898" }}>
//                     <TrendingUp size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
//                     <p style={{ fontSize: 14, fontWeight: 300, fontStyle: "italic" }}>
//                       No recommendations available right now
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* CHECKOUT SECTION (NON-STICKY) */}
//           <div className="checkout-section">
//             <div className="checkout-total-row">
//               <span className="checkout-total-label">Grand Total</span>
//               <div>
//                 <span className="checkout-total-value">{total}</span>
//                 <span className="checkout-currency">{currency}</span>
//               </div>
//             </div>
//             <button
//               className="checkout-btn"
//               disabled={saving}
//               onClick={() => isEditMode ? handleSaveChanges() : router.push("/user/checkout")}
//             >
//               {saving ? (
//                 <>
//                   <div style={{ width: 14, height: 14, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
//                   Saving…
//                 </>
//               ) : isEditMode ? (
//                 <>
//                   <Save size={14} strokeWidth={1.5} />
//                   Update Order
//                 </>
//               ) : (
//                 "Proceed to Checkout →"
//               )}
//             </button>
//           </div>

//         </div>

//       </div>
//     </>
//   );
// }

// export default function CartPage() {
//   return (
//     <Suspense fallback={
//       <div style={{ minHeight: "100vh", background: "#f5f4f1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
//         <div style={{ fontSize: 13, fontWeight: 300, color: "#888", letterSpacing: "0.1em" }}>Loading…</div>
//       </div>
//     }>
//       <CartContent />
//     </Suspense>
//   );
// }