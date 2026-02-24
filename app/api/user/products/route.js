// //app/api/user/products/route.js 


// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Product from '@/models/Product';
// import DynamicPricingRule from '@/models/DynamicPricingRule';
// import { calculateDynamicPrice } from '@/lib/priceResolver';

// // Ensure dynamic behavior (avoid static rendering on Vercel)
// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// export async function GET() {
//   try {
//     await connectDB();

//     // Fetch products and active pricing rules simultaneously
//     const [products, activeRules] = await Promise.all([
//       Product.find({}).sort({ createdAt: -1 }).lean(),
//       DynamicPricingRule.find({ active: true }).lean()
//     ]);

//     // Apply dynamic pricing logic to each product
//     const productsWithPricing = products.map(product => {
//       const pricingInfo = calculateDynamicPrice(product, activeRules);

//       return {
//         ...product,
//         // currentPrice is the dynamic price, price is the original
//         currentPrice: pricingInfo ? pricingInfo.currentPrice : product.price,
//         isDynamic: !!pricingInfo,
//         activeRuleName: pricingInfo ? pricingInfo.ruleName : null
//       };
//     });

//     return NextResponse.json(productsWithPricing, { status: 200 });
//   } catch (error) {
//     console.error("PRODUCTS API ERROR:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch products" },
//       { status: 500 }
//     );
//   }
// }



// app/api/user/products/route.js — FIXED: correct dynamic pricing + no badge spam

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import DynamicPricingRule from '@/models/DynamicPricingRule';
import { calculateDynamicPrice } from '@/lib/priceResolver';

// Ensure dynamic behavior (avoid static rendering on Vercel)
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    await connectDB();

    // Fetch products and active pricing rules simultaneously
    const [products, activeRules] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).lean(),
      DynamicPricingRule.find({ active: true }).lean()
    ]);

    // Apply dynamic pricing logic to each product
    // Change the .map section to use Promise.all so it waits for the async price resolver
    const productsWithPricing = await Promise.all(products.map(async (product) => {
      const pricingInfo = await calculateDynamicPrice(product, activeRules);

      // Use pricingInfo directly since it returns null if no rule matches
      const hasActiveRule = pricingInfo !== null;

      return {
        ...product,
        currentPrice: hasActiveRule ? pricingInfo.currentPrice : product.price,
        originalPrice: product.price,
        isDynamic: hasActiveRule,
        activeRuleName: hasActiveRule ? (pricingInfo.ruleName || 'Offer') : null
      };
    }));

    return NextResponse.json(productsWithPricing, { status: 200 });
  } catch (error) {
    console.error("PRODUCTS API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}