// // app/api/admin/ai-recommendations/route.js
// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import AIPromptSettings from '@/models/AIPromptSettings';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function GET(req) {
//   try {
//     await connectDB();

//     let settings = await AIPromptSettings.getCurrent();

//     // Auto-create default if no document exists yet
//     if (!settings) {
//       settings = await AIPromptSettings.createDefault("system-admin"); // fallback creator
//     }

//     return NextResponse.json({
//       currentPrompt: settings.currentPrompt || '',
//       isEnabled: settings.isEnabled ?? false,
//       currentVersion: settings.currentVersion || 0,
//       versions: settings.versions?.map(v => ({
//         version: v.version,
//         createdAt: v.createdAt,
//         createdBy: v.createdBy,
//         notes: v.notes,
//         isActive: v.isActive
//       })) || [],
//       performance: settings.performance || {
//         totalRecommendations: 0,
//         totalClicks: 0,
//         totalAddedToCart: 0,
//         totalRevenue: 0
//       },
//       dailyMetrics: settings.dailyMetrics || []
//     });
//   } catch (error) {
//     console.error('GET /api/admin/ai-recommendations error:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     await connectDB();

//     const body = await req.json();
//     const { action, prompt, version, testCart, notes, isEnabled } = body;

//     let settings = await AIPromptSettings.getCurrent();

//     // Auto-create default if not exists
//     if (!settings) {
//       settings = await AIPromptSettings.createDefault("admin"); // or real user from session later
//     }

//     if (action === 'update') {
//       if (!prompt?.trim()) {
//         return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
//       }

//       await settings.addVersion(prompt.trim(), "admin", notes || 'Updated via dashboard');
      
//       return NextResponse.json({
//         success: true,
//         currentVersion: settings.currentVersion,
//         currentPrompt: settings.currentPrompt,
//         versions: settings.versions
//       });
//     }

//     if (action === 'rollback') {
//       if (!version || typeof version !== 'number') {
//         return NextResponse.json({ error: 'Version number required' }, { status: 400 });
//       }

//       await settings.rollbackToVersion(version, "admin");
      
//       return NextResponse.json({
//         success: true,
//         currentVersion: settings.currentVersion,
//         currentPrompt: settings.currentPrompt,
//         versions: settings.versions
//       });
//     }

//     if (action === 'toggle') {
//       settings.isEnabled = !!isEnabled;
//       settings.lastModifiedBy = "admin";
//       settings.lastModifiedAt = new Date();
//       await settings.save();

//       return NextResponse.json({ success: true, isEnabled: settings.isEnabled });
//     }

//     if (action === 'test') {
//       if (!settings.currentPrompt) {
//         return NextResponse.json({ error: 'No active prompt' }, { status: 400 });
//       }

//       try {
//         const completion = await openai.chat.completions.create({
//           model: 'gpt-4o-mini',
//           messages: [
//             { role: 'system', content: settings.currentPrompt },
//             { 
//               role: 'user', 
//               content: testCart 
//                 ? `Current cart: ${JSON.stringify(testCart, null, 2)}\nSuggest 3-5 relevant cross-sell/upsell items.` 
//                 : 'Suggest 3-5 cross-sell/upsell items for an empty cart (general suggestions).'
//             }
//           ],
//           temperature: 0.7,
//           max_tokens: 800
//         });

//         const response = completion.choices[0].message.content.trim();
//         let recommendations = [];

//         try {
//           recommendations = JSON.parse(response);
//           if (!Array.isArray(recommendations)) recommendations = [];
//         } catch (parseErr) {
//           // Fallback if not valid JSON
//           recommendations = [{ name: "Sample Recommendation", price: "0", reason: response }];
//         }

//         return NextResponse.json({
//           success: true,
//           recommendations,
//           rawResponse: response,
//           tokensUsed: completion.usage?.total_tokens || 0
//         });
//       } catch (err) {
//         console.error('AI test error:', err);
//         return NextResponse.json({ error: 'AI test failed' }, { status: 500 });
//       }
//     }

//     return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

