// // app/admin/popular/page.js → FINAL 2025 (100% CRASH-PROOF)

// "use client";

// import { useState, useEffect } from 'react';
// import { Search, Star, Plus, X, Loader2 } from 'lucide-react';
// import Image from 'next/image';
// import toast from 'react-hot-toast';
// import AdminFooter from '../../components/footer';

// const MAX_POPULAR = 8;

// export default function PopularProductsPage() {
//   const [allProducts, setAllProducts] = useState([]);
//   const [popularItems, setPopularItems] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [productsRes, popularRes] = await Promise.all([
//         fetch('/api/admin/products'),
//         fetch('/api/admin/popular')
//       ]);

//       if (productsRes.ok) {
//         const data = await productsRes.json();
//         setAllProducts(Array.isArray(data) ? data : []);
//       }
//       if (popularRes.ok) {
//         const data = await popularRes.json();
//         setPopularItems(Array.isArray(data) ? data : []);
//       }
//     } catch (err) {
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const addToPopular = async (product) => {
//     if (popularItems.length >= MAX_POPULAR) {
//       toast.error(`Maximum ${MAX_POPULAR} popular items allowed!`);
//       return;
//     }

//     try {
//       const res = await fetch('/api/admin/popular', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ productId: product._id })
//       });

//       if (!res.ok) throw new Error();
//       toast.success(`"${product.name}" added to Popular!`);
//       fetchData();
//     } catch {
//       toast.error("Failed to add");
//     }
//   };

//   const removeFromPopular = async (popularId) => {
//     try {
//       await fetch(`/api/admin/popular?id=${popularId}`, { method: 'DELETE' });
//       toast.success("Removed from Popular");
//       fetchData();
//     } catch {
//       toast.error("Failed to remove");
//     }
//   };

//   const filteredProducts = allProducts
//     .filter(p => !popularItems.some(pi => pi.product?._id === p._id))
//     .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* MOBILE HEADER */}
//       <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Popular Items</h1>
//               <p className="text-sm text-gray-500">Max 8 items shown first</p>
//             </div>
//             <div className={`text-2xl font-bold ${popularItems.length >= MAX_POPULAR ? "text-red-600" : "text-emerald-600"}`}>
//               {popularItems.length}/{MAX_POPULAR}
//             </div>
//           </div>

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

//       {/* CURRENT POPULAR ITEMS — FULLY SAFE */}
//       <div className="px-4 py-5">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-900">Currently Popular</h2>
//           <span className="text-sm text-gray-500">{popularItems.length} items</span>
//         </div>

//         {popularItems.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
//             <Star className="mx-auto text-gray-300 mb-4" size={56} />
//             <p className="text-gray-500">No popular items yet</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             {popularItems.map(({ _id, product }) => (
//               <div key={_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="relative h-32 bg-gradient-to-br from-orange-50 to-orange-100">
//                   {product?.image ? (
//                     <Image
//                       src={product.image}
//                       alt={product.name || "Product"}
//                       fill
//                       className="object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
//                       <p className="text-gray-500 text-sm">No Image</p>
//                     </div>
//                   )}
//                   <div className="absolute top-2 right-2">
//                     <button
//                       onClick={() => removeFromPopular(_id)}
//                       className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
//                     >
//                       <X size={16} className="text-gray-700" />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="p-3">
//                   <p className="font-semibold text-gray-900 truncate">
//                     {product?.name || "Deleted Product"}
//                   </p>
//                   <p className="text-lg font-bold text-gray-900 mt-1">
//                     {product?.price ? `${product.price}` : "N/A"}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ADD FROM PRODUCTS */}
//       <div className="px-4 pb-32">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-900">Add to Popular</h2>
//           <span className="text-sm text-gray-500">{filteredProducts.length} available</span>
//         </div>

//         {loading ? (
//           <div className="py-20 text-center">
//             <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-400" />
//           </div>
//         ) : filteredProducts.length === 0 ? (
//           <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
//             <p className="text-gray-500">No products to add</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             {filteredProducts.map(product => (
//               <button
//                 key={product._id}
//                 onClick={() => addToPopular(product)}
//                 className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all"
//               >
//                 <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100">
//                   {product.image ? (
//                     <Image
//                       src={product.image}
//                       alt={product.name}
//                       fill
//                       className="object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
//                       <p className="text-gray-500 text-sm">No Image</p>
//                     </div>
//                   )}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition flex items-end justify-center pb-4">
//                     <div className="px-4 py-2 bg-white text-black rounded-full font-bold text-sm flex items-center gap-2">
//                       <Plus size={18} />
//                       Add
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3">
//                   <p className="font-semibold text-gray-900 truncate">{product.name}</p>
//                   <p className="text-lg font-bold text-gray-900 mt-1">{product.price}</p>
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//       <AdminFooter />
//     </div>
//   );
// }


// app/admin/popular/page.js → PREMIUM DARK REDESIGN 2025 (matching admin suite)
// Inter font | Dark glass theme | Glows/Hovers/Skeletons | 100% ORIGINAL LOGIC PRESERVED

"use client";

import { useState, useEffect } from 'react';
import { Search, Star, Plus, X, Loader2, RefreshCw } from 'lucide-react';
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

const MAX_POPULAR = 8;

export default function PopularProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, popularRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/popular')
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setAllProducts(Array.isArray(data) ? data : []);
      }
      if (popularRes.ok) {
        const data = await popularRes.json();
        setPopularItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addToPopular = async (product) => {
    if (popularItems.length >= MAX_POPULAR) {
      toast.error(`Maximum ${MAX_POPULAR} popular items allowed!`);
      return;
    }

    try {
      const res = await fetch('/api/admin/popular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id })
      });

      if (!res.ok) throw new Error();
      toast.success(`"${product.name}" added to Popular!`);
      fetchData();
    } catch {
      toast.error("Failed to add");
    }
  };

  const removeFromPopular = async (popularId) => {
    try {
      await fetch(`/api/admin/popular?id=${popularId}`, { method: 'DELETE' });
      toast.success("Removed from Popular");
      fetchData();
    } catch {
      toast.error("Failed to remove");
    }
  };

  const filteredProducts = allProducts
    .filter(p => !popularItems.some(pi => pi.product?._id === p._id))
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes dbUp       { from{opacity:0;transform:translateY(18px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes dbPulse    { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(2.4);opacity:0;} }
        @keyframes dbShimmer  { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }

        .pop-page {
          font-family:'Inter', system-ui, sans-serif;
          min-height:100vh;
          background:#080b10;
          color:#fff;
          padding-bottom:80px;
        }

        .pop-topbar {
          position:sticky; top:0; z-index:50;
          background:rgba(8,11,16,0.88);
          backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding:18px 24px;
        }

        .pop-title {
          font-size:clamp(22px,4vw,30px);
          font-weight:500; letter-spacing:-0.02em;
        }

        .pop-search {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px;
          padding:12px 16px 12px 44px;
          color:#fff;
          font-size:14px;
        }

        .pop-search::placeholder { color:rgba(255,255,255,0.3); }

        .pop-stat-card {
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:16px;
          padding:16px 20px;
          transition:all 0.3s;
        }

        .pop-stat-card:hover {
          transform:translateY(-4px);
          box-shadow:0 12px 32px rgba(0,0,0,0.4);
        }

        .pop-card {
          background:rgba(255,255,255,0.015);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:20px;
          overflow:hidden;
          transition:all 0.3s ease;
        }

        .pop-card:hover {
          transform:translateY(-6px) scale(1.02);
          box-shadow:0 20px 48px rgba(0,0,0,0.5);
        }

        .pop-empty {
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
      `}</style>

      <div className="pop-page">

        {/* ── TOPBAR ── */}
        <div className="pop-topbar">
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PulseDot color="#f59e0b" size={9} />
              <h1 className="pop-title">Popular Items</h1>
            </div>

            <div style={{
              background: popularItems.length >= MAX_POPULAR ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
              border: popularItems.length >= MAX_POPULAR ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(16,185,129,0.4)',
              color: popularItems.length >= MAX_POPULAR ? '#ef4444' : '#10b981',
              padding: '8px 16px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
            }}>
              {popularItems.length} / {MAX_POPULAR}
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
              className="pop-search w-full"
            />
          </div>
        </div>

        {/* ── CURRENT POPULAR ── */}
        <div style={{ maxWidth: 1400, margin: '32px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>Currently Popular</h2>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              {popularItems.length} items
            </span>
          </div>

          {popularItems.length === 0 ? (
            <div className="pop-empty">
              <Star size={72} className="mx-auto mb-6 opacity-40" />
              <p style={{ fontSize: 20, fontWeight: 500 }}>
                No popular items set yet
              </p>
              <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.5)' }}>
                Add up to {MAX_POPULAR} items that appear first in menus
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularItems.map(({ _id, product }) => (
                <div key={_id} className="pop-card">
                  <div className="relative h-44 bg-black/30">
                    {product?.image ? (
                      <Image
                        src={product.image}
                        alt={product.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={48} className="text-white/30" />
                      </div>
                    )}
                    <button
                      onClick={() => removeFromPopular(_id)}
                      className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-700 rounded-full transition text-white shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ padding: 16 }}>
                    <p style={{
                      fontSize: 16, fontWeight: 500,
                      marginBottom: 6, color: '#fff'
                    }}>
                      {product?.name || "Deleted Product"}
                    </p>
                    <p style={{ fontSize: 18, fontWeight: 600, color: '#f59e0b' }}>
                      ₹{product?.price || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── ADD FROM PRODUCTS ── */}
        <div style={{ maxWidth: 1400, margin: '48px auto 0', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>Add to Popular</h2>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              {filteredProducts.length} available
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="pop-empty">
              <Package size={72} className="mx-auto mb-6 opacity-40" />
              <p style={{ fontSize: 20, fontWeight: 500 }}>
                {searchQuery ? 'No matching products found' : 'No products available to add'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="pop-card cursor-pointer"
                  onClick={() => addToPopular(product)}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center pb-6">
                      <div className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full font-medium text-white flex items-center gap-2 shadow-lg">
                        <Plus size={18} />
                        Add to Popular
                      </div>
                    </div>
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
              ))}
            </div>
          )}
        </div>

        <AdminFooter />
      </div>
    </>
  );
}