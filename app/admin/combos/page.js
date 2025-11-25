// app/admin/combos/page.js   ← FINAL FIXED & GORGEOUS

"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const MAX_COMBOS = 10;

export default function ComboOffersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [combos, setCombos] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [comboRes, prodRes] = await Promise.all([
        fetch('/api/admin/combos'),
        fetch('/api/admin/products')
      ]);
      if (comboRes.ok) setCombos(await comboRes.json() || []);
      if (prodRes.ok) setAllProducts(await prodRes.json() || []);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const availableProducts = allProducts
    .filter(p => p.status === 'active')
    .filter(p => !combos.some(c => c.productIds?.includes(p._id)))
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const openCreateModal = (product) => {
    setSelectedProduct(product);
    setShowCreateModal(true);
  };

  const removeCombo = async (id) => {
    if (!confirm("Remove this combo?")) return;
    try {
      await fetch(`/api/admin/combos?id=${id}`, { method: 'DELETE' });
      toast.success("Combo removed");
      fetchData();
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activePage="combos" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setIsOpen={setSidebarOpen} user={{ username: "Admin" }} />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-10 text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3">Combo Offers</h1>
            <p className="text-xl text-gray-600">Create special deals with custom thumbnails • Max 10</p>
          </div>

          <div className="container mx-auto px-6 mb-8">
            <div className={`rounded-3xl p-8 shadow-2xl text-center text-white ${combos.length >= MAX_COMBOS ? 'bg-red-600' : 'bg-gradient-to-r from-orange-500 to-red-600'}`}>
              <div className="text-7xl font-bold mb-2">Combo</div>
              <p className="text-7xl font-bold">{combos.length} / {MAX_COMBOS}</p>
              <p className="text-xl mt-2">{combos.length >= MAX_COMBOS ? "Full!" : "Can add more"}</p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products to create combo..."
                className="w-full pl-14 pr-6 py-4 rounded-3xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all text-lg shadow-md"
              />
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-16 h-16 animate-spin text-orange-500" /></div>
            ) : (
              <>
                {/* Active Combos */}
                {combos.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
                      Active Combo Offers ({combos.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {combos.map((combo) => (
                        <ComboCard key={combo._id} combo={combo} onRemove={() => removeCombo(combo._id)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Products */}
                {availableProducts.length > 0 && (
                  <div>
                    {combos.length > 0 && (
                      <div className="my-12 text-center">
                        <div className="inline-block px-8 py-3 bg-gray-200 rounded-full text-gray-600 font-medium text-lg">
                          Click to Create Combo
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {availableProducts.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => openCreateModal(product)}
                          className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 text-left"
                        >
                          <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} width={180} height={180} className="object-contain group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-2xl font-bold text-gray-900">{product.price} SAR</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* PASS combos & fetchData to modal */}
      {showCreateModal && selectedProduct && (
        <CreateComboModal
          product={selectedProduct}
          currentComboCount={combos.length}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// COMBO CARD
function ComboCard({ combo, onRemove }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
        {combo.image ? (
          <Image
            src={combo.image}
            alt={combo.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-40 h-40 flex items-center justify-center">
            <ImageIcon size={48} className="text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg">
          Combo Deal
        </div>
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{combo.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{combo.description || "Limited time offer"}</p>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-orange-600">{combo.price} SAR</div>
          {combo.originalPrice && (
            <span className="text-lg text-gray-500 line-through">{combo.originalPrice} SAR</span>
          )}
        </div>
      </div>
    </div>
  );
}

// FIXED MODAL — NOW RECEIVES currentComboCount
function CreateComboModal({ product, currentComboCount, onClose, onSuccess }) {
  const [title, setTitle] = useState(`${product.name} Combo`);
  const [price, setPrice] = useState(Math.round(product.price * 0.9));
  const [originalPrice, setOriginalPrice] = useState(product.price);
  const [description, setDescription] = useState(`Special combo with ${product.name}`);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(product.image || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleSubmit = async () => {
    if (currentComboCount >= MAX_COMBOS) {
      toast.error("Maximum 10 combo offers allowed!");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('originalPrice', originalPrice);
    formData.append('productIds', JSON.stringify([product._id]));
    if (thumbnail) formData.append('image', thumbnail);

    setUploading(true);
    try {
      const res = await fetch('/api/admin/combos', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }

      toast.success("Combo created with custom thumbnail!");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to create combo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-screen overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Combo Offer</h2>

        <div className="mb-8">
          <p className="text-lg font-semibold mb-4">Combo Thumbnail</p>
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl overflow-hidden mb-4">
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon size={80} className="text-gray-300" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition flex items-center gap-3"
            >
              <Upload size={24} />
              Upload Custom Thumbnail
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setThumbnail(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </div>

        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Combo Title" className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 mb-4 text-lg" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Combo Price (SAR)" className="px-6 py-4 rounded-2xl border-2 border-gray-200 text-lg" />
          <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Original Price" className="px-6 py-4 rounded-2xl border-2 border-gray-200 text-lg" />
        </div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={3} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 mb-6 text-lg resize-none" />

        <div className="flex gap-4">
          <button onClick={handleSubmit} disabled={uploading} className="flex-1 py-5 bg-orange-600 text-white font-bold text-xl rounded-2xl hover:bg-orange-700 transition disabled:opacity-50">
            {uploading ? "Creating..." : "Create Combo"}
          </button>
          <button onClick={onClose} className="px-8 py-5 bg-gray-200 rounded-2xl font-bold hover:bg-gray-300 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}