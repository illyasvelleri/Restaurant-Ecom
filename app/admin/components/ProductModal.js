

// components/ProductModal.js → FINAL 2025 (WITH ADDON ITEMS + ALL PREVIOUS FEATURES)

"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { X, Save, Upload, Trash2, Loader2, PlusCircle, MinusCircle } from 'lucide-react';

const FALLBACK_IMAGE = "/Images/placeholder-product.jpg";

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;
        if (width > 1200) {
          height = (1200 / width) * height;
          width = 1200;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, 'image/webp', 0.85);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default function ProductModal({ product, onClose, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('active');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();

  // NEW: Addon Items State
  const [addons, setAddons] = useState([]); // [{ name: "Mayo", price: 2.00 }]

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      setPrice(product.price?.toString() || '');
      setStock(product.stock?.toString() || '0');
      setStatus(product.status || 'active');
      setDescription(product.description || '');
      setPreviewImage(product.image || '');
      setImageFile(null);
      // Load existing addons
      setAddons(product.addons || []);
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setStock('0');
      setStatus('active');
      setDescription('');
      setPreviewImage('');
      setImageFile(null);
      setAddons([]);
    }
  }, [product]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large! Max 10MB");
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    toast.loading("Optimizing image...", { id: "compress" });
    try {
      const compressed = await compressImage(file);
      setImageFile(compressed);
      toast.success(`Compressed to ${(compressed.size / 1024).toFixed(0)} KB`, { id: "compress" });
    } catch (err) {
      toast.error("Using original image", { id: "compress" });
      setImageFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ADDON FUNCTIONS
  const addAddon = () => {
    setAddons([...addons, { name: '', price: '' }]);
  };

  const updateAddon = (index, field, value) => {
    const newAddons = [...addons];
    newAddons[index][field] = value;
    setAddons(newAddons);
  };

  const removeAddon = (index) => {
    setAddons(addons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate addons
    for (const addon of addons) {
      if (addon.name && !addon.price) {
        toast.error("Please enter price for all addons");
        return;
      }
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('status', status);
    formData.append('description', description);
    formData.append('addons', JSON.stringify(addons.filter(a => a.name && a.price))); // Only valid addons

    if (product?._id) formData.append('id', product._id);
    if (imageFile) formData.append('image', imageFile);

    try {
      await onSave(formData);
      toast.success(product ? "Product updated!" : "Product created!");
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
      onClose();
    }
  };

  const imageSrc = previewImage || product?.image || FALLBACK_IMAGE;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-7">

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">Product Image</label>
            <div className="relative">
              <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300">
                <Image src={imageSrc} alt="Product" fill className="object-cover" unoptimized />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition shadow-2xl flex items-center gap-3"
              >
                <Upload size={24} />
                {previewImage || product?.image ? 'Change Image' : 'Upload Image'}
              </button>

              {(previewImage || product?.image) && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                >
                  <Trash2 size={22} />
                </button>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <p className="text-center text-sm text-gray-500 mt-3">
              Auto-compressed • Max 10MB • JPG/PNG/WebP
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Classic Cheeseburger"
              className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-lg focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-lg focus:outline-none focus:ring-4 focus:ring-orange-500 transition appearance-none"
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Drinks">Drinks</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">Price *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="29.99"
                className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                placeholder="50"
                className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
              />
            </div>
          </div>

          {/* ADDON ITEMS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-semibold text-gray-800">Addon Items (Optional)</label>
              <button
                type="button"
                onClick={addAddon}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition flex items-center gap-2"
              >
                <PlusCircle size={20} />
                Add Addon
              </button>
            </div>

            {addons.length === 0 ? (
              <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-2xl">
                No addons yet. Click "Add Addon" to offer extras like Mayo, Cheese, etc.
              </p>
            ) : (
              <div className="space-y-4">
                {addons.map((addon, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
                    <input
                      type="text"
                      value={addon.name}
                      onChange={(e) => updateAddon(index, 'name', e.target.value)}
                      placeholder="e.g. Extra Mayo"
                      className="flex-1 px-5 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={addon.price}
                      onChange={(e) => updateAddon(index, 'price', e.target.value)}
                      placeholder="Price"
                      className="w-32 px-5 py-4 bg-white rounded-xl border border-gray-200 text-center focus:outline-none focus:ring-4 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeAddon(index)}
                      className="p-3 bg-red-100 hover:bg-red-200 rounded-xl transition"
                    >
                      <MinusCircle size={24} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">Status</label>
            <div className="flex gap-8">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === "active"}
                  onChange={() => setStatus("active")}
                  className="w-7 h-7 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-lg font-medium">Active</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={status === "inactive"}
                  onChange={() => setStatus("inactive")}
                  className="w-7 h-7 text-red-600 focus:ring-red-500"
                />
                <span className="text-lg font-medium">Inactive</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe your delicious dish..."
              className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-lg focus:outline-none focus:ring-4 focus:ring-orange-500 transition resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-5 border-2 border-gray-300 rounded-2xl font-bold text-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-2xl"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={28} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={28} />
                  {product ? "Update Product" : "Add Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}