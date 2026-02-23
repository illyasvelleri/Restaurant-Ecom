

// components/ProductModal.js → FINAL 2025 (WITH ADDON ITEMS + ALL PREVIOUS FEATURES)

// "use client";

// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import toast from 'react-hot-toast';
// import { X, Save, Upload, Trash2, Loader2, PlusCircle, MinusCircle } from 'lucide-react';

// const FALLBACK_IMAGE = "/Images/placeholder-product.jpg";

// const compressImage = (file) => {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const img = new window.Image();
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');

//         let width = img.width;
//         let height = img.height;
//         if (width > 1200) {
//           height = (1200 / width) * height;
//           width = 1200;
//         }

//         canvas.width = width;
//         canvas.height = height;
//         ctx.drawImage(img, 0, 0, width, height);

//         canvas.toBlob((blob) => {
//           const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
//             type: 'image/webp',
//             lastModified: Date.now(),
//           });
//           resolve(compressedFile);
//         }, 'image/webp', 0.85);
//       };
//       img.src = e.target.result;
//     };
//     reader.readAsDataURL(file);
//   });
// };

// export default function ProductModal({ product, onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [category, setCategory] = useState('');
//   const [price, setPrice] = useState('');
//   const [stock, setStock] = useState('');
//   const [status, setStatus] = useState('active');
//   const [description, setDescription] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [previewImage, setPreviewImage] = useState('');
//   const [saving, setSaving] = useState(false);
//   const fileInputRef = useRef();

//   // NEW: Addon Items State
//   const [addons, setAddons] = useState([]); // [{ name: "Mayo", price: 2.00 }]

//   useEffect(() => {
//     if (product) {
//       setName(product.name || '');
//       setCategory(product.category || '');
//       setPrice(product.price?.toString() || '');
//       setStock(product.stock?.toString() || '0');
//       setStatus(product.status || 'active');
//       setDescription(product.description || '');
//       setPreviewImage(product.image || '');
//       setImageFile(null);
//       // Load existing addons
//       setAddons(product.addons || []);
//     } else {
//       setName('');
//       setCategory('');
//       setPrice('');
//       setStock('0');
//       setStatus('active');
//       setDescription('');
//       setPreviewImage('');
//       setImageFile(null);
//       setAddons([]);
//     }
//   }, [product]);

//   const handleImageChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 10 * 1024 * 1024) {
//       toast.error("Image too large! Max 10MB");
//       return;
//     }
//     if (!file.type.startsWith('image/')) {
//       toast.error("Please select an image");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => setPreviewImage(reader.result);
//     reader.readAsDataURL(file);

//     toast.loading("Optimizing image...", { id: "compress" });
//     try {
//       const compressed = await compressImage(file);
//       setImageFile(compressed);
//       toast.success(`Compressed to ${(compressed.size / 1024).toFixed(0)} KB`, { id: "compress" });
//     } catch (err) {
//       toast.error("Using original image", { id: "compress" });
//       setImageFile(file);
//     }
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setPreviewImage('');
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   // ADDON FUNCTIONS
//   const addAddon = () => {
//     setAddons([...addons, { name: '', price: '' }]);
//   };

//   const updateAddon = (index, field, value) => {
//     const newAddons = [...addons];
//     newAddons[index][field] = value;
//     setAddons(newAddons);
//   };

//   const removeAddon = (index) => {
//     setAddons(addons.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name || !category || !price) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     // Validate addons
//     for (const addon of addons) {
//       if (addon.name && !addon.price) {
//         toast.error("Please enter price for all addons");
//         return;
//       }
//     }

//     setSaving(true);
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('category', category);
//     formData.append('price', price);
//     formData.append('stock', stock);
//     formData.append('status', status);
//     formData.append('description', description);
//     formData.append('addons', JSON.stringify(addons.filter(a => a.name && a.price))); // Only valid addons

//     if (product?._id) formData.append('id', product._id);
//     if (imageFile) formData.append('image', imageFile);

//     try {
//       await onSave(formData);
//       toast.success(product ? "Product updated!" : "Product created!");
//     } catch (err) {
//       toast.error("Failed to save");
//     } finally {
//       setSaving(false);
//       onClose();
//     }
//   };

