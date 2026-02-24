// //app/api/user/ai-recommendations/route.js
// import { NextResponse } from "next/server";

// // This would typically come from your database
// // For now, we'll create a flexible system prompt that can be updated by admin
// const DEFAULT_AI_PROMPT = `You are an expert restaurant recommendation system with deep knowledge of customer behavior, food pairings, and contextual ordering patterns.

// CONTEXT AWARENESS:
// - Analyze time of day (morning, afternoon, evening, late night)
// - Consider day of week (weekday vs weekend patterns)
// - Detect special occasions (Ramadan, holidays, celebrations)
// - Account for weather and seasons when relevant

// RECOMMENDATION STRATEGY:
// 1. COMPLEMENTARY ITEMS (Cross-sell):
//    - Beverages with food (tea with snacks, coffee with desserts)
//    - Side dishes with main courses
//    - Condiments and sauces
//    - Bread with soups or curries

// 2. UPGRADE OPPORTUNITIES (Upsell):
//    - Premium versions of ordered items
//    - Combo deals that include what they ordered
//    - Larger portions or family sizes
//    - Special/seasonal variations

// 3. TIME-BASED PATTERNS:
//    MORNING (5 AM - 11 AM):
//    - Breakfast combos, coffee, fresh juice, pastries
   
//    AFTERNOON (11 AM - 5 PM):
//    - Lunch combos, refreshing drinks, light snacks
   
//    EVENING (5 PM - 9 PM):
//    - Dinner sets, tea with snacks, desserts
//    - ESPECIALLY in Ramadan: Suggest iftar items, dates, traditional drinks
   
//    LATE NIGHT (9 PM - 5 AM):
//    - Light snacks, hot beverages, desserts

// 4. CULTURAL & RELIGIOUS CONTEXT:
//    RAMADAN SPECIFICS:
//    - During Suhoor (pre-dawn): Energy-rich foods, dates, water
//    - During Iftar (evening): Dates, water, soups, traditional dishes
//    - Peak ordering: 30 mins before iftar time
   
//    WEEKEND PATTERNS:
//    - Family sharing meals (suggest larger portions)
//    - Group orders (suggest variety platters)

// 5. CUSTOMER BEHAVIOR ANALYSIS:
//    - If customer previously ordered X with Y, suggest Y
//    - Popular combinations from other customers
//    - Trending items this week/month
//    - Seasonal favorites

// RESPONSE FORMAT:
// Return a JSON array with exactly 4 recommendations. Each must have:
// {
//   "_id": "product_id",
//   "name": "Product Name",
//   "price": "price_as_string",
//   "reason": "Brief, personalized explanation (max 60 chars)",
//   "badge": "TRENDING" | "POPULAR" | "PERFECT PAIR" | "NEW" | null,
//   "type": "upsell" | "cross-sell",
//   "image": "image_url_or_null",
//   "emoji": "relevant_emoji"
// }

// GUIDELINES:
// - Prioritize items NOT already in cart
// - Make reasons personal and contextual
// - Use time/occasion-specific language
// - Balance between safe bets and discoveries
// - Consider price points (don't always suggest expensive items)`;

// export async function POST(request) {
//   try {
//     const { cartItems, allProducts, timeOfDay, dayOfWeek, currency, customerHistory } = await request.json();

//     // Get AI prompt from settings (in production, fetch from database)
//     const aiPrompt = await getAIPromptFromSettings() || DEFAULT_AI_PROMPT;

//     // Prepare context for GPT
//     const currentHour = timeOfDay || new Date().getHours();
//     const currentDay = dayOfWeek !== undefined ? dayOfWeek : new Date().getDay();
//     const isWeekend = currentDay === 0 || currentDay === 6;
//     const isRamadan = checkIfRamadan(); // Helper function to detect Ramadan
    
//     // Time of day classification
//     let timeContext = "evening";
//     if (currentHour >= 5 && currentHour < 11) timeContext = "morning";
//     else if (currentHour >= 11 && currentHour < 17) timeContext = "afternoon";
//     else if (currentHour >= 21 || currentHour < 5) timeContext = "late night";

//     // Build detailed context
//     const cartItemsDescription = cartItems.map(item => 
//       `${item.name} (${item.category || "uncategorized"}, qty: ${item.quantity}, price: ${item.price} ${currency})`
//     ).join(", ");

