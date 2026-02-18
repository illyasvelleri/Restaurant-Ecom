// app/api/users/route.js → Simple GET list of users (for manager dropdown)

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // Return only safe fields – no password!
    const users = await User.find({})
      .select('name email whatsapp role isActive')
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('GET /users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}