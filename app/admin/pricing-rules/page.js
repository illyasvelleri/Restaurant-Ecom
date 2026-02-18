// // // app/admin/pricing-rules/page.js
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, Edit, Trash2, Loader2, X } from 'lucide-react';

export default function PricingRulesPage() {
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

    // Ensure numeric fields are numbers
    if (['discountPercentage', 'increasePercentage', 'priority'].includes(name)) {
      finalValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
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
    if (formData.discountPercentage > 0 && formData.increasePercentage > 0)
      return toast.error('Cannot apply both discount and increase');

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

    console.log('=== SUBMITTING PAYLOAD ===', JSON.stringify(payload, null, 2));

    try {
      const method = editingRule ? 'PUT' : 'POST';
      const url = editingRule ? `/api/pricing-rules/${editingRule._id}` : '/api/pricing-rules';

      console.log('METHOD:', method, 'URL:', url, 'EDITING RULE ID:', editingRule?._id);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('SERVER RESPONSE:', res.status, data);

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
    console.log('EDIT RULE:', rule);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Pricing Rules</h1>
          <button
            onClick={() => {
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
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <PlusCircle size={18} />
            Create New Rule
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600" />
            <p className="mt-4 text-gray-600">Loading pricing rules...</p>
          </div>
        ) : rules.length === 0 ? (
          <div className="bg-white rounded-xl shadow border p-12 text-center text-gray-500">
            No pricing rules created yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rules.map(rule => (
              <div key={rule._id} className="bg-white rounded-xl shadow border p-6 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{rule.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rule.description || 'No description'}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${rule.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {rule.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Product:</strong> {rule.productId?.name || 'All Products'}</p>
                  <p><strong>Type:</strong> {rule.type.replace('-', ' ')}</p>
                  {rule.discountPercentage > 0 && <p><strong>Discount:</strong> {rule.discountPercentage}%</p>}
                  {rule.increasePercentage > 0 && <p><strong>Increase:</strong> {rule.increasePercentage}%</p>}
                  {rule.startTime && rule.endTime && <p><strong>Time:</strong> {rule.startTime} – {rule.endTime}</p>}
                  {rule.daysOfWeek?.length > 0 && <p><strong>Days:</strong> {rule.daysOfWeek.join(', ')}</p>}
                  <p><strong>Priority:</strong> {rule.priority}</p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => handleEdit(rule)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(rule._id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingRule ? 'Edit Pricing Rule' : 'Create New Pricing Rule'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingRule(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rule Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Evening Discount 10%"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="When and why this rule applies..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apply to Product (optional)
                  </label>
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Products</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.category || '—'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rule Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="happy-hour">Happy Hour</option>
                    <option value="weekend">Weekend Pricing</option>
                    <option value="surge">Surge Pricing</option>
                    <option value="low-demand">Low Demand Discount</option>
                    <option value="promo">Promo / Campaign</option>
                    <option value="seasonal">Seasonal Adjustment</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Increase (%)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      name="increasePercentage"
                      value={formData.increasePercentage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apply on these days</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <label key={day} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.daysOfWeek.includes(day)}
                          onChange={() => handleDaysChange(day)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">
                    Rule is active
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-6 py-3 rounded-xl text-white flex items-center gap-2 font-medium transition ${
                      saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
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
    </div>
  );
}




















// // app/pricing-rules/page.js — FIXED: full error visibility + debug logs
// 'use client';

// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { PlusCircle, Edit, Trash2, Loader2, X } from 'lucide-react';

// export default function PricingRulesPage() {
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
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
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

//     // Client-side validation
//     if (!formData.name.trim()) {
//       return toast.error('Rule name is required');
//     }
//     if (!formData.type) {
//       return toast.error('Rule type is required');
//     }
//     if (formData.discountPercentage > 0 && formData.increasePercentage > 0) {
//       return toast.error('Cannot apply both discount and increase');
//     }

//     setSaving(true);

//     const payload = {
//       name: formData.name.trim(),
//       description: formData.description.trim() || undefined,
//       productId: formData.productId || undefined,
//       type: formData.type,
//       discountPercentage: Number(formData.discountPercentage) || 0,
//       increasePercentage: Number(formData.increasePercentage) || 0,
//       startTime: formData.startTime || undefined,
//       endTime: formData.endTime || undefined,
//       daysOfWeek: formData.daysOfWeek,
//       active: formData.active,
//       priority: Number(formData.priority) || 0,
//     };

//     console.log('=== SUBMITTING PAYLOAD ===', JSON.stringify(payload, null, 2));

//     try {
//       const method = editingRule ? 'PUT' : 'POST';
//       const url = editingRule ? `/api/pricing-rules/${editingRule._id}` : '/api/pricing-rules';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       console.log('SERVER RESPONSE:', res.status, data);

//       if (!res.ok) {
//         throw new Error(data.error || data.message || 'Failed to save rule');
//       }

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
//     setEditingRule(rule);
//     setFormData({
//       name: rule.name || '',
//       description: rule.description || '',
//       productId: rule.productId || '',
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

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Dynamic Pricing Rules</h1>
//           <button
//             onClick={() => {
//               setEditingRule(null);
//               setFormData({
//                 name: '',
//                 description: '',
//                 productId: '',
//                 type: 'happy-hour',
//                 discountPercentage: 0,
//                 increasePercentage: 0,
//                 startTime: '',
//                 endTime: '',
//                 daysOfWeek: [],
//                 active: true,
//                 priority: 0,
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
//                 <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
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
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Apply to Product (optional)
//                   </label>
//                   <select
//                     name="productId"
//                     value={formData.productId}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Products</option>
//                     {products.map(p => (
//                       <option key={p._id} value={p._id}>
//                         {p.name} ({p.category || '—'})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Rule Type <span className="text-red-500">*</span>
//                   </label>
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
//                     <input
//                       type="time"
//                       name="startTime"
//                       value={formData.startTime}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                     <input
//                       type="time"
//                       name="endTime"
//                       value={formData.endTime}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
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
//                   <label htmlFor="active" className="text-sm font-medium text-gray-700">
//                     Rule is active
//                   </label>
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
//                     type="submit"
//                     disabled={saving}
//                     className={`px-6 py-3 rounded-xl text-white flex items-center gap-2 font-medium transition ${
//                       saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//                     }`}
//                   >
//                     {saving ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Saving...
//                       </>
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