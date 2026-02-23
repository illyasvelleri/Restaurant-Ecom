// 'use client';

// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { PlusCircle, Edit, Trash2, Loader2, X } from 'lucide-react';

// export default function PricingRulesPage() {
//   // Fix 1: Add mounted state to prevent the "Server Error / useContext" hydration issue
//   const [mounted, setMounted] = useState(false);

//   const [rules, setRules] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editingRule, setEditingRule] = useState(null);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     productId: '',
//     type: 'happy-hour',
//     discountPercentage: 0,
//     increasePercentage: 0,
//     startTime: '',
//     endTime: '',
//     daysOfWeek: [],
//     active: true,
//     priority: 0,
//   });

//   useEffect(() => {
//     setMounted(true); // Fix 1 continued
//     fetchRules();
//     fetchProducts();
//   }, []);

//   const fetchRules = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/pricing-rules');
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.error || 'Failed to load rules');
//       }
//       const data = await res.json();
//       setRules(data.rules || []);
//     } catch (err) {
//       toast.error(err.message || 'Failed to load pricing rules');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch('/api/admin/products');
//       if (!res.ok) return;
//       const data = await res.json();
//       setProducts(Array.isArray(data) ? data : data.products || data || []);
//     } catch {
//       console.warn('Failed to load products');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     let finalValue = type === 'checkbox' ? checked : value;

//     if (['discountPercentage', 'increasePercentage', 'priority'].includes(name)) {
//       finalValue = value === '' ? 0 : Number(value);
//     }

//     // Fix 2: If user types discount, clear increase (and vice versa) to pass validation
//     if (name === 'discountPercentage' && Number(value) > 0) {
//       setFormData(prev => ({ ...prev, discountPercentage: Number(value), increasePercentage: 0 }));
//     } else if (name === 'increasePercentage' && Number(value) > 0) {
//       setFormData(prev => ({ ...prev, increasePercentage: Number(value), discountPercentage: 0 }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: finalValue }));
//     }
//   };

//   const handleDaysChange = (day) => {
//     setFormData(prev => ({
//       ...prev,
//       daysOfWeek: prev.daysOfWeek.includes(day)
//         ? prev.daysOfWeek.filter(d => d !== day)
//         : [...prev.daysOfWeek, day],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name.trim()) return toast.error('Rule name is required');
//     if (!formData.type) return toast.error('Rule type is required');

//     // Safety check for both values
//     if (formData.discountPercentage > 0 && formData.increasePercentage > 0) {
//       return toast.error('Cannot apply both discount and increase. One must be 0.');
//     }

//     setSaving(true);

//     const payload = {
//       name: formData.name.trim(),
//       description: formData.description.trim() || undefined,
//       productId:
//         typeof formData.productId === 'string' && formData.productId.trim() !== ''
//           ? formData.productId
//           : undefined,
//       type: formData.type,
//       discountPercentage: Number(formData.discountPercentage) || 0,
//       increasePercentage: Number(formData.increasePercentage) || 0,
//       startTime: formData.startTime || undefined,
//       endTime: formData.endTime || undefined,
//       daysOfWeek: formData.daysOfWeek,
//       active: formData.active,
//       priority: Number(formData.priority) || 0,
//     };

//     try {
//       const method = editingRule ? 'PUT' : 'POST';
//       const url = editingRule ? `/api/pricing-rules/${editingRule._id}` : '/api/pricing-rules';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || data.message || 'Failed to save rule');

//       toast.success(editingRule ? 'Rule updated successfully' : 'Rule created successfully');

//       setShowForm(false);
//       setEditingRule(null);
//       setFormData({
//         name: '',
//         description: '',
//         productId: '',
//         type: 'happy-hour',
//         discountPercentage: 0,
//         increasePercentage: 0,
//         startTime: '',
//         endTime: '',
//         daysOfWeek: [],
//         active: true,
//         priority: 0,
//       });

//       fetchRules();
//     } catch (err) {
//       console.error('SUBMIT ERROR:', err);
//       toast.error(err.message || 'Failed to save pricing rule');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEdit = (rule) => {
//     if (!rule?._id) return toast.error('Invalid rule selected');

//     setEditingRule(rule);
//     setFormData({
//       name: rule.name || '',
//       description: rule.description || '',
//       productId: rule.productId?._id || rule.productId || '',
//       type: rule.type || 'happy-hour',
//       discountPercentage: rule.discountPercentage || 0,
//       increasePercentage: rule.increasePercentage || 0,
//       startTime: rule.startTime || '',
//       endTime: rule.endTime || '',
//       daysOfWeek: rule.daysOfWeek || [],
//       active: rule.active !== false,
//       priority: rule.priority || 0,
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this pricing rule?')) return;