//   const imageSrc = previewImage || product?.image || FALLBACK_IMAGE;

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 max-h-[95vh] overflow-y-auto">

//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {product ? 'Edit Product' : 'Add New Product'}
//           </h2>
//           <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition">
//             <X size={28} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-7">

//           {/* Image Upload */}
//           <div>
//             <label className="block text-lg font-semibold text-gray-800 mb-4">Product Image</label>
//             <div className="relative">
//               <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300">
//                 <Image src={imageSrc} alt="Product" fill className="object-cover" unoptimized />
//               </div>

//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="absolute bottom-4 left-1/2 -translate-x-1/2 px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition shadow-2xl flex items-center gap-3"
//               >
//                 <Upload size={24} />
//                 {previewImage || product?.image ? 'Change Image' : 'Upload Image'}
//               </button>

//               {(previewImage || product?.image) && (
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
//                 >
//                   <Trash2 size={22} />
//                 </button>
//               )}
//             </div>

//             <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//             <p className="text-center text-sm text-gray-500 mt-3">
//               Auto-compressed • Max 10MB • JPG/PNG/WebP
//             </p>
//           </div>

//           {/* Name */}
//           <div>
//             <label className="block text-lg font-semibold text-gray-800 mb-3">Product Name *</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               placeholder="e.g. Classic Cheeseburger"
//               className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-lg focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-lg font-semibold text-gray-800 mb-3">Category *</label>
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               required
//               className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-lg focus:outline-none focus:ring-4 focus:ring-orange-500 transition appearance-none"
//             >
//               <option value="">Select category</option>
//               <option value="Food">Food</option>
//               <option value="Drinks">Drinks</option>
//               <option value="Desserts">Desserts</option>
//             </select>
//           </div>

//           {/* Price & Stock */}
//           <div className="grid grid-cols-2 gap-5">
//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-3">Price *</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 required
//                 placeholder="29.99"
//                 className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-3">Stock</label>
//               <input
//                 type="number"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//                 min="0"
//                 placeholder="50"
//                 className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
//               />
//             </div>
//           </div>

//           {/* ADDON ITEMS SECTION */}
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <label className="text-lg font-semibold text-gray-800">Addon Items (Optional)</label>
//               <button
//                 type="button"
//                 onClick={addAddon}
//                 className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition flex items-center gap-2"
//               >
//                 <PlusCircle size={20} />
//                 Add Addon
//               </button>
//             </div>

//             {addons.length === 0 ? (
//               <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-2xl">
//                 No addons yet. Click "Add Addon" to offer extras like Mayo, Cheese, etc.
//               </p>
//             ) : (
//               <div className="space-y-4">
//                 {addons.map((addon, index) => (
//                   <div key={index} className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
//                     <input
//                       type="text"
//                       value={addon.name}
//                       onChange={(e) => updateAddon(index, 'name', e.target.value)}
//                       placeholder="e.g. Extra Mayo"
//                       className="flex-1 px-5 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-500"
//                     />
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={addon.price}
//                       onChange={(e) => updateAddon(index, 'price', e.target.value)}
//                       placeholder="Price"
//                       className="w-32 px-5 py-4 bg-white rounded-xl border border-gray-200 text-center focus:outline-none focus:ring-4 focus:ring-orange-500"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeAddon(index)}
//                       className="p-3 bg-red-100 hover:bg-red-200 rounded-xl transition"
//                     >
//                       <MinusCircle size={24} className="text-red-600" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Status */}
//           <div>
//             <label className="block text-lg font-semibold text-gray-800 mb-4">Status</label>
//             <div className="flex gap-8">
//               <label className="flex items-center gap-4 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="status"
//                   value="active"
//                   checked={status === "active"}
//                   onChange={() => setStatus("active")}
//                   className="w-7 h-7 text-emerald-600 focus:ring-emerald-500"
//                 />
//                 <span className="text-lg font-medium">Active</span>
//               </label>
//               <label className="flex items-center gap-4 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="status"
//                   value="inactive"
//                   checked={status === "inactive"}
//                   onChange={() => setStatus("inactive")}
//                   className="w-7 h-7 text-red-600 focus:ring-red-500"
//                 />
//                 <span className="text-lg font-medium">Inactive</span>
//               </label>
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-lg font-semibold text-gray-800 mb-3">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={4}
//               placeholder="Describe your delicious dish..."
//               className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-lg focus:outline-none focus:ring-4 focus:ring-orange-500 transition resize-none"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-4 pt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={saving}
//               className="flex-1 py-5 border-2 border-gray-300 rounded-2xl font-bold text-xl hover:bg-gray-50 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="flex-1 py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-2xl"
//             >
//               {saving ? (
//                 <>
//                   <Loader2 className="animate-spin" size={28} />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save size={28} />
//                   {product ? "Update Product" : "Add Product"}
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // components/ProductModal.js → FIXED: added branch selection + required validation

