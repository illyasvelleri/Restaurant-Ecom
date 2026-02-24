// // app/admin/users/[id]/edit/page.js → Edit existing user

// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';

// export default function EditUserPage() {
//     const { id } = useParams();
//     const router = useRouter();

//     const [formData, setFormData] = useState({
//         username: '',
//         name: '',
//         whatsapp: '',
//         email: '',
//         role: '',
//         assignedBranches: '',
//         isActive: true,
//     });

//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         if (id) fetchUser();
//     }, [id]);

//     const fetchUser = async () => {
//         try {
//             setLoading(true);
//             const res = await fetch(`/api/admin/users/${id}`);
//             if (!res.ok) throw new Error('Failed to load user');
//             const data = await res.json();
//             setFormData({
//                 username: data.username || '',
//                 name: data.name || '',
//                 whatsapp: data.whatsapp || '',
//                 email: data.email || '',
//                 role: data.role || 'staff',
//                 assignedBranches: data.assignedBranches?.join(', ') || '',
//                 isActive: data.isActive ?? true,
//             });
//         } catch (err) {
//             setError(err.message);
//             toast.error('Could not load user data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (submitting) return;

//         setSubmitting(true);
//         setError('');

//         try {
//             const res = await fetch(`/api/admin/users/${id}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     ...formData,
//                     assignedBranches: formData.assignedBranches
//                         ? formData.assignedBranches.split(',').map(id => id.trim())
//                         : [],
//                 }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.error || 'Failed to update user');
//             }

//             toast.success('User updated successfully!');
//             router.push('/admin/users');
//         } catch (err) {
//             setError(err.message);
//             toast.error(err.message || 'Failed to update user');
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-gray-600">Loading user data...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-10 px-4">
//             <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-8">
//                 <h1 className="text-3xl font-bold mb-2 text-gray-900">
//                     Edit User
//                 </h1>
//                 <p className="text-gray-600 mb-8">
//                     Update staff, manager or admin details
//                 </p>

//                 {error && (
//                     <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Username
//                             </label>
//                             <input
//                                 name="username"
//                                 value={formData.username}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                                 disabled
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Full Name
//                             </label>
//                             <input
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                 placeholder="e.g. Khalid Al-Mansoori"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 WhatsApp
//                             </label>
//                             <input
//                                 name="whatsapp"
//                                 value={formData.whatsapp}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                 placeholder="971501234567"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Email
//                             </label>
//                             <input
//                                 name="email"
//                                 type="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                 placeholder="khalid@restaurant.ae"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Role
//                             </label>
//                             <select
//                                 name="role"
//                                 value={formData.role}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
//                             >
//                                 <option value="user">Customer (Normal User)</option>
//                                 <option value="waiter">Waiter</option>
//                                 <option value="cashier">Cashier</option>
//                                 <option value="staff">General Staff</option>
//                                 <option value="kitchen">Kitchen Staff / Chef</option>
//                                 <option value="kitchen_manager">Kitchen Manager</option>
//                                 <option value="delivery_boy">Delivery Boy / Rider</option>
//                                 <option value="manager">Branch Manager</option>
//                                 <option value="admin">Admin</option>
//                                 <option value="superadmin">Super Admin</option>
//                             </select>
//                         </div>

//                         <div className="md:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Assigned Branches (comma-separated IDs)
//                             </label>
//                             <input
//                                 name="assignedBranches"
//                                 value={formData.assignedBranches}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                 placeholder="699351a385a5f25af130dc7b, another-id-here"
//                             />
//                         </div>

//                         <div className="flex items-center">
//                             <label className="flex items-center gap-3 cursor-pointer">
//                                 <input
//                                     type="checkbox"
//                                     name="isActive"
//                                     checked={formData.isActive}
//                                     onChange={handleChange}
//                                     className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                 />
//                                 <span className="text-gray-700 font-medium">User is Active</span>
//                             </label>
//                         </div>
//                     </div>

