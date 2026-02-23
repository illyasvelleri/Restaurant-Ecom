// // app/admin/combos/page.js → FINAL 2025 MOBILE ADMIN (100% FIXED)

// "use client";

// import { useState, useEffect, useRef } from 'react';
// import {
//   Search, Plus, X, Upload, Check, ChevronRight,
//   Package, Loader2
// } from 'lucide-react';
// import Image from 'next/image';
// import toast from 'react-hot-toast';
// import AdminFooter from '../../components/footer';

// const MAX_COMBOS = 10;

// export default function ComboOffersPage() {
//   const [combos, setCombos] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [comboRes, prodRes] = await Promise.all([
//         fetch('/api/admin/combos'),
//         fetch('/api/admin/products')
//       ]);
//       if (comboRes.ok) setCombos((await comboRes.json()) || []);
//       if (prodRes.ok) setAllProducts((await prodRes.json()) || []);
//     } catch (err) {
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const availableProducts = allProducts
//     .filter(p => p.status === 'active')
//     .filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase() || ""));

//   const toggleProduct = (product) => {
//     setSelectedProducts(prev => {
//       if (prev.some(p => p._id === product._id)) {
//         return prev.filter(p => p._id !== product._id);
//       }
//       if (prev.length >= 6) {
//         toast.error("Maximum 6 items per combo");
//         return prev;
//       }
//       return [...prev, product];
//     });
//   };

//   const isSelected = (id) => selectedProducts.some(p => p._id === id);

//   const totalPrice = selectedProducts.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);
//   const comboPrice = Math.round(totalPrice * 0.85);

//   const createCombo = async (formData) => {
//     if (combos.length >= MAX_COMBOS) {
//       toast.error("Maximum 10 combos allowed!");
//       return;
//     }
//     if (selectedProducts.length < 2) {
//       toast.error("Select at least 2 products");
//       return;
//     }

//     try {
//       const res = await fetch('/api/admin/combos', {
//         method: 'POST',
//         body: formData
//       });
//       if (!res.ok) throw new Error("Failed");
//       toast.success("Combo created!");
//       setShowCreateModal(false);
//       setSelectedProducts([]);
//       fetchData();
//     } catch (err) {
//       toast.error("Failed to create combo");
//     }
//   };

//   const removeCombo = async (id) => {
//     if (!confirm("Delete this combo?")) return;
//     try {
//       await fetch(`/api/admin/combos?id=${id}`, { method: 'DELETE' });
//       toast.success("Combo removed");
//       fetchData();
//     } catch (err) {
//       toast.error("Failed to remove");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* HEADER */}
//       <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
//         <div className="px-4 py-4">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Combo Offers</h1>
//               <p className="text-sm text-gray-500">Max 10 active combos</p>
//             </div>
//             <div className={`text-2xl font-bold ${combos.length >= MAX_COMBOS ? "text-red-600" : "text-emerald-600"}`}>
//               {combos.length}/{MAX_COMBOS}
//             </div>
//           </div>

//           {/* SEARCH */}
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search products..."
//               className="w-full pl-12 pr-5 py-4 bg-gray-100 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-black/10"
//             />
//           </div>
//         </div>
//       </div>

//       {/* CURRENT COMBOS */}
//       <div className="px-4 py-5">
//         <h2 className="text-lg font-bold text-gray-900 mb-4">Active Combos</h2>
//         {combos.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
//             <Package className="mx-auto text-gray-300 mb-4" size={56} />
//             <p className="text-gray-500">No combo offers yet</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {combos.map((combo) => (
//               <div key={combo._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
//                 <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
//                   {combo.image ? (
//                     <Image src={combo.image} alt={combo.title} width={80} height={80} className="object-cover" />
//                   ) : (
//                     <div className="w-full h-full bg-gray-200 border-2 border-dashed" />
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-bold text-gray-900">{combo.title}</h3>
//                   <p className="text-sm text-gray-600">{combo.items?.length || 0} items • {combo.price}</p>
//                 </div>
//                 <button
//                   onClick={() => removeCombo(combo._id)}
//                   className="p-3 bg-red-50 hover:bg-red-100 rounded-xl"
//                 >
//                   <X className="text-red-600" size={18} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* SELECT PRODUCTS */}
//       <div className="px-4 pb-32">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-900">Create New Combo</h2>
//           <span className="text-sm text-gray-500">{selectedProducts.length} selected</span>
//         </div>