// "use client";

// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import toast from 'react-hot-toast';
// import { X, Save, Upload, Trash2, Loader2, PlusCircle, MinusCircle } from 'lucide-react';

// const FALLBACK_IMAGE = "/Images/placeholder-product.jpg";

// const compressImage = (file) => {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const img = new window.Image();
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         let width = img.width;
//         let height = img.height;

//         if (width > 1200) {
//           height = (1200 / width) * height;
//           width = 1200;
//         }

//         canvas.width = width;
//         canvas.height = height;
//         ctx.drawImage(img, 0, 0, width, height);

//         canvas.toBlob((blob) => {
//           const compressedFile = new File(
//             [blob],
//             file.name.replace(/\.[^/.]/, ".webp"),
//             {
//               type: 'image/webp',
//               lastModified: Date.now(),
//             }
//           );
//           resolve(compressedFile);
//         }, 'image/webp', 0.85);
//       };
//       img.src = e.target.result;
//     };
//     reader.readAsDataURL(file);
//   });
// };

// export default function ProductModal({ product, onClose, onSave }) {
//   const [name, setName] = useState('');
//   const [category, setCategory] = useState('');
//   const [price, setPrice] = useState('');
//   const [costPrice, setCostPrice] = useState('');
//   const [packagingCost, setPackagingCost] = useState('');
//   const [prepTimeMinutes, setPrepTimeMinutes] = useState('10');
//   const [stock, setStock] = useState('');
//   const [status, setStatus] = useState('active');
//   const [description, setDescription] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [previewImage, setPreviewImage] = useState('');
//   const [saving, setSaving] = useState(false);
//   const fileInputRef = useRef();

//   const [addons, setAddons] = useState([]);

//   const [profitPerItem, setProfitPerItem] = useState(0);
//   const [profitMargin, setProfitMargin] = useState(0);

//   useEffect(() => {
//     if (product) {
//       setName(product.name || '');
//       setCategory(product.category || '');
//       setPrice(product.price?.toString() || '');
//       setCostPrice(product.costPrice?.toString() || '0');
//       setPackagingCost(product.packagingCost?.toString() || '0');
//       setPrepTimeMinutes(product.prepTimeMinutes?.toString() || '10');
//       setStock(product.stock?.toString() || '0');
//       setStatus(product.status || 'active');
//       setDescription(product.description || '');
//       setPreviewImage(product.image || '');
//       setImageFile(null);
//       setAddons(product.addons || []);
//     } else {
//       resetForm();
//     }
//   }, [product]);

//   useEffect(() => {
//     const p = parseFloat(price) || 0;
//     const cp = parseFloat(costPrice) || 0;
//     const pc = parseFloat(packagingCost) || 0;
//     const totalCost = cp + pc;
//     const profit = p - totalCost;

//     setProfitPerItem(profit);
//     setProfitMargin(p > 0 ? ((profit / p) * 100).toFixed(1) : 0);
//   }, [price, costPrice, packagingCost]);

//   const resetForm = () => {
//     setName('');
//     setCategory('');
//     setPrice('');
//     setCostPrice('0');
//     setPackagingCost('0');
//     setPrepTimeMinutes('10');
//     setStock('0');
//     setStatus('active');
//     setDescription('');
//     setPreviewImage('');
//     setImageFile(null);
//     setAddons([]);
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.size > 10 * 1024 * 1024) return toast.error("Image too large! Max 10MB");
//     if (!file.type.startsWith('image/')) return toast.error("Please select an image");