//     const availableProducts = allProducts
//       .filter(product => !cartItems.some(cartItem => cartItem._id === product._id))
//       .slice(0, 50); // Limit to avoid token limits

//     const productsDescription = availableProducts.map(product =>
//       `ID: ${product._id}, Name: ${product.name}, Category: ${product.category || "N/A"}, Price: ${product.currentPrice || product.price} ${currency}`
//     ).join("\n");

//     // Build GPT prompt
//     const userPrompt = `CURRENT CONTEXT:
// Time: ${timeContext} (${currentHour}:00)
// Day: ${isWeekend ? "Weekend" : "Weekday"}
// Special: ${isRamadan ? "RAMADAN - Consider iftar/suhoor timing and traditions" : "Regular day"}

// CUSTOMER'S CURRENT CART:
// ${cartItemsDescription}

// AVAILABLE PRODUCTS TO RECOMMEND:
// ${productsDescription}

// ${customerHistory ? `CUSTOMER HISTORY:\n${JSON.stringify(customerHistory, null, 2)}` : ""}

// TASK:
// Analyze the cart and context. Suggest exactly 4 products that would:
// 1. Complement what they ordered (beverages, sides, etc.)
// 2. Upgrade their experience (premium versions, combos)
// 3. Match the time of day and occasion
// 4. Consider cultural context (Ramadan, weekend, etc.)

// Return ONLY a valid JSON array with 4 recommendations following the exact format specified in the system prompt.`;

//     // Call OpenAI API
//     const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: "gpt-4o", // or gpt-4o-mini for faster/cheaper responses
//         messages: [
//           { role: "system", content: aiPrompt },
//           { role: "user", content: userPrompt }
//         ],
//         temperature: 0.7,
//         max_tokens: 1000,
//         response_format: { type: "json_object" }
//       })
//     });

//     if (!openaiResponse.ok) {
//       console.error("OpenAI API error:", await openaiResponse.text());
//       // Fallback to rule-based recommendations
//       return NextResponse.json({
//         recommendations: getFallbackRecommendations(cartItems, availableProducts, timeContext, currency)
//       });
//     }

//     const openaiData = await openaiResponse.json();
//     const aiResponse = openaiData.choices[0].message.content;
    
//     let recommendations;
//     try {
//       const parsed = JSON.parse(aiResponse);
//       recommendations = parsed.recommendations || parsed;
      
//       // Ensure we have the right structure
//       if (!Array.isArray(recommendations)) {
//         recommendations = Object.values(parsed);
//       }
      
//       // Enrich with full product data
//       recommendations = recommendations.map(rec => {
//         const fullProduct = availableProducts.find(p => p._id === rec._id || p.name === rec.name);
//         return {
//           ...fullProduct,
//           ...rec,
//           price: rec.price || fullProduct?.currentPrice || fullProduct?.price || "0",
//           image: fullProduct?.image || rec.image,
//           category: fullProduct?.category || rec.category
//         };
//       }).filter(Boolean).slice(0, 4);

//     } catch (parseError) {
//       console.error("Failed to parse AI response:", parseError);
//       recommendations = getFallbackRecommendations(cartItems, availableProducts, timeContext, currency);
//     }

//     return NextResponse.json({ recommendations });

//   } catch (error) {
//     console.error("AI recommendations error:", error);
//     return NextResponse.json(
//       { error: "Failed to generate recommendations", recommendations: [] },
//       { status: 500 }
//     );
//   }
// }

// // Helper: Get AI prompt from settings (implement your own database logic)
// async function getAIPromptFromSettings() {
//   // TODO: Implement database fetch
//   // const settings = await db.settings.findOne({ key: "ai_recommendation_prompt" });
//   // return settings?.value || DEFAULT_AI_PROMPT;
//   return DEFAULT_AI_PROMPT;
// }

// // Helper: Check if currently Ramadan
// function checkIfRamadan() {
//   const now = new Date();
//   const year = now.getFullYear();
  
//   // Ramadan dates for 2025-2026 (approximate - adjust based on moon sighting)
//   const ramadanDates = {
//     2025: { start: new Date(2025, 2, 1), end: new Date(2025, 2, 30) }, // March 1-30, 2025
//     2026: { start: new Date(2026, 1, 18), end: new Date(2026, 2, 19) } // Feb 18 - Mar 19, 2026
//   };
  
//   if (ramadanDates[year]) {
//     return now >= ramadanDates[year].start && now <= ramadanDates[year].end;
//   }
  
