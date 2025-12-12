// app/admin/combos/page.js → FINAL 2025 MOBILE ADMIN (100% FIXED)

"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, X, Upload, Check, ChevronRight,
  Package, Loader2 
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Combo Offers</h1>
              <p className="text-sm text-gray-500">Max 10 active combos</p>
            </div>
            <div className={`text-2xl font-bold ${combos.length >= MAX_COMBOS ? "text-red-600" : "text-emerald-600"}`}>
              {combos.length}/{MAX_COMBOS}
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

      {/* CURRENT COMBOS */}
      <div className="px-4 py-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Active Combos</h2>
        {combos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package className="mx-auto text-gray-300 mb-4" size={56} />
            <p className="text-gray-500">No combo offers yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {combos.map((combo) => (
              <div key={combo._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {combo.image ? (
                    <Image src={combo.image} alt={combo.title} width={80} height={80} className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 border-2 border-dashed" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{combo.title}</h3>
                  <p className="text-sm text-gray-600">{combo.items?.length || 0} items • {combo.price} SAR</p>
                </div>
                <button
                  onClick={() => removeCombo(combo._id)}
                  className="p-3 bg-red-50 hover:bg-red-100 rounded-xl"
                >
                  <X className="text-red-600" size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SELECT PRODUCTS */}
      <div className="px-4 pb-32">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Create New Combo</h2>
          <span className="text-sm text-gray-500">{selectedProducts.length} selected</span>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-400" />
          </div>
        ) : availableProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableProducts.map((product) => {
              const selected = isSelected(product._id);
              return (
                <button
                  key={product._id}
                  onClick={() => toggleProduct(product)}
                  className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all overflow-hidden ${
                    selected ? "border-black ring-4 ring-black/10" : "border-gray-200"
                  }`}
                >
                  <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 border-2 border-dashed" />
                    )}
                    {selected && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Check className="text-white" size={40} />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{product.price} SAR</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* FIXED BOTTOM BAR */}
        {selectedProducts.length >= 2 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Selected {selectedProducts.length} items</p>
                <p className="text-xl font-bold">
                  {totalPrice.toFixed(2)} SAR → <span className="text-emerald-600">{comboPrice} SAR</span>
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-4 bg-black text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-800 transition shadow-lg"
              >
                <Plus size={22} />
                Create Combo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showCreateModal && (
        <CreateComboModal
          selectedProducts={selectedProducts}
          totalPrice={totalPrice}
          comboPrice={comboPrice}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedProducts([]);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setSelectedProducts([]);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// CREATE COMBO MODAL
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Combo</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={28} />
          </button>
        </div>

        {/* Thumbnail */}
        <div className="mb-6 text-center">
          <div className="relative w-48 h-48 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl overflow-hidden mb-4">
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Package size={64} />
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-black text-white rounded-2xl font-bold flex items-center gap-2 mx-auto"
          >
            <Upload size={20} /> Upload Thumbnail
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

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Combo Title"
          className="w-full px-5 py-4 rounded-2xl border border-gray-300 mb-4 text-lg"
        />

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Original Price</p>
            <p className="text-2xl font-bold line-through text-gray-400">{totalPrice.toFixed(2)} SAR</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Combo Price</p>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border-2 border-emerald-500 text-2xl font-bold text-center"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-5 bg-black text-white rounded-2xl font-bold text-xl hover:bg-gray-800 transition shadow-lg"
        >
          Create Combo Offer
        </button>
      </div>
    </div>
  );
}