//     try {
//       const res = await fetch(`/api/pricing-rules/${id}`, { method: 'DELETE' });
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || 'Delete failed');
//       }
//       toast.success('Rule deleted');
//       fetchRules();
//     } catch (err) {
//       toast.error(err.message || 'Failed to delete rule');
//     }
//   };

//   // Prevent "useContext" null error by waiting for mount
//   if (!mounted) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Dynamic Pricing Rules</h1>
//           <button
//             onClick={() => {
//               setEditingRule(null);
//               setFormData({
//                 name: '', description: '', productId: '', type: 'happy-hour',
//                 discountPercentage: 0, increasePercentage: 0, startTime: '',
//                 endTime: '', daysOfWeek: [], active: true, priority: 0,
//               });
//               setShowForm(true);
//             }}
//             className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
//           >
//             <PlusCircle size={18} />
//             Create New Rule
//           </button>
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600" />
//             <p className="mt-4 text-gray-600">Loading pricing rules...</p>
//           </div>
//         ) : rules.length === 0 ? (
//           <div className="bg-white rounded-xl shadow border p-12 text-center text-gray-500">
//             No pricing rules created yet.
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {rules.map(rule => (
//               <div key={rule._id} className="bg-white rounded-xl shadow border p-6 hover:shadow-lg transition-all">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="font-bold text-lg">{rule.name}</h3>
//                     <p className="text-sm text-gray-600 mt-1">{rule.description || 'No description'}</p>
//                   </div>
//                   <span className={`px-3 py-1 text-xs font-medium rounded-full ${rule.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                     {rule.active ? 'Active' : 'Inactive'}
//                   </span>
//                 </div>

//                 <div className="space-y-2 text-sm text-gray-700">
//                   <p><strong>Product:</strong> {rule.productId?.name || 'All Products'}</p>
//                   <p><strong>Type:</strong> {rule.type.replace('-', ' ')}</p>
//                   {rule.discountPercentage > 0 && <p><strong>Discount:</strong> {rule.discountPercentage}%</p>}
//                   {rule.increasePercentage > 0 && <p><strong>Increase:</strong> {rule.increasePercentage}%</p>}
//                   {rule.startTime && rule.endTime && <p><strong>Time:</strong> {rule.startTime} – {rule.endTime}</p>}
//                   {rule.daysOfWeek?.length > 0 && <p><strong>Days:</strong> {rule.daysOfWeek.join(', ')}</p>}
//                   <p><strong>Priority:</strong> {rule.priority}</p>
//                 </div>

//                 <div className="flex justify-end gap-3 mt-6">
//                   <button onClick={() => handleEdit(rule)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="Edit">
//                     <Edit size={18} />
//                   </button>
//                   <button onClick={() => handleDelete(rule._id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Delete">
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {editingRule ? 'Edit Pricing Rule' : 'Create New Pricing Rule'}
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={() => { setShowForm(false); setEditingRule(null); }}
//                   className="p-2 hover:bg-gray-100 rounded-full transition"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Rule Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="e.g. Evening Discount 10%"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows={3}
//                     placeholder="When and why this rule applies..."
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Apply to Product (optional)</label>
//                   <select
//                     name="productId"
//                     value={formData.productId}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Products</option>
//                     {products.map(p => (
//                       <option key={p._id} value={p._id}>{p.name} ({p.category || '—'})</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type <span className="text-red-500">*</span></label>
//                   <select
//                     name="type"
//                     value={formData.type}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="happy-hour">Happy Hour</option>
//                     <option value="weekend">Weekend Pricing</option>
//                     <option value="surge">Surge Pricing</option>
//                     <option value="low-demand">Low Demand Discount</option>
//                     <option value="promo">Promo / Campaign</option>
//                     <option value="seasonal">Seasonal Adjustment</option>
//                   </select>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       step="0.1"
//                       name="discountPercentage"
//                       value={formData.discountPercentage}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Increase (%)</label>
//                     <input
//                       type="number"
//                       min="0"
//                       step="0.1"
//                       name="increasePercentage"
//                       value={formData.increasePercentage}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                     <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                     <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Apply on these days</label>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
//                       <label key={day} className="flex items-center gap-2 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={formData.daysOfWeek.includes(day)}
//                           onChange={() => handleDaysChange(day)}
//                           className="rounded text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm">{day}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3 pt-4">
//                   <input
//                     type="checkbox"
//                     id="active"
//                     name="active"
//                     checked={formData.active}
//                     onChange={handleInputChange}
//                     className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5"
//                   />
//                   <label htmlFor="active" className="text-sm font-medium text-gray-700">Rule is active</label>
//                 </div>

//                 <div className="flex justify-end gap-4 pt-6 border-t">
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit" // Fix 3: Ensure this is type="submit"
//                     disabled={saving}
//                     className={`px-6 py-3 rounded-xl text-white flex items-center gap-2 font-medium transition ${
//                       saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//                     }`}
//                   >
//                     {saving ? (
//                       <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
//                     ) : editingRule ? (
//                       'Update Rule'
//                     ) : (
//                       'Create Rule'
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// app/admin/pricing-rules/page.js → PREMIUM DARK REDESIGN 2025 (matching admin suite)
// Inter font | Dark glass theme | Glows/Hovers/Skeletons | 100% ORIGINAL LOGIC PRESERVED

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, Edit, Trash2, Loader2, X, RefreshCw } from 'lucide-react';

// ─────────────────────────────────────────────────────────
// PULSE DOT (same as dashboard)
// ─────────────────────────────────────────────────────────
function PulseDot({ color = "#10b981", size = 8 }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: size, height: size, flexShrink: 0 }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: color, animation: "dbPulse 2s ease-in-out infinite",
      }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(255,255,255,0.07)",
      animation: "dbUp 0.6s ease both",
    }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 28, width: '60%', borderRadius: 8, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ height: 16, width: '80%', borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
        <div style={{ height: 40, borderRadius: 12, background: "rgba(255,255,255,0.04)" }} />
      </div>
    </div>
  );
}

