// // app/admin/users/page.js → List of all users (customers + staff + managers)

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import { Plus, Edit2, Trash2 } from 'lucide-react';

// export default function UsersPage() {
//     const router = useRouter();

//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [search, setSearch] = useState('');

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             setLoading(true);
//             setError('');

//             const res = await fetch('/api/admin/users');
//             if (!res.ok) {
//                 throw new Error(`Failed to fetch users (${res.status})`);
//             }
//             const data = await res.json();
//             setUsers(data.users || []);
//         } catch (err) {
//             console.error('fetchUsers error:', err);
//             setError(err.message || 'Failed to load users');
//             toast.error('Could not load users');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const filteredUsers = users.filter(u =>
//         (u.name || u.username || '').toLowerCase().includes(search.toLowerCase()) ||
//         (u.whatsapp || '').includes(search) ||
//         (u.email || '').toLowerCase().includes(search.toLowerCase())
//     );

//     const handleDelete = async (id) => {
//         if (!confirm('Are you sure you want to delete this user?')) return;

//         try {
//             const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
//             if (!res.ok) throw new Error('Delete failed');
//             toast.success('User deleted');
//             fetchUsers();
//         } catch (err) {
//             toast.error('Failed to delete user');
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//                     <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
//                     <div className="flex gap-4">
//                         <button
//                             onClick={() => router.push('/admin/users/new')}
//                             className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-sm"
//                         >
//                             <Plus size={20} />
//                             Add New User
//                         </button>
//                         <button
//                             onClick={fetchUsers}
//                             disabled={loading}
//                             className="px-5 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition"
//                         >
//                             Refresh List
//                         </button>
//                     </div>
//                 </div>

//                 {/* Search */}
//                 <div className="mb-6">
//                     <input
//                         type="text"
//                         value={search}
//                         onChange={e => setSearch(e.target.value)}
//                         placeholder="Search by name, username, whatsapp, email..."
//                         className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     />
//                 </div>

//                 {/* Error */}
//                 {error && (
//                     <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
//                         {error}
//                     </div>
//                 )}

