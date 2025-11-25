// app/admin/popular/page.js   ← FINAL & PERFECT (Dedicated Collection)

"use client";

import { useState, useEffect } from 'react';
import { Search, Star, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const MAX_POPULAR = 8;

export default function PopularProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      toast.error("Maximum 8 popular items allowed!", { icon: AlertCircle });
      return;
    }

    try {
      const res = await fetch('/api/admin/popular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id })
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed");
        return;
      }

      toast.success(`"${product.name}" added to Popular!`);
      fetchData();
    } catch (err) {
      toast.error("Failed to add");
    }
  };

  const removeFromPopular = async (popularId) => {
    try {
      await fetch(`/api/admin/popular?id=${popularId}`, { method: 'DELETE' });
      toast.success("Removed from Popular");
      fetchData();
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const filteredProducts = allProducts
    .filter(p => !popularItems.some(pi => pi.product._id === p._id))
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activePage="popular" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setIsOpen={setSidebarOpen} user={{ username: "Admin" }} />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-10 text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3">Popular Products</h1>
            <p className="text-xl text-gray-600">Max 8 items appear first on customer menu</p>
          </div>

          <div className="container mx-auto px-6 mb-8">
            <div className={`rounded-3xl p-8 shadow-2xl text-center ${popularItems.length >= MAX_POPULAR ? 'bg-red-600' : 'bg-gradient-to-r from-orange-500 to-red-600'} text-white`}>
              <Star size={60} className="mx-auto mb-4 opacity-40" />
              <p className="text-7xl font-bold">{popularItems.length} / {MAX_POPULAR}</p>
              <p className="text-xl mt-2">{popularItems.length >= MAX_POPULAR ? "Full!" : "Can add more"}</p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products to add..."
                className="w-full pl-14 pr-6 py-4 rounded-3xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all text-lg shadow-md"
              />
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-16 h-16 animate-spin text-orange-500" />
              </div>
            ) : (
              <>
                {/* Popular Items */}
                {popularItems.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
                      Currently Popular ({popularItems.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {popularItems.map(({ _id, product }) => (
                        <PopularCard
                          key={_id}
                          item={product}
                          isPopular={true}
                          onRemove={() => removeFromPopular(_id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Products */}
                {filteredProducts.length > 0 && (
                  <div>
                    {popularItems.length > 0 && (
                      <div className="my-12 text-center">
                        <div className="inline-block px-8 py-3 bg-gray-200 rounded-full text-gray-600 font-medium text-lg">
                          Available to Add
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredProducts.map(product => (
                        <PopularCard
                          key={product._id}
                          item={product}
                          onAdd={() => addToPopular(product)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {popularItems.length === 0 && filteredProducts.length === 0 && (
                  <div className="text-center py-20">
                    <Star size={80} className="mx-auto mb-6 text-gray-300" />
                    <p className="text-2xl text-gray-500">No products found</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function PopularCard({ item, isPopular, onAdd, onRemove }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
        {item.image ? (
          <Image src={item.image} alt={item.name} width={180} height={180} className="object-contain group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
        )}
        {isPopular && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            Popular
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description || "Delicious dish"}</p>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">{item.price} SAR</div>
          {isPopular ? (
            <button onClick={onRemove} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition">
              Remove
            </button>
          ) : (
            <button onClick={onAdd} className="px-4 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition flex items-center gap-2">
              <Star size={16} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}