//   return false;
// }

// // Fallback rule-based recommendations (when AI fails)
// function getFallbackRecommendations(cartItems, availableProducts, timeContext, currency) {
//   const recommendations = [];
  
//   // Rule 1: If cart has food, suggest beverages
//   const hasFood = cartItems.some(item => 
//     item.category && !item.category.toLowerCase().includes("drink") && !item.category.toLowerCase().includes("beverage")
//   );
  
//   if (hasFood) {
//     const beverages = availableProducts.filter(p => 
//       p.category && (p.category.toLowerCase().includes("drink") || p.category.toLowerCase().includes("beverage"))
//     );
//     if (beverages.length > 0) {
//       recommendations.push({
//         ...beverages[0],
//         reason: "Perfect drink to go with your meal",
//         badge: "PERFECT PAIR",
//         type: "cross-sell",
//         emoji: "🥤"
//       });
//     }
//   }
  
//   // Rule 2: Time-based suggestions
//   if (timeContext === "morning") {
//     const breakfast = availableProducts.filter(p => 
//       p.category && (p.category.toLowerCase().includes("breakfast") || p.name.toLowerCase().includes("coffee"))
//     );
//     if (breakfast.length > 0 && recommendations.length < 4) {
//       recommendations.push({
//         ...breakfast[0],
//         reason: "Great way to start your morning",
//         badge: "MORNING SPECIAL",
//         type: "cross-sell",
//         emoji: "☀️"
//       });
//     }
//   } else if (timeContext === "evening") {
//     const snacks = availableProducts.filter(p => 
//       p.category && (p.category.toLowerCase().includes("snack") || p.category.toLowerCase().includes("tea"))
//     );
//     if (snacks.length > 0 && recommendations.length < 4) {
//       recommendations.push({
//         ...snacks[0],
//         reason: "Popular evening choice",
//         badge: "TRENDING",
//         type: "cross-sell",
//         emoji: "🌙"
//       });
//     }
//   }
  
//   // Rule 3: Add popular items
//   const popular = availableProducts
//     .filter(p => !recommendations.some(r => r._id === p._id))
//     .slice(0, 4 - recommendations.length);
  
//   popular.forEach((product, idx) => {
//     recommendations.push({
//       ...product,
//       reason: "Customers love this!",
//       badge: idx === 0 ? "POPULAR" : null,
//       type: "upsell",
//       emoji: "⭐"
//     });
//   });
  
//   return recommendations.slice(0, 4);
// }


// // app/api/user/ai-recommendations/route.js
// // app/api/user/ai-recommendations/route.js
// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import AIPromptSettings from "@/models/AIPromptSettings";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(request) {
//   try {
//     await connectDB();

//     const { cartItems, allProducts, timeOfDay, dayOfWeek, currency, customerHistory, action, clicked, added, revenue, recommendationId } = await request.json();

//     // ── Handle tracking endpoint ──
//     if (action === 'track') {
//       const settings = await AIPromptSettings.getCurrent();
//       if (settings) {
//         await settings.trackRecommendation(clicked, added, revenue || 0);
//         return NextResponse.json({ success: true });
//       }
//       return NextResponse.json({ success: false }, { status: 404 });
//     }

//     // ── Normal recommendation generation ──
//     // Get AI prompt from DB (admin-controlled)
//     let aiPrompt = `You are an expert restaurant recommendation system. 
// Analyze the current cart items, time of day, day of week, and suggest 3-5 relevant cross-sell or upsell items that complement the order.
// Return only JSON array with objects containing:
// - _id (product ID from database)
// - name
// - price
// - reason (short explanation, max 60 characters)
// - badge (optional: TRENDING, POPULAR, PERFECT PAIR, NEW)
// - type (cross-sell or upsell)

// Focus on items NOT already in cart. Prioritize high-margin, popular, or complementary products.`;

//     const settings = await AIPromptSettings.getCurrent();
//     if (settings?.currentPrompt && settings.isEnabled) {
//       aiPrompt = settings.currentPrompt;
//     }

//     // Prepare context for GPT
//     const currentHour = timeOfDay || new Date().getHours();
//     const currentDay = dayOfWeek !== undefined ? dayOfWeek : new Date().getDay();
//     const isWeekend = currentDay === 0 || currentDay === 6;
//     const isRamadan = checkIfRamadan(); // Helper function to detect Ramadan
    