//                 {/* Users Table */}
//                 {loading ? (
//                     <div className="text-center py-20">
//                         <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//                         <p className="text-gray-600">Loading users...</p>
//                     </div>
//                 ) : filteredUsers.length === 0 ? (
//                     <div className="text-center py-20 text-gray-500">
//                         {search ? 'No matching users found' : 'No users yet'}
//                     </div>
//                 ) : (
//                     <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name / Username</th>
//                                         <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
//                                         <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                                         <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Branches</th>
//                                         <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                     {filteredUsers.map(user => (
//                                         <tr key={user._id} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4">
//                                                 <div className="font-medium text-gray-900">{user.name || user.username}</div>
//                                                 <div className="text-sm text-gray-500">@{user.username}</div>
//                                             </td>
//                                             <td className="px-6 py-4 text-sm text-gray-600">
//                                                 {user.whatsapp && <div>WA: {user.whatsapp}</div>}
//                                                 {user.email && <div>Email: {user.email}</div>}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${user.role === 'user' ? 'bg-gray-100 text-gray-800' :
//                                                         user.role.includes('manager') ? 'bg-blue-100 text-blue-800' :
//                                                             user.role === 'admin' || user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
//                                                                 'bg-green-100 text-green-800'
//                                                     }`}>
//                                                     {user.role.replace('_', ' ')}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 text-sm text-gray-600">
//                                                 {user.assignedBranches?.length > 0 ? user.assignedBranches.length : '—'}
//                                             </td>
//                                             <td className="px-6 py-4 text-right space-x-3">
//                                                 <button
//                                                     onClick={() => router.push(`/admin/users/${user._id}/edit`)}
//                                                     className="text-blue-600 hover:text-blue-900 transition"
//                                                 >
//                                                     <Edit2 size={18} className="inline" /> Edit
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDelete(user._id)}
//                                                     className="text-red-600 hover:text-red-800"
//                                                 >
//                                                     <Trash2 size={18} className="inline" /> Delete
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
// app/admin/users/page.js → PREMIUM DARK REDESIGN (matching dashboard style)
// Inter font | Dark theme | Glows/Hovers | Skeletons | ALL ORIGINAL LOGIC PRESERVED

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, RefreshCw, Search } from 'lucide-react';

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
// SKELETON ROW
// ─────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div style={{
      height: 68, borderRadius: 16,
      background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
      backgroundSize: "200% 100%",
      animation: "dbShimmer 1.6s ease infinite",
    }} />
  );
}

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        throw new Error(`Failed to fetch users (${res.status})`);
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('fetchUsers error:', err);
      setError(err.message || 'Failed to load users');
      toast.error('Could not load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    (u.name || u.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.whatsapp || '').includes(search) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes dbUp       { from{opacity:0;transform:translateY(18px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes dbPulse    { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(2.4);opacity:0;} }
        @keyframes dbShimmer  { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }

        .usr-page {
          font-family:'Inter', system-ui, sans-serif;
          min-height:100vh;
          background:#080b10;
          color:#fff;
          padding-bottom:80px;
        }

        .usr-topbar {
          position:sticky; top:0; z-index:50;
          background:rgba(8,11,16,0.88);
          backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding:18px 24px;
        }

        .usr-title {
          font-size:clamp(22px,4vw,30px);
          font-weight:500; letter-spacing:-0.02em;
        }

        .usr-search {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px;
          padding:12px 16px 12px 44px;
          color:#fff;
          font-size:14px;
        }

        .usr-search::placeholder { color:rgba(255,255,255,0.3); }

        .usr-add-btn {
          background:linear-gradient(135deg,#10b981,#059669);
          color:white;
          border:none;
          padding:10px 18px;
          border-radius:12px;
          font-weight:500;
          transition:all 0.2s;
        }

        .usr-add-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(16,185,129,0.4); }

        .usr-refresh-btn {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.7);
          padding:10px 16px;
          border-radius:12px;
          transition:all 0.2s;
        }

        .usr-refresh-btn:hover { background:rgba(255,255,255,0.08); color:#fff; }

        .usr-card {
          background:rgba(255,255,255,0.015);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:16px;
          padding:16px 20px;
          transition:all 0.25s ease;
        }

        .usr-card:hover {
          background:rgba(255,255,255,0.04);
          transform:translateY(-3px);
          box-shadow:0 12px 32px rgba(0,0,0,0.4);
        }

        .usr-role-badge {
          padding:4px 12px;
          border-radius:999px;
          font-size:10px;
          font-weight:500;
          letter-spacing:0.08em;
          text-transform:uppercase;
        }

        .usr-empty {
          padding:80px 24px;
          text-align:center;
          color:rgba(255,255,255,0.4);
          font-style:italic;
        }
      `}</style>

      <div className="usr-page">

        {/* ── TOPBAR ── */}
        <div className="usr-topbar">
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PulseDot color="#10b981" size={9} />
              <h1 className="usr-title">Users</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push('/admin/users/new')}
                className="usr-add-btn flex items-center gap-2"
              >
                <Plus size={18} />
                Add User
              </button>

              <button
                onClick={fetchUsers}
                disabled={loading}
                className="usr-refresh-btn flex items-center gap-2"
              >
                <RefreshCw size={16} style={{ animation: loading ? 'dbSpin 1s linear infinite' : 'none' }} />
                Refresh
              </button>
            </div>
          </div>

          {/* Search */}
          <div style={{ maxWidth: 1400, margin: '16px auto 0', position: 'relative' }}>
            <Search size={18} style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.4)'
            }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, username, whatsapp, email..."
              className="usr-search w-full"
            />
          </div>
        </div>

        <div style={{ maxWidth: 1400, margin: '32px auto', padding: '0 20px' }}>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444',
              padding: '16px 20px',
              borderRadius: 16,
              marginBottom: 24
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3,4,5,6].map(i => <SkeletonRow key={i} />)}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="usr-empty">
              {search ? 'No matching users found' : 'No users registered yet'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredUsers.map(user => (
                <div
                  key={user._id}
                  className="usr-card"
                  style={{ animation: 'dbUp 0.45s ease' }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 16,
                    alignItems: 'center'
                  }}>
                    {/* Left - Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 17, fontWeight: 500 }}>
                          {user.name || user.username || '—'}
                        </span>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                          @{user.username || '—'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                        {user.whatsapp && <div>WA: {user.whatsapp}</div>}
                        {user.email && <div>Email: {user.email}</div>}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                        <span className="usr-role-badge" style={{
                          background: user.role === 'user' ? 'rgba(255,255,255,0.06)' :
                                      user.role.includes('manager') ? 'rgba(59,130,246,0.12)' :
                                      user.role === 'admin' || user.role === 'superadmin' ? 'rgba(139,92,246,0.12)' :
                                      'rgba(16,185,129,0.12)',
                          color: user.role === 'user' ? '#fff' :
                                 user.role.includes('manager') ? '#3b82f6' :
                                 user.role === 'admin' || user.role === 'superadmin' ? '#8b5cf6' :
                                 '#10b981',
                          border: `1px solid ${user.role === 'user' ? 'rgba(255,255,255,0.12)' :
                                                user.role.includes('manager') ? 'rgba(59,130,246,0.3)' :
                                                user.role === 'admin' || user.role === 'superadmin' ? 'rgba(139,92,246,0.3)' :
                                                'rgba(16,185,129,0.3)'}`,
                        }}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Right - Actions */}
                    <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                      <button
                        onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-blue-400 hover:text-blue-300"
                        title="Edit User"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-red-400 hover:text-red-300"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}