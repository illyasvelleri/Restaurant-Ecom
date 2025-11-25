// app/api/admin/settings/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Setting from '@/models/Settings';

// Connect DB once
await connectDB();

export async function GET() {
  try {
    const settings = await Setting.findOne({}) || {};
    return NextResponse.json({
      profile: settings.profile || {},
      restaurant: settings.restaurant || {},
      notifications: settings.notifications || {},
      delivery: settings.delivery || {}
    });
  } catch (error) {
    console.error('GET settings error:', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    const updated = await Setting.findOneAndUpdate(
      {}, // find the only document (or create if not exists)
      {
        $set: {
          profile: body.profile,
          restaurant: body.restaurant,
          notifications: body.notifications,
          delivery: body.delivery,
        }
      },
      { 
        upsert: true,     // create if doesn't exist
        new: true,        // return updated document
        setDefaultsOnInsert: true
      }
    );

    return NextResponse.json({ 
      message: 'Settings saved successfully',
      data: updated 
    });

  } catch (error) {
    console.error('PUT settings error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}