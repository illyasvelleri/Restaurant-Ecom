// app/api/admin/users/[id]/route.js → GET (single), PUT (edit), DELETE (remove)

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET: Fetch single user for edit form
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = params;

        const user = await User.findById(id)
            .select('username name email whatsapp role isActive')
            .lean();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('GET /admin/users/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

// PUT: Update user details
export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const body = await req.json();

        const updateData = {};

        // Safe updates only
        if ('name' in body) updateData.name = body.name?.trim() || undefined;
        if ('whatsapp' in body) {
            const clean = body.whatsapp ? body.whatsapp.replace(/\D/g, '') : null;
            if (clean && !/^\d{9,15}$/.test(clean)) {
                return NextResponse.json({ error: 'Invalid WhatsApp format (9-15 digits)' }, { status: 400 });
            }
            updateData.whatsapp = clean;
        }
        if ('email' in body) updateData.email = body.email?.trim().toLowerCase() || null;
        if ('role' in body) {
            const allowed = [
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
            if (!allowed.includes(body.role)) {
                return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
            }
            updateData.role = body.role;
        }
        if ('isActive' in body) updateData.isActive = !!body.isActive;

        // Optional password change
        if (body.password && body.password.length >= 8) {
            updateData.password = await bcrypt.hash(body.password, 12);
        }

        const updated = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select('username name email whatsapp role isActive');

        if (!updated) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            user: updated,
        });
    } catch (error) {
        console.error('PUT /admin/users/[id] error:', error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return NextResponse.json({ error: `${field} already exists` }, { status: 400 });
        }

        if (error.name === 'ValidationError') {
            const msgs = Object.values(error.errors).map(e => e.message);
            return NextResponse.json({ error: msgs.join('; ') }, { status: 400 });
        }

        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE: Remove user
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id } = params;

        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `User ${deleted.username} deleted`,
        });
    } catch (error) {
        console.error('DELETE /admin/users/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}