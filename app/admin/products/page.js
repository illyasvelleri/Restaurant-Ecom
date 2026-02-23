
// // app/admin/products/page.js → UPDATED 2025

// "use client";

// import { useState, useEffect } from 'react';
// import { Package, Plus, Search, Edit3, Trash2 } from 'lucide-react';
// import ProductModal from '../components/ProductModal';
// import toast from 'react-hot-toast';

// export default function ProductsPage() {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/admin/products');
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setProducts(data || []);
//     } catch {
//       toast.error('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const filtered = products.filter(p =>
//     p.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const activeCount = products.filter(p => p.status === 'active').length;
//   const lowStockCount = products.filter(p => p.stock < 10 && p.stock > 0).length;
//   const outOfStockCount = products.filter(p => p.stock === 0).length;

//   const handleSave = async (formData) => {
//     try {
//       const method = selectedProduct ? 'PUT' : 'POST';
//       const url = '/api/admin/products';

//       const res = await fetch(url, { method, body: formData });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || 'Save failed');
//       }

//       toast.success(selectedProduct ? 'Product updated!' : 'Product created!');
//       await fetchProducts();
//       setShowModal(false);
//       setSelectedProduct(null);
//     } catch (err) {
//       toast.error(err.message || 'Failed to save');
//     }
//   };

//   const handleDelete = async (product) => {
//     if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

//     try {
//       const res = await fetch('/api/admin/products', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: product._id }),
//       });

//       if (!res.ok) throw new Error();
//       toast.success('Product deleted');
//       await fetchProducts();
//     } catch {
//       toast.error('Failed to delete product');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-24">

//       {/* Header */}
//       <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Products</h1>
//               <p className="text-sm text-gray-500">{products.length} items total</p>
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedProduct(null);
//                 setShowModal(true);
//               }}
//               className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 transition"
//             >
//               <Plus size={26} strokeWidth={3} />
//             </button>
//           </div>

//           <div className="relative">
//             <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by name..."
//               className="w-full pl-12 pr-5 py-4 bg-gray-100 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-black/10"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="px-4 py-5 bg-white border-b border-gray-100">
//         <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide">
//           <div className="text-center min-w-[80px]">
//             <p className="text-3xl font-bold text-gray-900">{products.length}</p>
//             <p className="text-xs text-gray-500 mt-1">Total</p>
//           </div>
//           <div className="text-center min-w-[80px]">
//             <p className="text-3xl font-bold text-emerald-600">{activeCount}</p>
//             <p className="text-xs text-gray-500 mt-1">Active</p>
//           </div>
//           <div className="text-center min-w-[80px]">
//             <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
//             <p className="text-xs text-gray-500 mt-1">Low Stock</p>
//           </div>
//           <div className="text-center min-w-[80px]">
//             <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
//             <p className="text-xs text-gray-500 mt-1">Out of Stock</p>
//           </div>
//         </div>
//       </div>

//       {/* Products List */}
//       <div className="px-4 py-6">
//         {loading ? (
//           <div className="text-center py-20">
//             <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-20">
//             <Package size={72} className="mx-auto text-gray-300 mb-4" />
//             <p className="text-gray-600 text-xl">No products found</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {filtered.map((p) => (
//               <div
//                 key={p._id}
//                 className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
//               >
//                 <div className="relative h-48 bg-gray-100">
//                   {p.image ? (
//                     <img
//                       src={p.image}
//                       alt={p.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                       <Package size={48} className="text-gray-400" />
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-5">
//                   <h3 className="font-bold text-lg text-gray-900 truncate">{p.name}</h3>
//                   <p className="text-sm text-gray-600 mt-1">{p.category}</p>

//                   <div className="mt-3 flex items-baseline gap-2">
//                     <span className="text-2xl font-bold text-gray-900">${(Number(p.price) || 0).toFixed(2)}</span>
//                     {p.profitMargin > 0 && (
//                       <span className="text-sm font-medium text-emerald-600">
//                         {p.profitMargin}% margin
//                       </span>
//                     )}
//                   </div>

//                   <div className="mt-4 flex justify-between items-center text-sm">
//                     <span className={p.stock === 0 ? 'text-red-600 font-medium' : 'text-gray-700'}>
//                       Stock: {p.stock}
//                     </span>
//                     <span className="text-gray-500">Prep: {p.prepTimeMinutes} min</span>
//                   </div>

//                   <div className="mt-5 flex gap-3">
//                     <button
//                       onClick={() => {
//                         setSelectedProduct(p);
//                         setShowModal(true);
//                       }}
//                       className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center gap-2 transition"
//                     >
//                       <Edit3 size={18} />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(p)}
//                       className="py-3 px-4 bg-red-50 hover:bg-red-100 rounded-xl transition"
//                     >
//                       <Trash2 size={18} className="text-red-600" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {showModal && (
//         <ProductModal
//           product={selectedProduct}
//           onClose={() => {
//             setShowModal(false);
//             setSelectedProduct(null);
//           }}
//           onSave={handleSave}
//         />
//       )}
//     </div>
//   );
// }



// app/admin/products/page.js → PREMIUM DARK REDESIGN (matching admin dashboard style)
// Inter font | Dark glass theme | Glows/Hovers/Skeletons | ALL ORIGINAL LOGIC PRESERVED

"use client";

