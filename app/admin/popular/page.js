// app/admin/popular/page.js → FINAL 2025 MOBILE-FRIENDLY (SHOPIFY + TALABAT STYLE)

"use client";

import { useState, useEffect } from 'react';
import { Search, Star, Plus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

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
      toast.error(`Maximum ${MAX_POPULAR} popular items allowed!`, { icon: "AlertCircle" });
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
    .filter(p => !popularItems.some(pi => pi.product._id === p._id))
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* MOBILE HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Popular Items</h1>
              <p className="text-sm text-gray-500">Max 8 items shown first</p>
            </div>
            <div className={`text-2xl font-bold ${popularItems.length >= MAX_POPULAR ? "text-red-600" : "text-emerald-600"}`}>
              {popularItems.length}/{MAX_POPULAR}
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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

      {/* CURRENT POPULAR ITEMS */}
      <div className="px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Currently Popular</h2>
          <span className="text-sm text-gray-500">{popularItems.length} items</span>
        </div>

        {popularItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Star className="mx-auto text-gray-300 mb-4" size={56} />
            <p className="text-gray-500">No popular items yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularItems.map(({ _id, product }) => (
              <div key={_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-br from-orange-50 to-orange-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-300" />
                  )}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => removeFromPopular(_id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
                    >
                      <X size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{product.price} SAR</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD FROM PRODUCTS */}
      <div className="px-4 pb-32">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Add to Popular</h2>
          <span className="text-sm text-gray-500">{filteredProducts.length} available</span>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-400" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">No products to add</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product._id}
                onClick={() => addToPopular(product)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all"
              >
                <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition flex items-end justify-center pb-4">
                    <div className="px-4 py-2 bg-white text-black rounded-full font-bold text-sm flex items-center gap-2">
                      <Plus size={18} />
                      Add
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{product.price} SAR</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}