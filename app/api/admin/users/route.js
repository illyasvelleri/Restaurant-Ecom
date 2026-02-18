// app/api/admin/users/route.js → FIXED: GET only returns staff/managers/admins (no "user" customers)

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET: List ONLY staff, managers, admins, etc. (exclude normal "user" customers)
export async function GET() {
    try {
        await connectDB();

        const users = await User.find({
            role: { $ne: 'user' }  // ← key: exclude normal customers
        })
            .select('username name email whatsapp role assignedBranches isActive createdAt')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ users });
    } catch (error) {
        console.error('GET /admin/users error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users', details: error.message },
            { status: 500 }
        );
    }
}

// POST: Create new staff/manager/admin user (unchanged – customers use different endpoint)
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const {
            username,
            password,
            name,
            whatsapp,
            email,
            role,
            assignedBranches = [],
        } = body;

        // Required fields
        if (!username?.trim()) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }
        if (!password || password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }
        if (!role) {
            return NextResponse.json({ error: 'Role is required' }, { status: 400 });
        }

        // Validate role (only staff+ roles – customers use /api/auth/register)
        const allowedRoles = [
            'waiter',           // Table service & floor management
            'cashier',          // Point of Sale & payments
            'staff',            // General internal staff
            'kitchen',          // Chefs and line cooks
            'kitchen_manager',  // Head chefs / Kitchen leads
            'delivery_boy',     // Internal delivery riders
            'manager',          // Branch/Store management
            'admin',            // Regional/Company-wide admin
            'superadmin'        // Full system owner
        ];
        if (!allowedRoles.includes(role)) {
            return NextResponse.json(
                { error: `Invalid role. Allowed: ${allowedRoles.join(', ')}` },
                { status: 400 }
            );
        }

        // Clean & validate WhatsApp
        const cleanWhatsapp = whatsapp ? whatsapp.replace(/\D/g, '') : null;
        if (cleanWhatsapp && !/^\d{9,15}$/.test(cleanWhatsapp)) {
            return NextResponse.json({ error: 'WhatsApp must be 9–15 digits only (e.g. 971501234567)' }, { status: 400 });
        }

        // Create user object
        const userData = {
            username: username.trim().toLowerCase(),
            password: await bcrypt.hash(password, 12),
            name: name?.trim() || username.trim(),
            whatsapp: cleanWhatsapp,
            email: email?.trim().toLowerCase() || null,
            role,
            assignedBranches: Array.isArray(assignedBranches) ? assignedBranches : [],
            isActive: true,
        };

        // Create user
        const user = await User.create(userData);

        return NextResponse.json(
            {
                success: true,
                message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
                user: {
                    id: user._id,
                    username: user.username,
                    name: user.name,
                    whatsapp: user.whatsapp,
                    email: user.email,
                    role: user.role,
                    assignedBranches: user.assignedBranches,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Admin user creation error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            let message;

            if (field === 'username') message = `Username "${value}" is already taken`;
            else if (field === 'whatsapp') message = `WhatsApp number "${value}" is already registered`;
            else if (field === 'email') message = `Email "${value}" is already registered`;
            else message = `Duplicate value for ${field}: "${value}"`;

            return NextResponse.json({ error: message }, { status: 400 });
        }

        // Validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({ error: messages.join('; ') }, { status: 400 });
        }

        return NextResponse.json(
            { error: 'Server error – failed to create user', details: error.message },
            { status: 500 }
        );
    }
}