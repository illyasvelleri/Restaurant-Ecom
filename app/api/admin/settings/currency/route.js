// // app/api/admin/settings/currency/route.js → FULL API

// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Setting from '@/models/Settings'; // ← CHANGE TO YOUR ACTUAL MODEL NAME

// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// // GET: Get current currency
// export async function GET() {
//   try {
//     await connectDB();
//     const setting = await Setting.findOne().lean();
//     const currency = setting?.restaurant?.currency || 'SAR';
//     return NextResponse.json({ currency });
//   } catch (error) {
//     console.error('GET currency error:', error);
//     return NextResponse.json({ currency: 'SAR' });
//   }
// }

// // POST: Update currency
// export async function POST(request) {
//   try {
//     await connectDB();
//     const { currency } = await request.json();

//     const validCurrencies = ['SAR', 'AED', 'USD', 'EUR', 'INR'];
//     if (!validCurrencies.includes(currency)) {
//       return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
//     }

//     await Setting.findOneAndUpdate(
//       {},
//       { $set: { 'restaurant.currency': currency } },
//       { upsert: true }
//     );

//     return NextResponse.json({ success: true, currency });
//   } catch (error) {
//     console.error('POST currency error:', error);
//     return NextResponse.json({ error: 'Failed to save currency' }, { status: 500 });
//   }
// }



// app/api/admin/settings/currency/route.js → FINAL 2025 (CURRENCY SAVE WORKS)

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Setting from '@/models/Settings'; // ← CORRECT: Setting (not Settings)

export const dynamic = "force-dynamic";

// GET: Get current currency
export async function GET() {
  try {
    await connectDB();
    const setting = await Setting.findOne().lean();
    const currency = setting?.restaurant?.currency || 'SAR';
    return NextResponse.json({ currency });
  } catch (error) {
    console.error('GET currency error:', error);
    return NextResponse.json({ currency: 'SAR' }); // Fallback
  }
}

// POST: Update currency
export async function POST(request) {
  try {
    await connectDB();
    const { currency } = await request.json();

    const validCurrencies = ['SAR', 'AED', 'USD', 'EUR', 'INR'];
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
    }

    await Setting.findOneAndUpdate(
      {},
      { $set: { 'restaurant.currency': currency } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, currency });
  } catch (error) {
    console.error('POST currency error:', error);
    return NextResponse.json({ error: 'Failed to save currency' }, { status: 500 });
  }
}