//         {loading ? (
//           <div className="py-20 text-center">
//             <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-400" />
//           </div>
//         ) : availableProducts.length === 0 ? (
//           <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
//             <p className="text-gray-500">No products available</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             {availableProducts.map((product) => {
//               const selected = isSelected(product._id);
//               return (
//                 <button
//                   key={product._id}
//                   onClick={() => toggleProduct(product)}
//                   className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all overflow-hidden ${selected ? "border-black ring-4 ring-black/10" : "border-gray-200"
//                     }`}
//                 >
//                   <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100">
//                     {product.image ? (
//                       <Image src={product.image} alt={product.name} fill className="object-cover" />
//                     ) : (
//                       <div className="w-full h-full bg-gray-200 border-2 border-dashed" />
//                     )}
//                     {selected && (
//                       <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//                         <Check className="text-white" size={40} />
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-3">
//                     <p className="font-semibold text-gray-900 truncate">{product.name}</p>
//                     <p className="text-lg font-bold text-gray-900 mt-1">{product.price}</p>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         {/* FIXED BOTTOM BAR */}
//         {selectedProducts.length >= 2 && (
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
//             <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
//               <div className="flex-1">
//                 <p className="text-sm text-gray-600">Selected {selectedProducts.length} items</p>
//                 <p className="text-xl font-bold">
//                   {totalPrice.toFixed(2)} → <span className="text-emerald-600">{comboPrice}</span>
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="px-8 py-4 bg-black text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-800 transition shadow-lg"
//               >
//                 <Plus size={22} />
//                 Create Combo
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* MODAL */}
//       {showCreateModal && (
//         <CreateComboModal
//           selectedProducts={selectedProducts}
//           totalPrice={totalPrice}
//           comboPrice={comboPrice}
//           onClose={() => {
//             setShowCreateModal(false);
//             setSelectedProducts([]);
//           }}
//           onSuccess={() => {
//             setShowCreateModal(false);
//             setSelectedProducts([]);
//             fetchData();
//           }}
//         />
//       )}
//       <AdminFooter />
//     </div>
//   );
// }

// // CREATE COMBO MODAL
// function CreateComboModal({ selectedProducts, totalPrice, comboPrice, onClose, onSuccess }) {
//   const [title, setTitle] = useState(`Combo Deal (${selectedProducts.length} items)`);
//   const [price, setPrice] = useState(comboPrice);
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('price', price);
//     formData.append('productIds', JSON.stringify(selectedProducts.map(p => p._id)));
//     formData.append('originalPrice', totalPrice);
//     if (image) formData.append('image', image);

//     try {
//       const res = await fetch('/api/admin/combos', {
//         method: 'POST',
//         body: formData
//       });
//       if (!res.ok) throw new Error();
//       toast.success("Combo created!");
//       onSuccess();
//     } catch {
//       toast.error("Failed to create combo");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl max-w-lg w-full p-6 max-h-screen overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">Create Combo</h2>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
//             <X size={28} />
//           </button>
//         </div>

//         {/* Thumbnail */}
//         <div className="mb-6 text-center">
//           <div className="relative w-48 h-48 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl overflow-hidden mb-4">
//             {preview ? (
//               <Image src={preview} alt="Preview" fill className="object-cover" />
//             ) : (
//               <div className="flex items-center justify-center h-full text-gray-400">
//                 <Package size={64} />
//               </div>
//             )}
//           </div>
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             className="px-6 py-3 bg-black text-white rounded-2xl font-bold flex items-center gap-2 mx-auto"
//           >
//             <Upload size={20} /> Upload Thumbnail
//           </button>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) {
//                 setImage(file);
//                 setPreview(URL.createObjectURL(file));
//               }
//             }}
//           />
//         </div>

