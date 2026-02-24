// // // lib/priceResolver.js

// /**
//  * Calculates the dynamic price for a product based on active rules.
//  */
// export function calculateDynamicPrice(product, activeRules) {
//   // 1. Guard: Check if dynamic pricing is allowed
//   if (!product || !product.allowDynamicPricing) return null;

//   const now = new Date();
//   // Use Riyadh time or local time consistently
//   const currentTime = now.getHours() * 100 + now.getMinutes(); 
  
//   const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

//   // 2. Find applicable rules
//   const applicableRules = activeRules.filter(rule => {
//     // A. Day Match
//     const dayMatch = !rule.daysOfWeek || 
//                      rule.daysOfWeek.length === 0 || 
//                      rule.daysOfWeek.some(d => d.toLowerCase() === currentDay.toLowerCase());
//     if (!dayMatch) return false;

//     // B. Time Match
//     if (rule.startTime && rule.endTime) {
//       const start = parseInt(rule.startTime.replace(':', ''));
//       const end = parseInt(rule.endTime.replace(':', ''));
      
//       let isWithinTime = false;
//       if (start <= end) {
//         isWithinTime = currentTime >= start && currentTime <= end;
//       } else {
//         isWithinTime = currentTime >= start || currentTime <= end;
//       }
//       if (!isWithinTime) return false;
//     }

//     // C. Product Match
//     if (!rule.productId) return true; // Global rule
    
//     const ruleProdId = rule.productId._id ? rule.productId._id.toString() : rule.productId.toString();
//     const prodId = product._id ? product._id.toString() : product.toString();

//     return ruleProdId === prodId;
//   });

//   if (applicableRules.length === 0) return null;

//   // 3. Sort by priority (Highest first)
//   const bestRule = [...applicableRules].sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];

//   // 4. Calculate Final Price
//   let basePrice = parseFloat(product.price || 0);
//   let finalPrice = basePrice;

//   if (bestRule.discountPercentage > 0) {
//     // FIX: Use more precise calculation to avoid 1.299999 issues
//     finalPrice = basePrice - (basePrice * (bestRule.discountPercentage / 100));
//   } else if (bestRule.increasePercentage > 0) {
//     finalPrice = basePrice + (basePrice * (bestRule.increasePercentage / 100));
//   }

//   // FIX: Use Math.round to ensure 1.30 doesn't float down to 1.20
//   // We multiply by 100, round, then divide by 100 to get clean 2-decimal precision
//   const precisePrice = Math.round((finalPrice + Number.EPSILON) * 100) / 100;

//   return {
//     originalPrice: basePrice,
//     currentPrice: precisePrice, // Returns a clean number like 1.3
//     ruleName: bestRule.name,
//     type: bestRule.type
//   };
// }
// lib/priceResolver.js — FIXED & FINAL 2025
// - Timezone-aware from PublicSetting DB
// - Returns null when no rule applies → prevents badge spam
// - Clean prices (no floating point issues)
// - ruleName only if actually set (no forced 'Active')

/**
 * Calculates the dynamic price for a product based on active rules.
 * Uses restaurant timezone from DB for correct time/day comparisons.
 * Returns null if no rule actually applies (prevents badge/price spam).
 */
export async function calculateDynamicPrice(product, activeRules = []) {
  // 1. Early guards — prevent crashes & useless work
  if (!product || !product.allowDynamicPricing) return null;
  if (!Array.isArray(activeRules) || activeRules.length === 0) return null;

  // 2. Fetch restaurant timezone (fallback safe)
  let timezone = 'Asia/Riyadh';
  try {
    const { default: PublicSetting } = await import('@/models/PublicSetting');
    const publicSettings = await PublicSetting.findOne({}).lean();
    if (publicSettings?.timezone && Intl.supportedValuesOf('timeZone').includes(publicSettings.timezone)) {
      timezone = publicSettings.timezone;
    }
  } catch (err) {
    console.warn('Failed to load timezone, using fallback:', err.message);
  }

  // 3. Current time & day in restaurant timezone
  const now = new Date();
  const currentTimeStr = now.toLocaleString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const [hours, minutes] = currentTimeStr.split(':').map(Number);
  const currentTime = hours * 100 + minutes;

  const currentDay = now.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'long'
  });

  // 4. Find applicable rules
  const applicableRules = activeRules.filter(rule => {
    // A. Day Match
    const dayMatch = !rule.daysOfWeek || 
                     rule.daysOfWeek.length === 0 || 
                     rule.daysOfWeek.some(d => d.toLowerCase() === currentDay.toLowerCase());
    if (!dayMatch) return false;

    // B. Time Match — timezone-aware
    if (rule.startTime && rule.endTime) {
      const start = parseInt(rule.startTime.replace(':', ''));
      const end   = parseInt(rule.endTime.replace(':', ''));
      
      let isWithinTime = false;
      if (start <= end) {
        isWithinTime = currentTime >= start && currentTime <= end;
      } else {
        // Overnight rule (e.g. 22:00 – 02:00)
        isWithinTime = currentTime >= start || currentTime <= end;
      }
      if (!isWithinTime) return false;
    }

    // C. Product Match
    if (!rule.productId) return true; // Global rule
    
    const ruleProdId = rule.productId?._id?.toString() || rule.productId?.toString();
    const prodId = product._id?.toString() || product.toString();

    return ruleProdId === prodId;
  });

  // 5. No matching rule → null (no price change, no badge)
  if (applicableRules.length === 0) return null;

  // 6. Pick highest priority rule
  const bestRule = [...applicableRules].sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];

  // 7. Calculate price (exact same as your old successful version)
  let basePrice = parseFloat(product.price || 0);
  let finalPrice = basePrice;

  if (bestRule.discountPercentage > 0) {
    finalPrice = basePrice - (basePrice * (bestRule.discountPercentage / 100));
  } else if (bestRule.increasePercentage > 0) {
    finalPrice = basePrice + (basePrice * (bestRule.increasePercentage / 100));
  }

  // 8. Clean 2-decimal rounding
  const precisePrice = Math.round((finalPrice + Number.EPSILON) * 100) / 100;

  // 9. Return result — ruleName only if set (prevents "Active" spam)
  return {
    originalPrice: basePrice,
    currentPrice: precisePrice,
    ruleName: bestRule.name || null,           // ← null if no name → frontend fallback works
    type: bestRule.type || null,
    appliedInTimezone: timezone
  };
}