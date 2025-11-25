// components/ProductModal.js   ← pure .js file

"use client";

import { useState, useEffect } from 'react';
import { X, Save, Upload, Trash2 } from 'lucide-react';

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
      setPrice(product.price || '');
      setStock(product.stock?.toString() || '0');
      setStatus(product.status || 'active');
      setDescription(product.description || '');
      setPreviewImage(product.image || '');
      setImageFile(null);
    } else {
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

          {/* Name + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Product Name *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select value={category} required onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500">
                <option value="">Choose category</option>
                <option>Pizza</option>
                <option>Burgers</option>
                <option>Salads</option>
                <option>Pasta</option>
                <option>Desserts</option>
                <option>Beverages</option>
              </select>
            </div>
          </div>

          {/* Price (SAR) + Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Price (SAR)*</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                  placeholder="25.50"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-medium">SAR</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Stock *</label>
              <input type="number" min="0" required value={stock} onChange={e => setStock(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Status *</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
              placeholder="Delicious handmade pizza..." />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold mb-3">Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition">
              {previewImage ? (
                <div className="relative inline-block">
                  <img src={previewImage} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                  <button type="button" onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600">Drop image or click to browse</p>
                </div>
              )}
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange}
                className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={onClose} disabled={saving}
              className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-xl transition disabled:opacity-70 flex items-center gap-2">
              {saving ? 'Saving...' : <Save size={20} />}
              {saving ? '' : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}