//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Combo Title"
//           className="w-full px-5 py-4 rounded-2xl border border-gray-300 mb-4 text-lg"
//         />

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <p className="text-sm text-gray-500 mb-1">Original Price</p>
//             <p className="text-2xl font-bold line-through text-gray-400">{totalPrice.toFixed(2)}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500 mb-1">Combo Price</p>
//             <input
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               className="w-full px-5 py-3 rounded-xl border-2 border-emerald-500 text-2xl font-bold text-center"
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleSubmit}
//           className="w-full py-5 bg-black text-white rounded-2xl font-bold text-xl hover:bg-gray-800 transition shadow-lg"
//         >
//           Create Combo Offer
//         </button>
//       </div>
//     </div>
//   );
// }

// app/admin/combos/page.js → PREMIUM DARK REDESIGN 2025 (matching admin suite)
// Inter font | Dark glass theme | Glows/Hovers/Skeletons | 100% ORIGINAL LOGIC PRESERVED

"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, X, Upload, Check, ChevronRight,
  Package, Loader2
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import AdminFooter from '../../components/footer';

// ─────────────────────────────────────────────────────────
// PULSE DOT (same as dashboard)
// ─────────────────────────────────────────────────────────
function PulseDot({ color = "#10b981", size = 8 }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: size, height: size, flexShrink: 0 }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: color, animation: "dbPulse 2s ease-in-out infinite",
      }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(255,255,255,0.07)",
      animation: "dbUp 0.6s ease both",
    }}>
      <div style={{
        height: 180,
        background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
        backgroundSize: "200% 100%",
        animation: "dbShimmer 1.6s ease infinite",
      }} />
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 24, width: '70%', borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ height: 16, width: '40%', borderRadius: 4, background: "rgba(255,255,255,0.04)" }} />
        <div style={{ height: 28, width: '50%', borderRadius: 8, background: "rgba(255,255,255,0.06)" }} />
      </div>
    </div>
  );
}

const MAX_COMBOS = 10;

