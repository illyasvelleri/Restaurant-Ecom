//app/api/user/products/route.js 


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
    const productsWithPricing = products.map(product => {
      const pricingInfo = calculateDynamicPrice(product, activeRules);
      
      return {
        ...product,
        // currentPrice is the dynamic price, price is the original
        currentPrice: pricingInfo ? pricingInfo.currentPrice : product.price,
        isDynamic: !!pricingInfo,
        activeRuleName: pricingInfo ? pricingInfo.ruleName : null
      };
    });

    return NextResponse.json(productsWithPricing, { status: 200 });
  } catch (error) {
    console.error("PRODUCTS API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Product from '@/models/Product';

// // Ensure dynamic behavior (avoid static rendering on Vercel)
// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// export async function GET() {
//   try {
//     await connectDB(); // ← CALL HERE, not top level

//     const products = await Product.find({})
//       .sort({ createdAt: -1 })
//       .lean();

//     return NextResponse.json(products, { status: 200 });
//   } catch (error) {
//     console.error("PRODUCTS API ERROR:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch products" },
//       { status: 500 }
//     );
//   }
// }
