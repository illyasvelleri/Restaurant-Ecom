


// app/api/admin/settings/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Setting from '@/models/Settings';
import PublicSetting from '@/models/PublicSetting';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    await connectDB();
    const settings = await Setting.findOne({}) || {};
    return NextResponse.json({
      profile: settings.profile || {},
      restaurant: settings.restaurant || {},
      notifications: settings.notifications || {},
      delivery: settings.delivery || {}
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();

    // 1. Update full admin settings
    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 2. Prepare & sync public-safe subset
    const publicData = {
      restaurantName: body?.restaurant?.name || 'My Restaurant',
      restaurantDescription: body?.restaurant?.description || '',
      logo: body?.restaurant?.logo || '',                    // ← add logo field to your admin form if needed
      address: body?.restaurant?.address || '',
      phone: body?.restaurant?.phone || '',
      whatsapp: body?.restaurant?.whatsapp || '',
      email: body?.restaurant?.email || '',
      facebook: body?.restaurant?.facebook || '',           // ← add these social fields to schema & form
      instagram: body?.restaurant?.instagram || '',
      twitter: body?.restaurant?.twitter || '',
      workingHours: body?.restaurant?.workingHours || 'Daily: 11:00 AM – 11:00 PM',
      currency: body?.restaurant?.currency || 'SAR',
    };

    await PublicSetting.findOneAndUpdate(
      {},
      { $set: publicData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      message: 'Settings saved & public data synced',
      data: updatedSetting
    });
  } catch (err) {
    console.error('PUT error:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}