//     const reader = new FileReader();
//     reader.onloadend = () => setPreviewImage(reader.result);
//     reader.readAsDataURL(file);

//     toast.loading("Optimizing image...", { id: "compress" });

//     try {
//       const compressed = await compressImage(file);
//       setImageFile(compressed);
//       toast.success(`Compressed to ${(compressed.size / 1024).toFixed(0)} KB`, { id: "compress" });
//     } catch {
//       toast.error("Using original image", { id: "compress" });
//       setImageFile(file);
//     }
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setPreviewImage('');
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name.trim()) return toast.error("Product name is required");
//     if (!category) return toast.error("Category is required");
//     if (!price || parseFloat(price) <= 0)
//       return toast.error("Valid selling price is required");

//     const invalidAddon = addons.find(
//       a => a.name.trim() && (!a.price || parseFloat(a.price) < 0)
//     );
//     if (invalidAddon) return toast.error("All addons must have a valid price");

//     setSaving(true);

//     const submitData = new FormData();
//     submitData.append('name', name.trim());
//     submitData.append('category', category);
//     submitData.append('price', price);
//     submitData.append('costPrice', costPrice || '0');
//     submitData.append('packagingCost', packagingCost || '0');
//     submitData.append('prepTimeMinutes', prepTimeMinutes);
//     submitData.append('stock', stock || '0');
//     submitData.append('status', status);
//     submitData.append('description', description.trim());
//     submitData.append(
//       'addons',
//       JSON.stringify(addons.filter(a => a.name.trim() && a.price))
//     );

//     if (product?._id) submitData.append('id', product._id);
//     if (imageFile) submitData.append('image', imageFile);

//     try {
//       await onSave(submitData);
//       toast.success(product ? "Product updated!" : "Product created!");
//       onClose();
//     } catch (err) {
//       toast.error(err.message || "Failed to save product");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const imageSrc = previewImage || product?.image || FALLBACK_IMAGE;

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8 max-h-[95vh] overflow-y-auto">

//         <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {product ? 'Edit Product' : 'Add New Product'}
//           </h2>
//           <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition">
//             <X size={28} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-7">
//           {/* Image Upload */}
//           <div>
//             <label className="block text-lg font-semibold text-gray-800 mb-4">Product Image</label>
//             <div className="relative">
//               <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300">
//                 <Image src={imageSrc} alt="Product" fill className="object-cover" unoptimized />
//               </div>
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="absolute bottom-4 left-1/2 -translate-x-1/2 px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition shadow-2xl flex items-center gap-3"
//               >
//                 <Upload size={24} />
//                 {previewImage || product?.image ? 'Change Image' : 'Upload Image'}
//               </button>
//               {(previewImage || product?.image) && (
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
//                 >
//                   <Trash2 size={22} />
//                 </button>
//               )}
//             </div>
//             <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//             <p className="text-center text-sm text-gray-500 mt-3">Auto-compressed • Max 10MB</p>
//           </div>

//           {/* Basic Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-3">Product Name *</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 placeholder="e.g. Classic Cheeseburger"
//                 className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-3">Category *</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 required
//                 className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-500 transition appearance-none"
//               >
//                 <option value="">Select category</option>
//                 <option value="Food">Food</option>
//                 <option value="Drinks">Drinks</option>
//                 <option value="Desserts">Desserts</option>
//                 <option value="Sides">Sides</option>
//                 <option value="Beverages">Beverages</option>
//               </select>
//             </div>
//           </div>

//           {/* Pricing & Costs */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-3">Selling Price *</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 required
//                 min="0"
//                 placeholder="29.99"
//                 className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-3">Cost Price</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={costPrice}
//                 onChange={(e) => setCostPrice(e.target.value)}
//                 min="0"
//                 placeholder="0.00"
//                 className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-3">Packaging Cost</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={packagingCost}
//                 onChange={(e) => setPackagingCost(e.target.value)}
//                 min="0"
//                 placeholder="0.00"
//                 className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
//               />
//             </div>
//           </div>

