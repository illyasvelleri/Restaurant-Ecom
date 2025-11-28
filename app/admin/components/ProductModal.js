// components/ProductModal.js

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';                    // ← Added
import { X, Save, Upload, Trash2 } from 'lucide-react';

const DEFAULT_PLACEHOLDER =
  'https://via.placeholder.com/400x300.png?text=No+Image';

export default function ProductModal({ product, onClose, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('active');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(''); // data URL or external URL
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      setPrice(product.price || '');
      setStock(product.stock?.toString() || '0');
      setStatus(product.status || 'active');
      setDescription(product.description || '');
      setPreviewImage(product.image || '');
      setImageFile(null);
    } else {
      // Reset for "Add new product"
      setName('');
      setCategory('');
      setPrice('');
      setStock('');
      setStatus('active');
      setDescription('');
      setPreviewImage('');
      setImageFile(null);
    }
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) return alert('Image must be less than 5MB');
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      return alert('Only JPEG, JPG, PNG or WebP allowed');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('status', status);
    formData.append('description', description);

    if (product?._id) formData.append('id', product._id);
    if (!imageFile && product?.image) formData.append('existingImage', product.image);
    if (imageFile) formData.append('image', imageFile);

    onSave(formData).finally(() => {
      setSaving(false);
      onClose();
    });
  };

  // Determine the image source for <Image />
  const imageSrc = previewImage || DEFAULT_PLACEHOLDER;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ... All your existing inputs (Name, Category, Price, etc.) ... */}
          {/* They remain unchanged — omitted here for brevity */}

          {/* Image Upload Section — FIXED */}
          <div>
            <label className="block text-sm font-semibold mb-3">Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition">
              {previewImage || product?.image ? (
                <div className="relative inline-block">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={imageSrc}
                      alt="Product preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                      priority={!!previewImage.startsWith('data:')} // data URLs = local upload → prioritize
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600">Drop image or click to browse</p>
                </div>
              )}

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-xl transition disabled:opacity-70 flex items-center gap-2"
            >
              {saving ? 'Saving...' : <Save size={20} />}
              {saving ? '' : product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}