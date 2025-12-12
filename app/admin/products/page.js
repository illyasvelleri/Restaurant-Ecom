// app/admin/products/page.js → FINAL 2025 SHOPIFY-STYLE (WITH DELETE + PERFECT UI)

"use client";

import { useState, useEffect } from 'react';
import {
  Package, Plus, Search, MoreVertical, Edit3,
  Trash2, Eye, AlertCircle, CheckCircle2, X
} from 'lucide-react';
import ProductModal from '../components/ProductModal';
import AdminFooter from '../../components/footer';
import toast from 'react-hot-toast';

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
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = products.filter(p => p.status === 'active').length;
  const lowStockCount = products.filter(p => p.stock < 10 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}" permanently?`)) return;

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
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500">{products.length} items</p>
            </div>
            <button
              onClick={() => { setSelectedProduct(null); setShowModal(true); }}
              className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 transition"
            >
              <Plus size={26} strokeWidth={3} />
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-5 py-4 bg-gray-100 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        </div>
      </div>

      {/* COMPACT STATS */}
      <div className="px-4 py-5 bg-white border-b border-gray-100">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          <div className="text-center min-w-[80px]">
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total</p>
          </div>
          <div className="text-center min-w-[80px]">
            <p className="text-3xl font-bold text-emerald-600">{activeCount}</p>
            <p className="text-xs text-gray-500 mt-1">Active</p>
          </div>
          <div className="text-center min-w-[80px]">
            <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
            <p className="text-xs text-gray-500 mt-1">Low Stock</p>
          </div>
          <div className="text-center min-w-[80px]">
            <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
            <p className="text-xs text-gray-500 mt-1">Out of Stock</p>
          </div>
        </div>
      </div>

      {/* PRODUCT LIST — SHOPIFY MOBILE PERFECTION */}
      <div className="px-4 py-2">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 p-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={36} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xl font-bold text-gray-900">{product.price} SAR</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${product.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                        }`}>
                        {product.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      {product.stock === 0 ? (
                        <span className="text-red-600 font-medium flex items-center gap-1">
                          <X size={14} /> Out of stock
                        </span>
                      ) : product.stock < 10 ? (
                        <span className="text-orange-600 font-medium flex items-center gap-1">
                          <AlertCircle size={14} /> Only {product.stock} left
                        </span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={14} /> In stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS — EDIT + DELETE */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowModal(true);
                      }}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                    >
                      <Edit3 size={18} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-3 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AdminFooter />
      {/* MODAL */}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          onSave={async () => {
            await fetchProducts();
          }}
        />
      )}
    </div>
  );
}