//     // Time of day classification
//     let timeContext = "evening";
//     if (currentHour >= 5 && currentHour < 11) timeContext = "morning";
//     else if (currentHour >= 11 && currentHour < 17) timeContext = "afternoon";
//     else if (currentHour >= 21 || currentHour < 5) timeContext = "late night";

//     // Build detailed context
//     const cartItemsDescription = cartItems.map(item => 
//       `${item.name} (${item.category || "uncategorized"}, qty: ${item.quantity}, price: ${item.price} ${currency})`
//     ).join(", ");

//     const availableProducts = allProducts
//       .filter(product => !cartItems.some(cartItem => cartItem._id === product._id))
//       .slice(0, 50); // Limit to avoid token limits

//     const productsDescription = availableProducts.map(product =>
//       `ID: ${product._id}, Name: ${product.name}, Category: ${product.category || "N/A"}, Price: ${product.currentPrice || product.price} ${currency}`
//     ).join("\n");

//     // Build GPT prompt
//     const userPrompt = `CURRENT CONTEXT:
// Time: ${timeContext} (${currentHour}:00)
// Day: ${isWeekend ? "Weekend" : "Weekday"}
// Special: ${isRamadan ? "RAMADAN - Consider iftar/suhoor timing and traditions" : "Regular day"}

// CUSTOMER'S CURRENT CART:
// ${cartItemsDescription}

// AVAILABLE PRODUCTS TO RECOMMEND:
// ${productsDescription}

// ${customerHistory ? `CUSTOMER HISTORY:\n${JSON.stringify(customerHistory, null, 2)}` : ""}

// TASK:
// Analyze the cart and context. Suggest exactly 4 products that would:
// 1. Complement what they ordered (beverages, sides, etc.)
// 2. Upgrade their experience (premium versions, combos)
// 3. Match the time of day and occasion
// 4. Consider cultural context (Ramadan, weekend, etc.)

// Return ONLY a valid JSON array with 4 recommendations following the exact format specified in the system prompt.`;

//     // Call OpenAI API
//     const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: "gpt-4o", // or gpt-4o-mini for faster/cheaper responses
//         messages: [
//           { role: "system", content: aiPrompt },
//           { role: "user", content: userPrompt }
//         ],
//         temperature: 0.7,
//         max_tokens: 1000,
//         response_format: { type: "json_object" }
//       })
//     });

//     if (!openaiResponse.ok) {
//       console.error("OpenAI API error:", await openaiResponse.text());
//       // Fallback to rule-based recommendations
//       return NextResponse.json({
//         recommendations: getFallbackRecommendations(cartItems, availableProducts, timeContext, currency)
//       });
//     }

//     const openaiData = await openaiResponse.json();
//     const aiResponse = openaiData.choices[0].message.content;
    
//     let recommendations;
//     try {
//       const parsed = JSON.parse(aiResponse);
//       recommendations = parsed.recommendations || parsed;
      
//       // Ensure we have the right structure
//       if (!Array.isArray(recommendations)) {
//         recommendations = Object.values(parsed);
//       }
      
//       // Enrich with full product data
//       recommendations = recommendations.map(rec => {
//         const fullProduct = availableProducts.find(p => p._id === rec._id || p.name === rec.name);
//         return {
//           ...fullProduct,
//           ...rec,
//           price: rec.price || fullProduct?.currentPrice || fullProduct?.price || "0",
//           image: fullProduct?.image || rec.image,
//           category: fullProduct?.category || rec.category
//         };
//       }).filter(Boolean).slice(0, 4);

//     } catch (parseError) {
//       console.error("Failed to parse AI response:", parseError);
//       recommendations = getFallbackRecommendations(cartItems, availableProducts, timeContext, currency);
//     }

//     return NextResponse.json({ recommendations });

//   } catch (error) {
//     console.error("AI recommendations error:", error);
//     return NextResponse.json(
//       { error: "Failed to generate recommendations", recommendations: [] },
//       { status: 500 }
//     );
//   }
// }

// // ── NEW: Tracking endpoint (call this from frontend when user clicks/adds rec) ──
// export async function PATCH(request) {
//   try {
//     await connectDB();

//     const { clicked = false, added = false, revenue = 0 } = await request.json();

//     const settings = await AIPromptSettings.getCurrent();
//     if (settings) {
//       await settings.trackRecommendation(clicked, added, revenue);
//       return NextResponse.json({ success: true });
//     }