export default function ComboOffersPage() {
  const [combos, setCombos] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [comboRes, prodRes] = await Promise.all([
        fetch('/api/admin/combos'),
        fetch('/api/admin/products')
      ]);
      if (comboRes.ok) setCombos((await comboRes.json()) || []);
      if (prodRes.ok) setAllProducts((await prodRes.json()) || []);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableProducts = allProducts
    .filter(p => p.status === 'active')
    .filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase() || ""));

  const toggleProduct = (product) => {
    setSelectedProducts(prev => {
      if (prev.some(p => p._id === product._id)) {
        return prev.filter(p => p._id !== product._id);
      }
      if (prev.length >= 6) {
        toast.error("Maximum 6 items per combo");
        return prev;
      }
      return [...prev, product];
    });
  };

  const isSelected = (id) => selectedProducts.some(p => p._id === id);

  const totalPrice = selectedProducts.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);
  const comboPrice = Math.round(totalPrice * 0.85);

  const createCombo = async (formData) => {
    if (combos.length >= MAX_COMBOS) {
      toast.error("Maximum 10 combos allowed!");
      return;
    }
    if (selectedProducts.length < 2) {
      toast.error("Select at least 2 products");
      return;
    }

    try {
      const res = await fetch('/api/admin/combos', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Combo created!");
      setShowCreateModal(false);
      setSelectedProducts([]);
      fetchData();
    } catch (err) {
      toast.error("Failed to create combo");
    }
  };

  const removeCombo = async (id) => {
    if (!confirm("Delete this combo?")) return;
    try {
      await fetch(`/api/admin/combos?id=${id}`, { method: 'DELETE' });
      toast.success("Combo removed");
      fetchData();
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes dbUp       { from{opacity:0;transform:translateY(18px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes dbPulse    { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(2.4);opacity:0;} }
        @keyframes dbShimmer  { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }

        .combo-page {
          font-family:'Inter', system-ui, sans-serif;
          min-height:100vh;
          background:#080b10;
          color:#fff;
          padding-bottom:120px;
        }

        .combo-topbar {
          position:sticky; top:0; z-index:50;
          background:rgba(8,11,16,0.88);
          backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding:18px 24px;
        }

        .combo-title {
          font-size:clamp(22px,4vw,30px);
          font-weight:500; letter-spacing:-0.02em;
        }

        .combo-search {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px;
          padding:12px 16px 12px 44px;
          color:#fff;
          font-size:14px;
        }

        .combo-search::placeholder { color:rgba(255,255,255,0.3); }

        .combo-stat-card {
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:16px;
          padding:16px 20px;
          transition:all 0.3s;
        }

        .combo-stat-card:hover {
          transform:translateY(-4px);
          box-shadow:0 12px 32px rgba(0,0,0,0.4);
        }

        .combo-card {
          background:rgba(255,255,255,0.015);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:20px;
          overflow:hidden;
          transition:all 0.3s ease;
        }

        .combo-card:hover {
          transform:translateY(-6px) scale(1.02);
          box-shadow:0 20px 48px rgba(0,0,0,0.5);
        }

        .combo-empty {
          padding:120px 24px;
          text-align:center;
          color:rgba(255,255,255,0.4);
          font-style:italic;
        }

        .max-limit-badge {
          background:rgba(239,68,68,0.15);
          border:1px solid rgba(239,68,68,0.4);
          color:#ef4444;
          padding:6px 14px;
          border-radius:12px;
          font-size:13px;
          font-weight:500;
        }

        .bottom-bar {
          background:rgba(8,11,16,0.92);
          backdrop-filter:blur(16px);
          border-top:1px solid rgba(255,255,255,0.08);
          box-shadow:0 -4px 20px rgba(0,0,0,0.6);
        }
      `}</style>

      <div className="combo-page">

        {/* ── TOPBAR ── */}
        <div className="combo-topbar">
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PulseDot color="#f59e0b" size={9} />
              <h1 className="combo-title">Combo Offers</h1>
            </div>

            <div style={{
              background: combos.length >= MAX_COMBOS ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
              border: combos.length >= MAX_COMBOS ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(16,185,129,0.4)',
              color: combos.length >= MAX_COMBOS ? '#ef4444' : '#10b981',
              padding: '8px 16px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
            }}>
              {combos.length} / {MAX_COMBOS}
            </div>
          </div>

          {/* Search */}
          <div style={{ maxWidth: 1400, margin: '16px auto 0', position: 'relative' }}>
            <Search size={18} style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.4)'
            }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products to add..."
              className="combo-search w-full"
            />
          </div>
        </div>

        {/* ── ACTIVE COMBOS ── */}
        <div style={{ maxWidth: 1400, margin: '32px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>Active Combos</h2>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              {combos.length} offers
            </span>
          </div>

          {combos.length === 0 ? (
            <div className="combo-empty">
              <Package size={72} className="mx-auto mb-6 opacity-40" />
              <p style={{ fontSize: 20, fontWeight: 500 }}>
                No combo offers active
              </p>
              <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.5)' }}>
                Create up to {MAX_COMBOS} combo deals
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {combos.map((combo) => (
                <div key={combo._id} className="combo-card">
                  <div className="relative h-44 bg-black/30">
                    {combo.image ? (
                      <Image
                        src={combo.image}
                        alt={combo.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={48} className="text-white/30" />
                      </div>
                    )}
                    <button
                      onClick={() => removeCombo(combo._id)}
                      className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-700 rounded-full transition text-white shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ padding: 16 }}>
                    <p style={{
                      fontSize: 17, fontWeight: 500,
                      marginBottom: 6, color: '#fff'
                    }}>
                      {combo.title}
                    </p>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                      {combo.items?.length || 0} items • ₹{combo.price || '—'}
                    </p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                      Original: ₹{combo.originalPrice || '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SELECT PRODUCTS TO CREATE COMBO ── */}
        <div style={{ maxWidth: 1400, margin: '48px auto 0', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>Create New Combo</h2>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              {selectedProducts.length} selected
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="combo-empty">
              <Package size={72} className="mx-auto mb-6 opacity-40" />
              <p style={{ fontSize: 20, fontWeight: 500 }}>
                {searchQuery ? 'No matching products found' : 'No active products available'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableProducts.map((product) => {
                const selected = isSelected(product._id);
                return (
                  <div
                    key={product._id}
                    className="combo-card cursor-pointer"
                    onClick={() => toggleProduct(product)}
                  >
                    <div className="relative h-44 bg-black/30 group">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={48} className="text-white/30" />
                        </div>
                      )}
                      {selected && (
                        <div className="absolute inset-0 bg-emerald-600/40 flex items-center justify-center">
                          <Check size={48} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div style={{ padding: 16 }}>
                      <p style={{
                        fontSize: 16, fontWeight: 500,
                        marginBottom: 6, color: '#fff'
                      }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: 18, fontWeight: 600, color: '#f59e0b' }}>
                        ₹{product.price || "N/A"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── FIXED BOTTOM BAR (when combo ready) ── */}
        {selectedProducts.length >= 2 && (
          <div className="fixed bottom-0 left-0 right-0 bottom-bar p-4 shadow-2xl z-40">
            <div style={{
              maxWidth: 1400, margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
            }}>
              <div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  {selectedProducts.length} items selected
                </p>
                <p style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>
                  ₹{totalPrice.toFixed(2)} → <span style={{ color: '#10b981' }}>₹{comboPrice}</span>
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-medium hover:from-amber-500 hover:to-amber-400 transition shadow-lg flex items-center gap-2"
              >
                <Plus size={20} />
                Create Combo
              </button>
            </div>
          </div>
        )}

        {/* ── CREATE COMBO MODAL ── */}
        {showCreateModal && (
          <CreateComboModal
            selectedProducts={selectedProducts}
            totalPrice={totalPrice}
            comboPrice={comboPrice}
            onClose={() => {
              setShowCreateModal(false);
            }}
            onSuccess={() => {
              setShowCreateModal(false);
              setSelectedProducts([]);
              fetchData();
            }}
          />
        )}

        <AdminFooter />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// CREATE COMBO MODAL — DARK VERSION
// ─────────────────────────────────────────────────────────
function CreateComboModal({ selectedProducts, totalPrice, comboPrice, onClose, onSuccess }) {
  const [title, setTitle] = useState(`Combo Deal (${selectedProducts.length} items)`);
  const [price, setPrice] = useState(comboPrice);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('productIds', JSON.stringify(selectedProducts.map(p => p._id)));
    formData.append('originalPrice', totalPrice);
    if (image) formData.append('image', image);

    try {
      const res = await fetch('/api/admin/combos', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error();
      toast.success("Combo created!");
      onSuccess();
    } catch {
      toast.error("Failed to create combo");
    }
  };

  return (
    <>
      <style>{`
        .modal-overlay { font-family: 'Inter', system-ui, sans-serif; }
        .modal-content {
          background: rgba(10,14,22,0.98);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          box-shadow: 0 20px 70px rgba(0,0,0,0.7);
          animation: dbUp 0.45s ease both;
        }
        .modal-header {
          background: rgba(8,11,16,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .input-dark {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          border-radius: 14px;
          padding: 14px 16px;
          transition: all 0.2s;
        }
        .input-dark:focus {
          border-color: rgba(245,158,11,0.5);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
        }
        .submit-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          transition: all 0.25s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(245,158,11,0.4);
        }
        .cancel-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.2s;
        }
        .cancel-btn:hover { background: rgba(255,255,255,0.12); }
      `}</style>

      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-overlay">
        <div className="modal-content w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
          <div className="modal-header sticky top-0 z-10 p-6 flex justify-between items-center -mx-6 -mt-6 mb-6">
            <h2 className="text-2xl font-semibold text-white tracking-tight">Create Combo</h2>
            <button
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-white/80 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Thumbnail */}
          <div className="mb-8 text-center">
            <div className="relative w-48 h-48 mx-auto bg-black/40 rounded-2xl overflow-hidden border border-white/10 mb-4">
              {preview ? (
                <Image src={preview} alt="Combo preview" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-white/30">
                  <Package size={64} />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-medium hover:from-amber-500 hover:to-amber-400 transition shadow-lg flex items-center gap-2 mx-auto"
            >
              <Upload size={20} />
              Upload Thumbnail (optional)
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2 text-white/90">Combo Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Family Feast Combo"
                className="input-dark w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-white/60 mb-1">Original Price</p>
                <p className="text-2xl font-bold text-white/90 line-through opacity-70">
                  ₹{totalPrice.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Combo Price</p>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input-dark w-full text-center text-2xl font-bold"
                />
              </div>
            </div>

            <div className="text-sm text-white/60 bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="mb-2">Selected items ({selectedProducts.length}):</p>
              <ul className="list-disc pl-5 space-y-1">
                {selectedProducts.map(p => (
                  <li key={p._id}>{p.name} • ₹{p.price}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn flex-1"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="submit-btn flex-1"
            >
              Create Combo Offer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}