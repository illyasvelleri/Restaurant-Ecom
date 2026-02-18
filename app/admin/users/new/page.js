// app/admin/users/new/page.js → FIXED: Removed Authorization header (for testing)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewUserPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        whatsapp: '',
        email: '',
        role: 'manager',
        assignedBranches: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // NO Authorization header → removed for now
                    // When you add middleware protection, the middleware will handle it automatically
                },
                body: JSON.stringify({
                    ...formData,
                    assignedBranches: formData.assignedBranches
                        ? formData.assignedBranches.split(',').map(id => id.trim())
                        : [],
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create user');
            }

            toast.success(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} created successfully!`);
            router.push('/admin/users'); // redirect to user list (create this page later if needed)
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">
                    Create New Staff / Manager
                </h1>
                <p className="text-gray-600 mb-8">
                    Add branch managers, kitchen staff, or admins
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
                                Username *
                            </label>
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="e.g. khalid_manager"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Strong password (min 8 chars)"
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
                                WhatsApp (Primary)
                            </label>
                            <input
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="971501234567 (digits only)"
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
                                Role *
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                            >
                                <option value="waiter">Waiter / Server</option>
                                <option value="cashier">Cashier / POS Operator</option>
                                <option value="staff">General Staff</option>

                                <option value="kitchen">Kitchen Staff / Chef</option>
                                <option value="kitchen_manager">Kitchen Manager</option>

                                <option value="delivery_boy">Delivery Rider</option>

                                <option value="manager">Branch Manager</option>
                                <option value="admin">Admin (Regional)</option>
                                <option value="superadmin">Super Admin (System Owner)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assigned Branches (comma-separated branch IDs)
                            </label>
                            <input
                                name="assignedBranches"
                                value={formData.assignedBranches}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="699351a385a5f25af130dc7b, another-id-here"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Leave empty if not assigned to any branch yet
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition shadow-sm ${submitting
                                    ? 'bg-green-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                                }`}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    Creating...
                                </span>
                            ) : (
                                'Create User'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-4 px-6 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 active:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}