//           {/* Margin Display */}
//           <div className="bg-gradient-to-r from-orange-50 to-red-50 p-5 rounded-2xl border border-orange-100">
//             <div className="grid grid-cols-2 gap-6 text-center">
//               <div>
//                 <p className="text-sm text-gray-600">Profit per Item</p>
//                 <p className="text-2xl font-bold text-emerald-700">{profitPerItem.toFixed(2)}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Profit Margin</p>
//                 <p className="text-2xl font-bold text-emerald-700">{profitMargin}%</p>
//               </div>
//             </div>
//           </div>

//           {/* Prep Time & Stock */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-3">Prep Time (minutes)</label>
//               <input
//                 type="number"
//                 value={prepTimeMinutes}
//                 onChange={(e) => setPrepTimeMinutes(e.target.value)}
//                 min="1"
//                 placeholder="10"
//                 className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-3">Stock</label>
//               <input
//                 type="number"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//                 min="0"
//                 placeholder="50"
//                 className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
//               />
//             </div>
//           </div>

//           {/* Addons */}
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <label className="text-lg font-semibold text-gray-800">Addon Items (Optional)</label>
//               <button
//                 type="button"
//                 onClick={() => setAddons([...addons, { name: '', price: '' }])}
//                 className="px-5 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition flex items-center gap-2"
//               >
//                 <PlusCircle size={20} />
//                 Add Addon
//               </button>
//             </div>

//             {addons.length === 0 ? (
//               <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-2xl">
//                 No addons added yet (e.g. Extra Cheese, Mayo)
//               </p>
//             ) : (
//               <div className="space-y-4">
//                 {addons.map((addon, index) => (
//                   <div key={index} className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
//                     <input
//                       type="text"
//                       value={addon.name}
//                       onChange={(e) => {
//                         const newAddons = [...addons];
//                         newAddons[index].name = e.target.value;
//                         setAddons(newAddons);
//                       }}
//                       placeholder="e.g. Extra Mayo"
//                       className="flex-1 px-5 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-500"
//                     />
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={addon.price}
//                       onChange={(e) => {
//                         const newAddons = [...addons];
//                         newAddons[index].price = e.target.value;
//                         setAddons(newAddons);
//                       }}
//                       placeholder="2.50"
//                       className="w-32 px-5 py-4 bg-white rounded-xl border border-gray-200 text-center focus:outline-none focus:ring-4 focus:ring-orange-500"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setAddons(addons.filter((_, i) => i !== index))}
//                       className="p-3 bg-red-100 hover:bg-red-200 rounded-xl transition"
//                     >
//                       <MinusCircle size={24} className="text-red-600" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Status & Description */}
//           <div className="space-y-7">
//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-4">Status</label>
//               <div className="flex gap-10">
//                 <label className="flex items-center gap-4 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="active"
//                     checked={status === "active"}
//                     onChange={() => setStatus("active")}
//                     className="w-6 h-6 text-emerald-600 focus:ring-emerald-500"
//                   />
//                   <span className="text-lg font-medium">Active</span>
//                 </label>
//                 <label className="flex items-center gap-4 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="inactive"
//                     checked={status === "inactive"}
//                     onChange={() => setStatus("inactive")}
//                     className="w-6 h-6 text-red-600 focus:ring-red-500"
//                   />
//                   <span className="text-lg font-medium">Inactive</span>
//                 </label>
//               </div>
//             </div>