//     return NextResponse.json({ success: false }, { status: 404 });
//   } catch (error) {
//     console.error("Tracking error:", error);
//     return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
//   }
// }

// // Helper: Check if currently Ramadan (unchanged)
// function checkIfRamadan() {
//   const now = new Date();
//   const year = now.getFullYear();
  
//   // Ramadan dates for 2025-2026 (approximate - adjust based on moon sighting)
//   const ramadanDates = {
//     2025: { start: new Date(2025, 2, 1), end: new Date(2025, 2, 30) }, // March 1-30, 2025
//     2026: { start: new Date(2026, 1, 18), end: new Date(2026, 2, 19) } // Feb 18 - Mar 19, 2026
//   };
  
//   if (ramadanDates[year]) {
//     return now >= ramadanDates[year].start && now <= ramadanDates[year].end;
//   }
  
//   return false;
// }

// // Fallback rule-based recommendations (when AI fails) – unchanged
// function getFallbackRecommendations(cartItems, availableProducts, timeContext, currency) {
//   const recommendations = [];
  
//   // Rule 1: If cart has food, suggest beverages
//   const hasFood = cartItems.some(item => 
//     item.category && !item.category.toLowerCase().includes("drink") && !item.category.toLowerCase().includes("beverage")
//   );
  
//   if (hasFood) {
//     const beverages = availableProducts.filter(p => 
//       p.category && (p.category.toLowerCase().includes("drink") || p.category.toLowerCase().includes("beverage"))
//     );
//     if (beverages.length > 0) {
//       recommendations.push({
//         ...beverages[0],
//         reason: "Perfect drink to go with your meal",
//         badge: "PERFECT PAIR",
//         type: "cross-sell",
//         emoji: "🥤"
//       });
//     }
//   }
  
//   // Rule 2: Time-based suggestions
//   if (timeContext === "morning") {
//     const breakfast = availableProducts.filter(p => 
//       p.category && (p.category.toLowerCase().includes("breakfast") || p.name.toLowerCase().includes("coffee"))
//     );
//     if (breakfast.length > 0 && recommendations.length < 4) {
//       recommendations.push({
//         ...breakfast[0],
//         reason: "Great way to start your morning",
//         badge: "MORNING SPECIAL",
//         type: "cross-sell",
//         emoji: "☀️"
//       });
//     }
//   } else if (timeContext === "evening") {
//     const snacks = availableProducts.filter(p => 
//       p.category && (p.category.toLowerCase().includes("snack") || p.category.toLowerCase().includes("tea"))
//     );
//     if (snacks.length > 0 && recommendations.length < 4) {
//       recommendations.push({
//         ...snacks[0],
//         reason: "Popular evening choice",
//         badge: "TRENDING",
//         type: "cross-sell",
//         emoji: "🌙"
//       });
//     }
//   }
  
//   // Rule 3: Add popular items
//   const popular = availableProducts
//     .filter(p => !recommendations.some(r => r._id === p._id))
//     .slice(0, 4 - recommendations.length);
  
//   popular.forEach((product, idx) => {
//     recommendations.push({
//       ...product,
//       reason: "Customers love this!",
//       badge: idx === 0 ? "POPULAR" : null,
//       type: "upsell",
//       emoji: "⭐"
//     });
//   });
  
//   return recommendations.slice(0, 4);
// }


