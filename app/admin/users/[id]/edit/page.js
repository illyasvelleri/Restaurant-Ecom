// app/admin/users/[id]/edit/page.js → Edit existing user

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditUserPage() {
    const { id } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        whatsapp: '',
        email: '',
        role: '',
        assignedBranches: '',
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
                assignedBranches: data.assignedBranches?.join(', ') || '',
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
                    assignedBranches: formData.assignedBranches
                        ? formData.assignedBranches.split(',').map(id => id.trim())
                        : [],
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">
                    Edit User
                </h1>
                <p className="text-gray-600 mb-8">
                    Update staff, manager or admin details
                </p>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="e.g. Khalid Al-Mansoori"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                WhatsApp
                            </label>
                            <input
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="971501234567"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="khalid@restaurant.ae"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
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
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assigned Branches (comma-separated IDs)
                            </label>
                            <input
                                name="assignedBranches"
                                value={formData.assignedBranches}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="699351a385a5f25af130dc7b, another-id-here"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-700 font-medium">User is Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition ${submitting
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {submitting ? 'Updating...' : 'Update User'}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-4 px-6 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}