//             <div>
//               <label className="block text-lg font-semibold text-gray-800 mb-3">Description</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={4}
//                 placeholder="Tell customers why this is delicious..."
//                 className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-500 transition resize-none"
//               />
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-5 pt-8 border-t border-gray-100">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={saving}
//               className="flex-1 py-5 border-2 border-gray-300 rounded-2xl font-bold text-xl hover:bg-gray-50 transition disabled:opacity-60"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="flex-1 py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-3"
//             >
//               {saving ? (
//                 <>
//                   <Loader2 className="animate-spin" size={28} />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save size={28} />
//                   {product ? "Update Product" : "Create Product"}
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// components/ProductModal.js → PREMIUM DARK REDESIGN (matching admin dashboard style)
// Inter font | Dark glass theme | Glows/Hovers | ALL ORIGINAL LOGIC PRESERVED

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
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]/, ".webp"),
            {
              type: 'image/webp',
              lastModified: Date.now(),
            }
          );
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
  const [costPrice, setCostPrice] = useState('');
  const [packagingCost, setPackagingCost] = useState('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState('10');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('active');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();

  const [addons, setAddons] = useState([]);

  const [profitPerItem, setProfitPerItem] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      setPrice(product.price?.toString() || '');
      setCostPrice(product.costPrice?.toString() || '0');
      setPackagingCost(product.packagingCost?.toString() || '0');
      setPrepTimeMinutes(product.prepTimeMinutes?.toString() || '10');
      setStock(product.stock?.toString() || '0');
      setStatus(product.status || 'active');
      setDescription(product.description || '');
      setPreviewImage(product.image || '');
      setImageFile(null);
      setAddons(product.addons || []);
    } else {
      resetForm();
    }
  }, [product]);

  useEffect(() => {
    const p = parseFloat(price) || 0;
    const cp = parseFloat(costPrice) || 0;
    const pc = parseFloat(packagingCost) || 0;
    const totalCost = cp + pc;
    const profit = p - totalCost;

    setProfitPerItem(profit);
    setProfitMargin(p > 0 ? ((profit / p) * 100).toFixed(1) : 0);
  }, [price, costPrice, packagingCost]);

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setCostPrice('0');
    setPackagingCost('0');
    setPrepTimeMinutes('10');
    setStock('0');
    setStatus('active');
    setDescription('');
    setPreviewImage('');
    setImageFile(null);
    setAddons([]);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("Image too large! Max 10MB");
    if (!file.type.startsWith('image/')) return toast.error("Please select an image");

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    toast.loading("Optimizing image...", { id: "compress" });

    try {
      const compressed = await compressImage(file);
      setImageFile(compressed);
      toast.success(`Compressed to ${(compressed.size / 1024).toFixed(0)} KB`, { id: "compress" });
    } catch {
      toast.error("Using original image", { id: "compress" });
      setImageFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Product name is required");
    if (!category) return toast.error("Category is required");
    if (!price || parseFloat(price) <= 0)
      return toast.error("Valid selling price is required");

    const invalidAddon = addons.find(
      a => a.name.trim() && (!a.price || parseFloat(a.price) < 0)
    );
    if (invalidAddon) return toast.error("All addons must have a valid price");

    setSaving(true);

    const submitData = new FormData();
    submitData.append('name', name.trim());
    submitData.append('category', category);
    submitData.append('price', price);
    submitData.append('costPrice', costPrice || '0');
    submitData.append('packagingCost', packagingCost || '0');
    submitData.append('prepTimeMinutes', prepTimeMinutes);
    submitData.append('stock', stock || '0');
    submitData.append('status', status);
    submitData.append('description', description.trim());
    submitData.append(
      'addons',
      JSON.stringify(addons.filter(a => a.name.trim() && a.price))
    );

    if (product?._id) submitData.append('id', product._id);
    if (imageFile) submitData.append('image', imageFile);

    try {
      await onSave(submitData);
      toast.success(product ? "Product updated!" : "Product created!");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const imageSrc = previewImage || product?.image || FALLBACK_IMAGE;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes dbUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }

        .modal-overlay {
          font-family: 'Inter', system-ui, sans-serif;
        }

        .modal-content {
          background: rgba(10,14,22,0.98);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          box-shadow: 0 20px 70px rgba(0,0,0,0.7);
          animation: dbUp 0.45s ease both;
        }

        .modal-header {
          background: rgba(8,11,16,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .input-dark {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 15px;
          transition: all 0.2s;
        }

        .input-dark:focus {
          outline: none;
          border-color: rgba(245,158,11,0.5);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
        }

        .input-dark::placeholder { color: rgba(255,255,255,0.35); }

        .addon-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.25s;
        }

        .addon-card:hover {
          background: rgba(255,255,255,0.05);
          transform: translateY(-2px);
        }

        .profit-badge {
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.3);
          color: #10b981;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .submit-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          transition: all 0.25s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(245,158,11,0.4);
        }

        .cancel-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: rgba(255,255,255,0.12);
        }
      `}</style>

      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto modal-overlay">
        <div className="modal-content w-full max-w-3xl my-8 max-h-[95vh] overflow-y-auto">
          <div className="modal-header sticky top-0 z-10 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-white/80 hover:text-white"
            >
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8 text-white/90">
            {/* Image Upload */}
            <div>
              <label className="block text-xl font-semibold mb-4">Product Image</label>
              <div className="relative group">
                <div className="w-full h-64 bg-black/40 rounded-2xl overflow-hidden border-2 border-dashed border-white/20 group-hover:border-amber-500/50 transition-all">
                  <Image
                    src={imageSrc}
                    alt="Product preview"
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition"
                    unoptimized
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-2xl font-medium hover:from-amber-500 hover:to-amber-400 transition shadow-2xl flex items-center gap-3"
                >
                  <Upload size={22} />
                  {previewImage || product?.image ? 'Change Image' : 'Upload Image'}
                </button>

                {(previewImage || product?.image) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-3 bg-red-600/80 hover:bg-red-700 rounded-full transition text-white shadow-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="text-center text-sm text-white/50 mt-4">
                Auto-compressed • Max 10MB • Recommended 1200px width
              </p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Classic Cheeseburger"
                  className="input-dark w-full"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="select-field w-full"
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Sides">Sides</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>
            </div>

            {/* Pricing & Costs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-medium mb-2">Selling Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  placeholder="29.99"
                  className="input-dark w-full text-center text-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">Cost Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  min="0"
                  placeholder="0.00"
                  className="input-dark w-full text-center text-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">Packaging Cost</label>
                <input
                  type="number"
                  step="0.01"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(e.target.value)}
                  min="0"
                  placeholder="0.00"
                  className="input-dark w-full text-center text-xl font-bold"
                />
              </div>
            </div>

            {/* Profit Display */}
            <div className="bg-gradient-to-r from-amber-900/20 to-red-900/10 p-6 rounded-2xl border border-amber-500/20 text-center">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-white/60 mb-1">Profit per Item</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    ₹{profitPerItem.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Profit Margin</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {profitMargin}%
                  </p>
                </div>
              </div>
            </div>

            {/* Prep Time & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium mb-2">Prep Time (minutes)</label>
                <input
                  type="number"
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(e.target.value)}
                  min="1"
                  placeholder="10"
                  className="input-dark w-full text-center text-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  placeholder="50"
                  className="input-dark w-full text-center text-xl font-bold"
                />
              </div>
            </div>

            {/* Addons */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-xl font-semibold">Addon Items (Optional)</label>
                <button
                  type="button"
                  onClick={() => setAddons([...addons, { name: '', price: '' }])}
                  className="px-6 py-3 bg-amber-600/80 hover:bg-amber-600 text-white rounded-xl font-medium transition flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Add Addon
                </button>
              </div>

              {addons.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white/50">No addons added yet (e.g. Extra Cheese, Mayo)</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addons.map((addon, index) => (
                    <div key={index} className="addon-card flex items-center gap-4">
                      <input
                        type="text"
                        value={addon.name}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].name = e.target.value;
                          setAddons(newAddons);
                        }}
                        placeholder="e.g. Extra Mayo"
                        className="flex-1 input-dark"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={addon.price}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].price = e.target.value;
                          setAddons(newAddons);
                        }}
                        placeholder="2.50"
                        className="w-32 input-dark text-center"
                      />
                      <button
                        type="button"
                        onClick={() => setAddons(addons.filter((_, i) => i !== index))}
                        className="p-3 bg-red-600/20 hover:bg-red-600/40 rounded-xl transition text-red-400"
                      >
                        <MinusCircle size={22} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status & Description */}
            <div className="space-y-8">
              <div>
                <label className="block text-xl font-semibold mb-4">Status</label>
                <div className="flex gap-12">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={status === "active"}
                      onChange={() => setStatus("active")}
                      className="w-6 h-6 accent-emerald-500"
                    />
                    <span className="text-lg font-medium text-emerald-300">Active</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={status === "inactive"}
                      onChange={() => setStatus("inactive")}
                      className="w-6 h-6 accent-red-500"
                    />
                    <span className="text-lg font-medium text-red-300">Inactive</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xl font-semibold mb-3">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Tell customers why this is delicious..."
                  className="input-dark w-full resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-5 pt-8 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="cancel-btn flex-1"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`submit-btn flex-1 flex items-center justify-center gap-3 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={24} />
                    {product ? "Update Product" : "Create Product"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}