//   } catch (error) {
//     console.error('POST /api/admin/ai-recommendations error:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
// app/api/admin/ai-recommendations/route.js
// UPDATED: includes restaurant timezone from PublicSetting (no lines removed)

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AIPromptSettings from '@/models/AIPromptSettings';
import PublicSetting from '@/models/PublicSetting'; // ← NEW: to expose restaurant timezone to admin
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req) {
  try {
    await connectDB();

    let settings = await AIPromptSettings.getCurrent();

    // Auto-create default if no document exists yet
    if (!settings) {
      settings = await AIPromptSettings.createDefault("system-admin"); // fallback creator
    }

    // ── NEW: Fetch restaurant timezone (for admin to use in prompt context) ──
    let restaurantTimezone = "Asia/Riyadh"; // fallback
    try {
      const pubSettings = await PublicSetting.findOne({}).lean();
      if (pubSettings?.timezone) {
        restaurantTimezone = pubSettings.timezone;
      }
    } catch (err) {
      console.warn("Failed to load restaurant timezone:", err.message);
    }
    // ------------------------------------------------------------------------------------

    return NextResponse.json({
      currentPrompt: settings.currentPrompt || '',
      isEnabled: settings.isEnabled ?? false,
      currentVersion: settings.currentVersion || 0,
      versions: settings.versions?.map(v => ({
        version: v.version,
        createdAt: v.createdAt,
        createdBy: v.createdBy,
        notes: v.notes,
        isActive: v.isActive
      })) || [],
      performance: settings.performance || {
        totalRecommendations: 0,
        totalClicks: 0,
        totalAddedToCart: 0,
        totalRevenue: 0
      },
      dailyMetrics: settings.dailyMetrics || [],
      restaurantTimezone // ← NEW: expose so admin can write timezone-aware prompts
    });
  } catch (error) {
    console.error('GET /api/admin/ai-recommendations error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { action, prompt, version, testCart, notes, isEnabled } = body;

    let settings = await AIPromptSettings.getCurrent();

    // Auto-create default if not exists
    if (!settings) {
      settings = await AIPromptSettings.createDefault("admin"); // or real user from session later
    }

    if (action === 'update') {
      if (!prompt?.trim()) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
      }

      await settings.addVersion(prompt.trim(), "admin", notes || 'Updated via dashboard');
      
      return NextResponse.json({
        success: true,
        currentVersion: settings.currentVersion,
        currentPrompt: settings.currentPrompt,
        versions: settings.versions
      });
    }

    if (action === 'rollback') {
      if (!version || typeof version !== 'number') {
        return NextResponse.json({ error: 'Version number required' }, { status: 400 });
      }

      await settings.rollbackToVersion(version, "admin");
      
      return NextResponse.json({
        success: true,
        currentVersion: settings.currentVersion,
        currentPrompt: settings.currentPrompt,
        versions: settings.versions
      });
    }

    if (action === 'toggle') {
      settings.isEnabled = !!isEnabled;
      settings.lastModifiedBy = "admin";
      settings.lastModifiedAt = new Date();
      await settings.save();

      return NextResponse.json({ success: true, isEnabled: settings.isEnabled });
    }

    if (action === 'test') {
      if (!settings.currentPrompt) {
        return NextResponse.json({ error: 'No active prompt' }, { status: 400 });
      }

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: settings.currentPrompt },
            { 
              role: 'user', 
              content: testCart 
                ? `Current cart: ${JSON.stringify(testCart, null, 2)}\nSuggest 3-5 relevant cross-sell/upsell items.` 
                : 'Suggest 3-5 cross-sell/upsell items for an empty cart (general suggestions).'
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        });

        const response = completion.choices[0].message.content.trim();
        let recommendations = [];

        try {
          recommendations = JSON.parse(response);
          if (!Array.isArray(recommendations)) recommendations = [];
        } catch (parseErr) {
          // Fallback if not valid JSON
          recommendations = [{ name: "Sample Recommendation", price: "0", reason: response }];
        }

        return NextResponse.json({
          success: true,
          recommendations,
          rawResponse: response,
          tokensUsed: completion.usage?.total_tokens || 0
        });
      } catch (err) {
        console.error('AI test error:', err);
        return NextResponse.json({ error: 'AI test failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('POST /api/admin/ai-recommendations error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}