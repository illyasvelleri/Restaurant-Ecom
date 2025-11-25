"use client";

import { useState, useEffect } from 'react';
import { Package, BarChart3, DollarSign, TrendingUp, Download, Plus, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProductStatsCard from '../components/ProductStatsCard';
import ProductModal from '../components/ProductModal';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const user = { username: "Admin1", role: "admin" };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStock = products.filter(p => p.stock < 10 && p.status === 'active').length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.sales || 0) * parseFloat(p.price || 0), 0).toFixed(2);

  const stats = [
    { title: 'Total Products', value: totalProducts, icon: Package, color: 'bg-gradient-to-br from-blue-400 to-blue-600', percentage: 8.2 },
    { title: 'Active Products', value: activeProducts, icon: BarChart3, color: 'bg-gradient-to-br from-green-400 to-green-600', percentage: 12.5 },
    { title: 'Low Stock Items', value: lowStock, icon: TrendingUp, color: 'bg-gradient-to-br from-yellow-400 to-yellow-600', percentage: lowStock > 0 ? -5.3 : 0 },
    { title: 'Total Revenue', value: `$${parseFloat(totalRevenue).toLocaleString()}`, icon: DollarSign, color: 'bg-gradient-to-br from-purple-400 to-purple-600', percentage: 18.7 },
  ];

  const filteredProducts = filterCategory === 'all'
    ? products
    : products.filter(p => p.category === filterCategory);

  // FINAL FIXED handleSaveProduct — works 100% with FormData from modal
  const handleSaveProduct = async (formData) => {
    setSaving(true);
    try {
      const method = selectedProduct ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/products', {
        method,
        body: formData, // Already contains: id, existingImage, image, name, etc.
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to save product');
      }

      toast.success(selectedProduct ? 'Product updated!' : 'Product added!');
      setShowModal(false);
      setSelectedProduct(null);
      await fetchProducts(); // Refresh list
    } catch (err) {
      console.error('Save error:', err);
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
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

      if (!res.ok) throw new Error('Delete failed');

      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Could not delete product');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setIsOpen={setSidebarOpen} user={user} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
              <p className="text-gray-600">Manage your restaurant menu and inventory</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <ProductStatsCard key={stat.title} {...stat} />
              ))}
            </div>

            {/* Filters & Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button onClick={() => setFilterCategory('all')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${filterCategory === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}>
                      All
                    </button>
                    {['Pizza', 'Burgers', 'Salads', 'Pasta', 'Desserts', 'Beverages'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${filterCategory === cat ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      <Download size={18} />
                      <span className="text-sm font-medium">Export</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setShowModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition"
                    >
                      <Plus size={18} />
                      <span className="text-sm font-medium">Add Product</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onEdit={(p) => {
                      setSelectedProduct(p);
                      setShowModal(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-16 text-gray-500 text-lg">
                No products found. Click "Add Product" to get started!
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveProduct}
          saving={saving}
        />
      )}
    </div>
  );
}