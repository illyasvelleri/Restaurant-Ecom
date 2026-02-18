// app/admin/users/page.js → List of all users (customers + staff + managers)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/admin/users/new')}
                            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-sm"
                        >
                            <Plus size={20} />
                            Add New User
                        </button>
                        <button
                            onClick={fetchUsers}
                            disabled={loading}
                            className="px-5 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                            Refresh List
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, username, whatsapp, email..."
                        className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
                        {error}
                    </div>
                )}

                {/* Users Table */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        {search ? 'No matching users found' : 'No users yet'}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name / Username</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Branches</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{user.name || user.username}</div>
                                                <div className="text-sm text-gray-500">@{user.username}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {user.whatsapp && <div>WA: {user.whatsapp}</div>}
                                                {user.email && <div>Email: {user.email}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${user.role === 'user' ? 'bg-gray-100 text-gray-800' :
                                                        user.role.includes('manager') ? 'bg-blue-100 text-blue-800' :
                                                            user.role === 'admin' || user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-green-100 text-green-800'
                                                    }`}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {user.assignedBranches?.length > 0 ? user.assignedBranches.length : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button
                                                    onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                                                    className="text-blue-600 hover:text-blue-900 transition"
                                                >
                                                    <Edit2 size={18} className="inline" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 size={18} className="inline" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}