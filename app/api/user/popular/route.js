// app/api/user/popular/route.js → FINAL 100% WORKING VERSION



// app/api/user/popular/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PopularItem from "@/models/PopularItem";
import Product from "@/models/Product"; 
import DynamicPricingRule from "@/models/DynamicPricingRule"; // Added
import { calculateDynamicPrice } from "@/lib/priceResolver"; // Added

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    await connectDB();

    // 1. Fetch Popular items and Active rules simultaneously
    const [populars, activeRules] = await Promise.all([
      PopularItem.find({})
        .sort({ order: 1 })
        .populate("productId")
        .lean(),
      DynamicPricingRule.find({ active: true }).lean()
    ]);

    // 2. Map through popular items and apply pricing logic
    const items = populars
      .filter(p => p.productId) // Safety filter to avoid crashes if product was deleted
      .map((p) => {
        const product = p.productId;
        
        // Calculate the dynamic price for this specific product
        const pricingInfo = calculateDynamicPrice(product, activeRules);

        return {
          product: {
            ...product,
            _id: product._id.toString(),
            // Inject dynamic pricing data
            currentPrice: pricingInfo ? pricingInfo.currentPrice : product.price,
            isDynamic: !!pricingInfo,
            activeRuleName: pricingInfo ? pricingInfo.ruleName : null
          },
        };
      });

    return NextResponse.json(items);
  } catch (error) {
    console.error("POPULAR GET ERROR:", error);
    return NextResponse.json({ error: "Failed to load popular items" }, { status: 500 });
  }
}
// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import PopularItem from "@/models/PopularItem";

// // YOU MUST IMPORT Product model — THIS IS THE KEY!
// import Product from "@/models/Product";  // ← ADD THIS LINE WAS MISSING!

// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// export async function GET() {
//   try {
//     await connectDB();

//     const populars = await PopularItem.find({})
//       .sort({ order: 1 })
//       .populate("productId")           // ← This works IF Product model is imported
//       .lean();

//     const items = populars.map((p) => ({
//       product: {
//         ...p.productId,
//         _id: p.productId._id.toString(),
//       },
//     }));

//     return NextResponse.json(items);
//   } catch (error) {
//     console.error("POPULAR GET ERROR:", error);
//     return NextResponse.json({ error: "Failed to load popular items" }, { status: 500 });
//   }
// }