// components/ProductModal.js → FINAL 2025 LUXURY — FULLY VISIBLE & RESPONSIVE

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { X, Save, Upload, Trash2, Loader2 } from 'lucide-react';

const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/600x400.png?text=No+Image';

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
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setStock('0');
      setStatus('active');
      setDescription('');
      setPreviewImage('');
      setImageFile(null);
    }
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error("Only JPG, PNG, WebP allowed");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewImage('');
    const input = document.getElementById('image-upload');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('status', status);
    formData.append('description', description);

    if (product?._id) formData.append('id', product._id);
    if (imageFile) formData.append('image', imageFile);
    else if (product?.image) formData.append('existingImage', product.image);

    try {
      await onSave(formData);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  const imageSrc = previewImage || product?.image || DEFAULT_PLACEHOLDER;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8 max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition"
          >
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-8">

          {/* Name */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Classic Cheeseburger"
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition"
            />
          </div>

          {/* Category — NOW FULLY VISIBLE */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition appearance-none bg-white"
              style={{ backgroundImage: 'none' }}
            >
              <option value="">Select a category</option>
              <option value="Food">Food</option>
              <option value="Drinks">Drinks</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">Price (SAR) *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="29.99"
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                placeholder="50"
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">Status</label>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === "active"}
                  onChange={() => setStatus("active")}
                  className="w-6 h-6 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-lg font-medium">Active</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={status === "inactive"}
                  onChange={() => setStatus("inactive")}
                  className="w-6 h-6 text-red-600 focus:ring-red-500"
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
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-amber-400 transition-all">
              {previewImage || product?.image ? (
                <div className="relative inline-block w-full">
                  <div className="relative w-full h-64 lg:h-80 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={imageSrc}
                      alt="Product preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition shadow-lg"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ) : (
                <div className="py-16">
                  <Upload size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-xl text-gray-600 font-medium">Drop image here or click to upload</p>
                  <p className="text-sm text-gray-500 mt-2">JPG • Max 5MB</p>
                </div>
              )}

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-6 block w-full text-sm text-gray-600 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:bg-gray-900 file:text-white hover:file:bg-gray-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-5 border-2 border-gray-300 rounded-2xl font-bold text-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-2xl"
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