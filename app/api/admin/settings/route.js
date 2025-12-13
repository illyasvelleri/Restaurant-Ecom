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



// app/api/admin/settings/route.js → FINAL 2025 (EDIT WORKS PERFECTLY)

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Setting from '@/models/Settings'; // ← CORRECT MODEL NAME (singular)

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// GET — Load settings
export async function GET() {
  try {
    await connectDB();
    const setting = await Setting.findOne().lean();
    return NextResponse.json(setting || {});
  } catch (error) {
    console.error('GET settings error:', error);
    return NextResponse.json({});
  }
}

// PUT — Update settings (THIS FIXES THE "CANNOT UPDATE" BUG)
// PUT — SUPPORTS BOTH JSON AND FormData
export async function PUT(request) {
  try {
    await connectDB();

    const contentType = request.headers.get('content-type') || '';
    let body = {};

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        body[key] = value;
      }
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }

    const updated = await Setting.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: 'Settings saved successfully!',
      data: updated
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}