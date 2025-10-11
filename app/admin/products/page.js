"use client";

import { useState } from 'react';
import { Package, BarChart3, DollarSign, TrendingUp, Download, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProductStatsCard from '../components/ProductStatsCard';
import ProductModal from '../components/ProductModal';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const user = { username: "Admin1", role: "admin" };

  const products = [
    { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: '12.99', stock: 45, status: 'active', rating: '4.8', sales: 234, description: 'Classic pizza with fresh mozzarella, tomatoes, and basil' },
    { id: 2, name: 'Chicken Burger', category: 'Burgers', price: '8.99', stock: 32, status: 'active', rating: '4.6', sales: 189, description: 'Juicy grilled chicken burger with lettuce and mayo' },
    { id: 3, name: 'Caesar Salad', category: 'Salads', price: '7.99', stock: 28, status: 'active', rating: '4.5', sales: 145, description: 'Fresh romaine lettuce with caesar dressing and croutons' },
    { id: 4, name: 'Pasta Carbonara', category: 'Pasta', price: '11.99', stock: 8, status: 'active', rating: '4.9', sales: 267, description: 'Creamy pasta with bacon and parmesan cheese' },
    { id: 5, name: 'Chocolate Cake', category: 'Desserts', price: '6.99', stock: 15, status: 'active', rating: '4.7', sales: 98, description: 'Rich chocolate cake with fudgy chocolate frosting' },
    { id: 6, name: 'Fresh Orange Juice', category: 'Beverages', price: '4.99', stock: 52, status: 'active', rating: '4.4', sales: 312, description: 'Freshly squeezed orange juice' },
    { id: 7, name: 'Pepperoni Pizza', category: 'Pizza', price: '14.99', stock: 0, status: 'inactive', rating: '4.8', sales: 198, description: 'Pizza loaded with pepperoni and cheese' },
    { id: 8, name: 'Beef Burger', category: 'Burgers', price: '9.99', stock: 25, status: 'active', rating: '4.7', sales: 176, description: 'Beef patty with cheese, pickles, and special sauce' },
  ];

  const stats = [
    { title: 'Total Products', value: '124', icon: Package, color: 'bg-gradient-to-br from-blue-400 to-blue-600', percentage: 8.2 },
    { title: 'Active Products', value: '108', icon: BarChart3, color: 'bg-gradient-to-br from-green-400 to-green-600', percentage: 12.5 },
    { title: 'Low Stock Items', value: '12', icon: TrendingUp, color: 'bg-gradient-to-br from-yellow-400 to-yellow-600', percentage: -5.3 },
    { title: 'Total Revenue', value: '$45.2K', icon: DollarSign, color: 'bg-gradient-to-br from-purple-400 to-purple-600', percentage: 18.7 },
  ];

  const handleSaveProduct = (productData) => {
    console.log('Saving product:', productData);
  };

  const filteredProducts = filterCategory === 'all' 
    ? products 
    : products.filter(product => product.category === filterCategory);

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <ProductStatsCard key={stat.title} {...stat} />
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => setFilterCategory('all')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        filterCategory === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterCategory('Pizza')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        filterCategory === 'Pizza' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      Pizza
                    </button>
                    <button
                      onClick={() => setFilterCategory('Burgers')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        filterCategory === 'Burgers' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      Burgers
                    </button>
                    <button
                      onClick={() => setFilterCategory('Salads')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        filterCategory === 'Salads' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      Salads
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download size={18} />
                      <span className="text-sm font-medium">Export</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setShowModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <Plus size={18} />
                      <span className="text-sm font-medium">Add Product</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={(p) => {
                    setSelectedProduct(p);
                    setShowModal(true);
                  }}
                  onDelete={(p) => console.log('Delete', p)}
                  onView={(p) => console.log('View', p)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}