// app/api/user/ai-recommendations/route.js — UPDATED: uses restaurant timezone from PublicSetting DB
// ALL ORIGINAL LOGIC PRESERVED + TIMEZONE-AWARE TIME CONTEXT

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AIPromptSettings from "@/models/AIPromptSettings";
import PublicSetting from "@/models/PublicSetting"; // ← NEW: to get trusted restaurant timezone
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    await connectDB();

    const { cartItems, allProducts, timeOfDay, dayOfWeek, currency, customerHistory, action, clicked, added, revenue, recommendationId } = await request.json();

    // ── Handle tracking endpoint ──
    if (action === 'track') {
      const settings = await AIPromptSettings.getCurrent();
      if (settings) {
        await settings.trackRecommendation(clicked, added, revenue || 0);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ success: false }, { status: 404 });
    }

    // ── NEW: Fetch trusted restaurant timezone from PublicSetting (admin-controlled) ──
    let restaurantTimezone = "Asia/Riyadh"; // fallback
    try {
      const settings = await PublicSetting.findOne({}).lean();
      if (settings?.timezone && Intl.supportedValuesOf('timeZone').includes(settings.timezone)) {
        restaurantTimezone = settings.timezone;
      }
    } catch (err) {
      console.warn("Failed to load restaurant timezone, using fallback:", err.message);
    }
    // ------------------------------------------------------------------------------------

    // ── Normal recommendation generation ──
    // Get AI prompt from DB (admin-controlled)
    let aiPrompt = `You are an expert restaurant recommendation system. 
Analyze the current cart items, time of day, day of week, and suggest 3-5 relevant cross-sell or upsell items that complement the order.
Return only JSON array with objects containing:
- _id (product ID from database)
- name
- price
- reason (short explanation, max 60 characters)
- badge (optional: TRENDING, POPULAR, PERFECT PAIR, NEW)
- type (cross-sell or upsell)

Focus on items NOT already in cart. Prioritize high-margin, popular, or complementary products.`;

    const settings = await AIPromptSettings.getCurrent();
    if (settings?.currentPrompt && settings.isEnabled) {
      aiPrompt = settings.currentPrompt;
    }

    // ── NEW: Use restaurant timezone for accurate time context ──
    const now = new Date();
    const currentHour = now.toLocaleString('en-US', { 
      timeZone: restaurantTimezone, 
      hour: 'numeric', 
      hour12: false 
    });
    const currentDay = now.toLocaleString('en-US', { 
      timeZone: restaurantTimezone, 
      weekday: 'long' 
    });
    const isWeekend = currentDay === "Saturday" || currentDay === "Sunday";
    const isRamadan = checkIfRamadan(restaurantTimezone); // ← pass timezone to helper
    // ------------------------------------------------------------------------------------

    // Time of day classification — now correct local time
    let timeContext = "evening";
    if (currentHour >= 5 && currentHour < 11) timeContext = "morning";
    else if (currentHour >= 11 && currentHour < 17) timeContext = "afternoon";
    else if (currentHour >= 21 || currentHour < 5) timeContext = "late night";

    // Build detailed context
    const cartItemsDescription = cartItems.map(item => 
      `${item.name} (${item.category || "uncategorized"}, qty: ${item.quantity}, price: ${item.price} ${currency})`
    ).join(", ");

    const availableProducts = allProducts
      .filter(product => !cartItems.some(cartItem => cartItem._id === product._id))
      .slice(0, 50); // Limit to avoid token limits

    const productsDescription = availableProducts.map(product =>
      `ID: ${product._id}, Name: ${product.name}, Category: ${product.category || "N/A"}, Price: ${product.currentPrice || product.price} ${currency}`
    ).join("\n");

    // Build GPT prompt — now includes correct local time context
    const userPrompt = `CURRENT CONTEXT:
Time: ${timeContext} (${currentHour}:00 local restaurant time)
Day: ${currentDay} (${isWeekend ? "Weekend" : "Weekday"})
Special: ${isRamadan ? "RAMADAN - Consider iftar/suhoor timing and traditions" : "Regular day"}
Timezone: ${restaurantTimezone}

CUSTOMER'S CURRENT CART:
${cartItemsDescription}

AVAILABLE PRODUCTS TO RECOMMEND:
${productsDescription}

${customerHistory ? `CUSTOMER HISTORY:\n${JSON.stringify(customerHistory, null, 2)}` : ""}

TASK:
Analyze the cart and context. Suggest exactly 4 products that would:
1. Complement what they ordered (beverages, sides, etc.)
2. Upgrade their experience (premium versions, combos)
3. Match the time of day and occasion
4. Consider cultural context (Ramadan, weekend, etc.)

Return ONLY a valid JSON array with 4 recommendations following the exact format specified in the system prompt.`;

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // or gpt-4o-mini for faster/cheaper responses
        messages: [
          { role: "system", content: aiPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
    });

    if (!openaiResponse.ok) {
      console.error("OpenAI API error:", await openaiResponse.text());
      // Fallback to rule-based recommendations
      return NextResponse.json({
        recommendations: getFallbackRecommendations(cartItems, availableProducts, timeContext, currency)
      });
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0].message.content;
    
    let recommendations;
    try {
      const parsed = JSON.parse(aiResponse);
      recommendations = parsed.recommendations || parsed;
      
      // Ensure we have the right structure
      if (!Array.isArray(recommendations)) {
        recommendations = Object.values(parsed);
      }
      
      // Enrich with full product data
      recommendations = recommendations.map(rec => {
        const fullProduct = availableProducts.find(p => p._id === rec._id || p.name === rec.name);
        return {
          ...fullProduct,
          ...rec,
          price: rec.price || fullProduct?.currentPrice || fullProduct?.price || "0",
          image: fullProduct?.image || rec.image,
          category: fullProduct?.category || rec.category
        };
      }).filter(Boolean).slice(0, 4);

    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      recommendations = getFallbackRecommendations(cartItems, availableProducts, timeContext, currency);
    }

    return NextResponse.json({ recommendations });

  } catch (error) {
    console.error("AI recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations", recommendations: [] },
      { status: 500 }
    );
  }
}

