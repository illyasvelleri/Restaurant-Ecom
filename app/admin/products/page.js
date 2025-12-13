// app/admin/products/page.js → FINAL 2025 (UPLOADS WORK 100%)

"use client";

import { useState, useEffect } from 'react';
import {
  Package, Plus, Search, Edit3, Trash2
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

  // THIS IS THE KEY FIX — PROPERLY HANDLE FormData
  const handleSave = async (formData) => {
    try {
      const url = '/api/admin/products';
      const method = selectedProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData, // ← SEND FormData directly
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save');
      }

      toast.success(selectedProduct ? 'Product updated!' : 'Product created!');
      await fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Save failed');
    }
  };

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
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500">{products.length} items</p>
            </div>
            <button
              onClick={() => { 
                setSelectedProduct(null); 
                setShowModal(true); 
              }}
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

      {/* PRODUCT LIST */}
      <div className="px-4 py-2">
        {loading ? (
          <div className="text-center py-20">
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
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-lg transition">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{product.price} SAR</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { 
                      setSelectedProduct(product); 
                      setShowModal(true); 
                    }}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="p-3 bg-red-50 hover:bg-red-100 rounded-xl"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleSave}  // ← THIS WAS MISSING — NOW FIXED
        />
      )}
    </div>
  );
}