//                     <div className="mt-10 flex flex-col sm:flex-row gap-4">
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition ${submitting
//                                     ? 'bg-blue-400 cursor-not-allowed'
//                                     : 'bg-blue-600 hover:bg-blue-700'
//                                 }`}
//                         >
//                             {submitting ? 'Updating...' : 'Update User'}
//                         </button>

//                         <button
//                             type="button"
//                             onClick={() => router.back()}
//                             className="flex-1 py-4 px-6 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }
// app/admin/users/[id]/edit/page.js → PREMIUM DARK REDESIGN (matching admin suite)
// Inter font | Dark glass theme | Glows/Hovers | ALL ORIGINAL LOGIC PRESERVED

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ChevronDown  } from 'lucide-react';

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    whatsapp: '',
    email: '',
    role: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) throw new Error('Failed to load user');
      const data = await res.json();
      setFormData({
        username: data.username || '',
        name: data.name || '',
        whatsapp: data.whatsapp || '',
        email: data.email || '',
        role: data.role || 'staff',
        isActive: data.isActive ?? true,
      });
    } catch (err) {
      setError(err.message);
      toast.error('Could not load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      toast.success('User updated successfully!');
      router.push('/admin/users');
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080b10]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes dbUp { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

        .edit-user-page {
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          background: #080b10;
          color: #fff;
          padding: 40px 20px;
        }

        .form-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: dbUp 0.5s ease both;
          max-width: 700px;
          margin: 0 auto;
        }

        .input-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 14px 16px;
          color: #fff;
          font-size: 15px;
          transition: all 0.2s;
        }

        .input-field:focus {
          outline: none;
          border-color: rgba(245,158,11,0.5);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
        }

        .input-field:disabled {
          background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.4);
          cursor: not-allowed;
        }

        .input-field::placeholder { color: rgba(255,255,255,0.3); }

        .select-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          border-radius: 14px;
          padding: 14px 40px 14px 16px;
          appearance: none;
          font-size: 15px;
        }

        .select-field option {
          background: #0a0e16;
          color: #fff;
        }

        .submit-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 14px;
          font-weight: 600;
          transition: all 0.25s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(59,130,246,0.35);
        }

        .cancel-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          padding: 16px;
          border-radius: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: rgba(255,255,255,0.12);
        }

        .error-box {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #ef4444;
          padding: 16px 20px;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .label-text {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          margin-bottom: 8px;
          display: block;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #374151;
          transition: .4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #10b981;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }
      `}</style>

      <div className="edit-user-page">
        <div className="form-card">
          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: 600,
            marginBottom: 8,
            letterSpacing: '-0.02em'
          }}>
            Edit User
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
            Update staff, manager or admin details
          </p>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-text">Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field w-full"
                  disabled
                />
              </div>

              <div>
                <label className="label-text">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="e.g. Khalid Al-Mansoori"
                />
              </div>

              <div>
                <label className="label-text">WhatsApp</label>
                <input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="971501234567"
                />
              </div>

              <div>
                <label className="label-text">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="khalid@restaurant.ae"
                />
              </div>

              <div>
                <label className="label-text">Role</label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="select-field w-full"
                  >
                    <option value="user">Customer (Normal User)</option>
                    <option value="waiter">Waiter</option>
                    <option value="cashier">Cashier</option>
                    <option value="staff">General Staff</option>
                    <option value="kitchen">Kitchen Staff / Chef</option>
                    <option value="kitchen_manager">Kitchen Manager</option>
                    <option value="delivery_boy">Delivery Boy / Rider</option>
                    <option value="manager">Branch Manager</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
                <span className="text-white/80 font-medium">User is Active</span>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition shadow-lg ${submitting
                  ? 'bg-blue-700 cursor-not-allowed opacity-70'
                  : 'submit-btn'
                }`}
              >
                {submitting ? 'Updating...' : 'Update User'}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="cancel-btn flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}