export default function PricingRulesPage() {
  const [mounted, setMounted] = useState(false);

  const [rules, setRules] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productId: '',
    type: 'happy-hour',
    discountPercentage: 0,
    increasePercentage: 0,
    startTime: '',
    endTime: '',
    daysOfWeek: [],
    active: true,
    priority: 0,
  });

  useEffect(() => {
    setMounted(true);
    fetchRules();
    fetchProducts();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pricing-rules');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to load rules');
      }
      const data = await res.json();
      setRules(data.rules || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load pricing rules');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (!res.ok) return;
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || data || []);
    } catch {
      console.warn('Failed to load products');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    if (['discountPercentage', 'increasePercentage', 'priority'].includes(name)) {
      finalValue = value === '' ? 0 : Number(value);
    }

    if (name === 'discountPercentage' && Number(value) > 0) {
      setFormData(prev => ({ ...prev, discountPercentage: Number(value), increasePercentage: 0 }));
    } else if (name === 'increasePercentage' && Number(value) > 0) {
      setFormData(prev => ({ ...prev, increasePercentage: Number(value), discountPercentage: 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleDaysChange = (day) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error('Rule name is required');
    if (!formData.type) return toast.error('Rule type is required');

    if (formData.discountPercentage > 0 && formData.increasePercentage > 0) {
      return toast.error('Cannot apply both discount and increase. One must be 0.');
    }

    setSaving(true);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      productId:
        typeof formData.productId === 'string' && formData.productId.trim() !== ''
          ? formData.productId
          : undefined,
      type: formData.type,
      discountPercentage: Number(formData.discountPercentage) || 0,
      increasePercentage: Number(formData.increasePercentage) || 0,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
      daysOfWeek: formData.daysOfWeek,
      active: formData.active,
      priority: Number(formData.priority) || 0,
    };

    try {
      const method = editingRule ? 'PUT' : 'POST';
      const url = editingRule ? `/api/pricing-rules/${editingRule._id}` : '/api/pricing-rules';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message || 'Failed to save rule');

      toast.success(editingRule ? 'Rule updated successfully' : 'Rule created successfully');

      setShowForm(false);
      setEditingRule(null);
      setFormData({
        name: '',
        description: '',
        productId: '',
        type: 'happy-hour',
        discountPercentage: 0,
        increasePercentage: 0,
        startTime: '',
        endTime: '',
        daysOfWeek: [],
        active: true,
        priority: 0,
      });

      fetchRules();
    } catch (err) {
      console.error('SUBMIT ERROR:', err);
      toast.error(err.message || 'Failed to save pricing rule');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (rule) => {
    if (!rule?._id) return toast.error('Invalid rule selected');

    setEditingRule(rule);
    setFormData({
      name: rule.name || '',
      description: rule.description || '',
      productId: rule.productId?._id || rule.productId || '',
      type: rule.type || 'happy-hour',
      discountPercentage: rule.discountPercentage || 0,
      increasePercentage: rule.increasePercentage || 0,
      startTime: rule.startTime || '',
      endTime: rule.endTime || '',
      daysOfWeek: rule.daysOfWeek || [],
      active: rule.active !== false,
      priority: rule.priority || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this pricing rule?')) return;

    try {
      const res = await fetch(`/api/pricing-rules/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Delete failed');
      }
      toast.success('Rule deleted');
      fetchRules();
    } catch (err) {
      toast.error(err.message || 'Failed to delete rule');
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes dbUp       { from{opacity:0;transform:translateY(18px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes dbPulse    { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(2.4);opacity:0;} }
        @keyframes dbShimmer  { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }

        .price-page {
          font-family:'Inter', system-ui, sans-serif;
          min-height:100vh;
          background:#080b10;
          color:#fff;
          padding-bottom:80px;
        }

        .price-topbar {
          position:sticky; top:0; z-index:50;
          background:rgba(8,11,16,0.88);
          backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding:18px 24px;
        }

        .price-title {
          font-size:clamp(22px,4vw,30px);
          font-weight:500; letter-spacing:-0.02em;
        }

        .price-add-btn {
          background:linear-gradient(135deg,#3b82f6,#2563eb);
          color:white;
          border:none;
          padding:10px 18px;
          border-radius:12px;
          font-weight:500;
          transition:all 0.2s;
        }

        .price-add-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(59,130,246,0.4); }

        .price-refresh-btn {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.7);
          padding:10px 16px;
          border-radius:12px;
          transition:all 0.2s;
        }

        .price-refresh-btn:hover { background:rgba(255,255,255,0.08); color:#fff; }

        .rule-card {
          background:rgba(255,255,255,0.015);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:20px;
          padding:20px;
          transition:all 0.3s ease;
        }

        .rule-card:hover {
          transform:translateY(-4px);
          box-shadow:0 16px 40px rgba(0,0,0,0.4);
        }

        .rule-type-badge {
          padding:4px 12px;
          border-radius:999px;
          font-size:10px;
          font-weight:500;
          letter-spacing:0.08em;
          text-transform:uppercase;
        }

        .form-modal {
          background:rgba(10,14,22,0.98);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:24px;
          box-shadow:0 20px 70px rgba(0,0,0,0.7);
          animation:dbUp 0.45s ease both;
        }

        .input-dark {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.12);
          color:#fff;
          border-radius:14px;
          padding:14px 16px;
          transition:all 0.2s;
        }

        .input-dark:focus {
          border-color:rgba(245,158,11,0.5);
          box-shadow:0 0 0 3px rgba(245,158,11,0.15);
        }

        .submit-btn {
          background:linear-gradient(135deg,#f59e0b,#d97706);
          transition:all 0.25s;
        }

        .submit-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(245,158,11,0.4);
        }

        .cancel-btn {
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.12);
          transition:all 0.2s;
        }

        .cancel-btn:hover { background:rgba(255,255,255,0.12); }
      `}</style>

      <div className="price-page">

        {/* ── TOPBAR ── */}
        <div className="price-topbar">
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PulseDot color="#f59e0b" size={9} />
              <h1 className="price-title">Pricing Rules</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={fetchRules}
                disabled={loading}
                className="price-refresh-btn flex items-center gap-2"
              >
                <RefreshCw size={16} style={{ animation: loading ? 'dbSpin 1s linear infinite' : 'none' }} />
                Refresh
              </button>

              <button
                onClick={() => {
                  setEditingRule(null);
                  setFormData({
                    name: '', description: '', productId: '', type: 'happy-hour',
                    discountPercentage: 0, increasePercentage: 0, startTime: '',
                    endTime: '', daysOfWeek: [], active: true, priority: 0,
                  });
                  setShowForm(true);
                }}
                className="price-add-btn flex items-center gap-2"
              >
                <PlusCircle size={18} />
                New Rule
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1400, margin: '32px auto', padding: '0 20px' }}>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-32 text-white/50">
              <Package size={72} className="mx-auto mb-6 opacity-40" />
              <p style={{ fontSize: 22, fontWeight: 500 }}>
                No pricing rules created yet
              </p>
              <p style={{ marginTop: 12, fontSize: 15 }}>
                Create dynamic pricing rules for happy hours, surge, etc.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rules.map(rule => (
                <div key={rule._id} className="rule-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>
                        {rule.name}
                      </h3>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                        {rule.description || 'No description'}
                      </p>
                    </div>

                    <span className="rule-type-badge" style={{
                      background: rule.active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      color: rule.active ? '#10b981' : '#ef4444',
                      border: `1px solid ${rule.active ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                    }}>
                      {rule.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                    <p><strong>Type:</strong> {rule.type.replace('-', ' ').toUpperCase()}</p>
                    {rule.productId?.name && <p><strong>Product:</strong> {rule.productId.name}</p>}
                    {rule.discountPercentage > 0 && <p><strong>Discount:</strong> {rule.discountPercentage}%</p>}
                    {rule.increasePercentage > 0 && <p><strong>Increase:</strong> {rule.increasePercentage}%</p>}
                    {rule.startTime && rule.endTime && <p><strong>Time:</strong> {rule.startTime} – {rule.endTime}</p>}
                    {rule.daysOfWeek?.length > 0 && <p><strong>Days:</strong> {rule.daysOfWeek.join(', ')}</p>}
                    <p><strong>Priority:</strong> {rule.priority}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                    <button
                      onClick={() => handleEdit(rule)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-blue-400 hover:text-blue-300"
                      title="Edit Rule"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(rule._id)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-red-400 hover:text-red-300"
                      title="Delete Rule"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FORM MODAL ── */}
        {/* ── FORM MODAL ── (Fully Responsive + Mobile Optimized) */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="form-modal w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl shadow-2xl">

              {/* Sticky Header */}
              <div className="sticky top-0 z-10 px-5 sm:px-8 py-5 sm:py-6 flex justify-between items-center border-b border-white/10 bg-black/90 backdrop-blur-md">
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  {editingRule ? 'Edit Pricing Rule' : 'Create New Pricing Rule'}
                </h2>
                <button
                  onClick={() => { setShowForm(false); setEditingRule(null); }}
                  className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-white/80 hover:text-white"
                >
                  <X size={20} className="sm:size-24" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6 sm:space-y-8 text-white/90">

                {/* Rule Name */}
                <div>
                  <label className="block text-base sm:text-lg font-medium mb-2">
                    Rule Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Evening Discount 10%"
                    className="input-dark w-full text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-base sm:text-lg font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="When and why this rule applies..."
                    className="input-dark w-full resize-none text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
                  />
                </div>

                {/* Product (optional) */}
                <div>
                  <label className="block text-base sm:text-lg font-medium mb-2">Apply to Product (optional)</label>
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="input-dark w-full appearance-none text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
                  >
                    <option value="" className='bg-gray-900'>All Products</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id} className='bg-gray-900'>
                        {p.name} ({p.category || '—'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rule Type */}
                <div>
                  <label className="block text-base sm:text-lg font-medium mb-2">
                    Rule Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="input-dark w-full appearance-none text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
                  >
                    <option value="happy-hour">Happy Hour</option>
                    <option value="weekend">Weekend Pricing</option>
                    <option value="surge">Surge Pricing</option>
                    <option value="low-demand">Low Demand Discount</option>
                    <option value="promo">Promo / Campaign</option>
                    <option value="seasonal">Seasonal Adjustment</option>
                  </select>
                </div>

                {/* Discount & Increase */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base sm:text-lg font-medium mb-2">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleInputChange}
                      className="input-dark w-full text-center text-lg sm:text-xl font-bold py-3 sm:py-4 px-4 sm:px-6"
                    />
                  </div>

                  <div>
                    <label className="block text-base sm:text-lg font-medium mb-2">Increase (%)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      name="increasePercentage"
                      value={formData.increasePercentage}
                      onChange={handleInputChange}
                      className="input-dark w-full text-center text-lg sm:text-xl font-bold py-3 sm:py-4 px-4 sm:px-6"
                    />
                  </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base sm:text-lg font-medium mb-2">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="input-dark w-full py-3 sm:py-4 px-4 sm:px-6"
                    />
                  </div>
                  <div>
                    <label className="block text-base sm:text-lg font-medium mb-2">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="input-dark w-full py-3 sm:py-4 px-4 sm:px-6"
                    />
                  </div>
                </div>

                {/* Days of Week */}
                <div>
                  <label className="block text-base sm:text-lg font-medium mb-2">Apply on these days</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <label key={day} className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.daysOfWeek.includes(day)}
                          onChange={() => handleDaysChange(day)}
                          className="w-5 h-5 sm:w-6 sm:h-6 accent-amber-500 rounded"
                        />
                        <span className="text-sm sm:text-base text-white/80">{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3 sm:gap-4 pt-4">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="text-base sm:text-lg font-medium text-white/80">Rule is active</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-6 pt-8 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="cancel-btn py-4 px-8 sm:px-10 text-base sm:text-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className={`submit-btn py-4 px-8 sm:px-10 flex items-center justify-center gap-3 text-base sm:text-lg ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Saving...
                      </>
                    ) : editingRule ? (
                      'Update Rule'
                    ) : (
                      'Create Rule'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}