import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit3, Trash2, RefreshCw } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import toast from 'react-hot-toast';

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
        <div style={{ height: 40, borderRadius: 12, background: "rgba(255,255,255,0.04)" }} />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(data || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = products.filter(p => p.status === 'active').length;
  const lowStockCount = products.filter(p => p.stock < 10 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const handleSave = async (formData) => {
    try {
      const method = selectedProduct ? 'PUT' : 'POST';
      const url = '/api/admin/products';

      const res = await fetch(url, { method, body: formData });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      toast.success(selectedProduct ? 'Product updated!' : 'Product created!');
      await fetchProducts();
      setShowModal(false);
      setSelectedProduct(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product._id }),
      });

      if (!res.ok) throw new Error();
      toast.success('Product deleted');
      await fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes dbUp       { from{opacity:0;transform:translateY(18px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes dbPulse    { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(2.4);opacity:0;} }
        @keyframes dbShimmer  { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }

        .prod-page {
          font-family:'Inter', system-ui, sans-serif;
          min-height:100vh;
          background:#080b10;
          color:#fff;
          padding-bottom:80px;
        }

        .prod-topbar {
          position:sticky; top:0; z-index:50;
          background:rgba(8,11,16,0.88);
          backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding:18px 24px;
        }

        .prod-title {
          font-size:clamp(22px,4vw,30px);
          font-weight:500; letter-spacing:-0.02em;
        }

        .prod-search {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px;
          padding:12px 16px 12px 44px;
          color:#fff;
          font-size:14px;
        }

        .prod-search::placeholder { color:rgba(255,255,255,0.3); }

        .prod-add-btn {
          background:linear-gradient(135deg,#f59e0b,#d97706);
          color:white;
          border:none;
          padding:10px 18px;
          border-radius:12px;
          font-weight:500;
          transition:all 0.2s;
        }

        .prod-add-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(245,158,11,0.4); }

        .prod-stat-card {
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:16px;
          padding:16px 20px;
          transition:all 0.3s;
        }

        .prod-stat-card:hover {
          transform:translateY(-4px);
          box-shadow:0 12px 32px rgba(0,0,0,0.4);
        }

        .prod-card {
          background:rgba(255,255,255,0.015);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:20px;
          overflow:hidden;
          transition:all 0.3s ease;
        }

        .prod-card:hover {
          transform:translateY(-6px) scale(1.02);
          box-shadow:0 20px 48px rgba(0,0,0,0.5);
        }

        .prod-empty {
          padding:120px 24px;
          text-align:center;
          color:rgba(255,255,255,0.4);
          font-style:italic;
        }
      `}</style>

      <div className="prod-page">

        {/* ── TOPBAR ── */}
        <div className="prod-topbar">
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PulseDot color="#f59e0b" size={9} />
              <h1 className="prod-title">Products</h1>
            </div>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setShowModal(true);
              }}
              className="prod-add-btn flex items-center gap-2"
            >
              <Plus size={18} />
              Add Product
            </button>
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
              placeholder="Search by product name..."
              className="prod-search w-full"
            />
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ maxWidth: 1400, margin: '32px auto', padding: '0 20px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="prod-stat-card text-center">
              <p style={{ fontSize: 32, fontWeight: 500, color: '#fff' }}>{products.length}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Total Products</p>
            </div>
            <div className="prod-stat-card text-center">
              <p style={{ fontSize: 32, fontWeight: 500, color: '#10b981' }}>{activeCount}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Active</p>
            </div>
            <div className="prod-stat-card text-center">
              <p style={{ fontSize: 32, fontWeight: 500, color: '#f59e0b' }}>{lowStockCount}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Low Stock</p>
            </div>
            <div className="prod-stat-card text-center">
              <p style={{ fontSize: 32, fontWeight: 500, color: '#ef4444' }}>{outOfStockCount}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Out of Stock</p>
            </div>
          </div>
        </div>

        {/* ── PRODUCTS GRID ── */}
        <div style={{ maxWidth: 1400, margin: '32px auto', padding: '0 20px' }}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="prod-empty">
              <Package size={72} className="mx-auto mb-6 opacity-40" />
              <p style={{ fontSize: 20, fontWeight: 500 }}>
                {searchQuery ? 'No matching products found' : 'No products added yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <div
                  key={p._id}
                  className="prod-card"
                  style={{ animation: 'dbUp 0.5s ease' }}
                >
                  <div className="relative h-48 bg-black/30">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={48} className="text-white/30" />
                      </div>
                    )}
                    {p.status !== 'active' && (
                      <div style={{
                        position: 'absolute', top: 12, right: 12,
                        padding: '4px 12px', borderRadius: 999,
                        background: 'rgba(239,68,68,0.2)',
                        color: '#ef4444',
                        fontSize: 11, fontWeight: 600,
                      }}>
                        Inactive
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 20 }}>
                    <h3 style={{
                      fontSize: 18, fontWeight: 600,
                      marginBottom: 4, color: '#fff'
                    }}>
                      {p.name}
                    </h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
                      {p.category || '—'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: 24, fontWeight: 600, color: '#f59e0b' }}>
                        ₹{(Number(p.price) || 0).toFixed(2)}
                      </span>
                      {p.profitMargin > 0 && (
                        <span style={{ fontSize: 13, color: '#10b981' }}>
                          {p.profitMargin}% margin
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 16 }}>
                      <span style={{
                        color: p.stock === 0 ? '#ef4444' :
                               p.stock < 10 ? '#f59e0b' : '#10b981',
                        fontWeight: 500
                      }}>
                        Stock: {p.stock}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Prep: {p.prepTimeMinutes} min
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setShowModal(true);
                        }}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 transition text-white/90 hover:text-white"
                      >
                        <Edit3 size={18} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl transition text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <ProductModal
            product={selectedProduct}
            onClose={() => {
              setShowModal(false);
              setSelectedProduct(null);
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </>
  );
}