// ── NEW: Tracking endpoint (call this from frontend when user clicks/adds rec) ──
export async function PATCH(request) {
  try {
    await connectDB();

    const { clicked = false, added = false, revenue = 0 } = await request.json();

    const settings = await AIPromptSettings.getCurrent();
    if (settings) {
      await settings.trackRecommendation(clicked, added, revenue);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 404 });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}

// Helper: Check if currently Ramadan — now timezone-aware
function checkIfRamadan(timezone = "Asia/Riyadh") {
  const now = new Date();
  const year = now.getFullYear();
  
  // Ramadan dates for 2025-2026 (approximate - adjust based on moon sighting)
  const ramadanDates = {
    2025: { start: new Date(2025, 2, 1), end: new Date(2025, 2, 30) }, // March 1-30, 2025
    2026: { start: new Date(2026, 1, 18), end: new Date(2026, 2, 19) } // Feb 18 - Mar 19, 2026
  };
  
  // Convert dates to restaurant timezone for accurate comparison
  const nowLocal = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  
  if (ramadanDates[year]) {
    const startLocal = new Date(ramadanDates[year].start.toLocaleString('en-US', { timeZone: timezone }));
    const endLocal = new Date(ramadanDates[year].end.toLocaleString('en-US', { timeZone: timezone }));
    return nowLocal >= startLocal && nowLocal <= endLocal;
  }
  
  return false;
}

// Fallback rule-based recommendations (when AI fails) – unchanged
function getFallbackRecommendations(cartItems, availableProducts, timeContext, currency) {
  const recommendations = [];
  
  // Rule 1: If cart has food, suggest beverages
  const hasFood = cartItems.some(item => 
    item.category && !item.category.toLowerCase().includes("drink") && !item.category.toLowerCase().includes("beverage")
  );
  
  if (hasFood) {
    const beverages = availableProducts.filter(p => 
      p.category && (p.category.toLowerCase().includes("drink") || p.category.toLowerCase().includes("beverage"))
    );
    if (beverages.length > 0) {
      recommendations.push({
        ...beverages[0],
        reason: "Perfect drink to go with your meal",
        badge: "PERFECT PAIR",
        type: "cross-sell",
        emoji: "🥤"
      });
    }
  }
  
  // Rule 2: Time-based suggestions — now correct local time
  if (timeContext === "morning") {
    const breakfast = availableProducts.filter(p => 
      p.category && (p.category.toLowerCase().includes("breakfast") || p.name.toLowerCase().includes("coffee"))
    );
    if (breakfast.length > 0 && recommendations.length < 4) {
      recommendations.push({
        ...breakfast[0],
        reason: "Great way to start your morning",
        badge: "MORNING SPECIAL",
        type: "cross-sell",
        emoji: "☀️"
      });
    }
  } else if (timeContext === "evening") {
    const snacks = availableProducts.filter(p => 
      p.category && (p.category.toLowerCase().includes("snack") || p.category.toLowerCase().includes("tea"))
    );
    if (snacks.length > 0 && recommendations.length < 4) {
      recommendations.push({
        ...snacks[0],
        reason: "Popular evening choice",
        badge: "TRENDING",
        type: "cross-sell",
        emoji: "🌙"
      });
    }
  }
  
  // Rule 3: Add popular items
  const popular = availableProducts
    .filter(p => !recommendations.some(r => r._id === p._id))
    .slice(0, 4 - recommendations.length);
  
  popular.forEach((product, idx) => {
    recommendations.push({
      ...product,
      reason: "Customers love this!",
      badge: idx === 0 ? "POPULAR" : null,
      type: "upsell",
      emoji: "⭐"
    });
  });
  
  return recommendations.slice(0, 4);
}