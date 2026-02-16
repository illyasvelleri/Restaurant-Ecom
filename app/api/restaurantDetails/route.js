// // app/api/admin/settings/route.js

// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Setting from '@/models/Settings';

// // ❌ REMOVE: await connectDB();  ← Causes Vercel build error
// // ❌ Do NOT run code at module level in Next.js server functions

// // ----------------------------
// // GET SETTINGS
// // ----------------------------

// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// export async function GET() {
//   try {
//     await connectDB(); // ✅ Safe

//     const settings = await Setting.findOne({}) || {};

//     return NextResponse.json({
//       profile: settings.profile || {},
//       restaurant: settings.restaurant || {},
//       notifications: settings.notifications || {},
//       delivery: settings.delivery || {}
//     });
//   } catch (error) {
//     console.error('GET settings error:', error);
//     return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
//   }
// }

// // ----------------------------
// // UPDATE SETTINGS
// // ----------------------------
// export async function PUT(request) {
//   try {
//     await connectDB(); // ✅ Safe

//     const body = await request.json();

//     const updated = await Setting.findOneAndUpdate(
//       {}, // Only document
//       {
//         $set: {
//           profile: body.profile,
//           restaurant: body.restaurant,
//           notifications: body.notifications,
//           delivery: body.delivery,
//         }
//       },
//       { 
//         upsert: true,
//         new: true,
//         setDefaultsOnInsert: true
//       }
//     );

//     return NextResponse.json({ 
//       message: 'Settings saved successfully',
//       data: updated 
//     });

//   } catch (error) {
//     console.error('PUT settings error:', error);
//     return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
//   }
// }



// app/api/restaurantDetails/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PublicSetting from '@/models/PublicSetting';

export const dynamic = 'force-dynamic';     // or change to 60s revalidate if you prefer
export const revalidate = 30;               // ← good compromise (30 seconds)
export const fetchCache = 'default-cache';

export async function GET() {
  try {
    await connectDB();
    const data = await PublicSetting.findOne({}).lean() || {};
    
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({}, { status: 500 });
  }
}