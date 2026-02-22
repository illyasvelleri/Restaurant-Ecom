//api/pricing-rules
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DynamicPricingRule from '@/models/DynamicPricingRule';
import Product from '@/models/Product'; // Added import for Product model
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// Helper to validate MongoDB ObjectIDs
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ============================================================ 
    POST: Create a New Pricing Rule
   ============================================================ */
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        const {
            name,
            description,
            productId,
            type,
            discountPercentage,
            increasePercentage,
            startTime,
            endTime,
            daysOfWeek,
            active,
            priority,
        } = body;

        // 1. Basic Field Validation
        if (!name?.trim() || !type) {
            return NextResponse.json({ error: 'Rule name and type are required' }, { status: 400 });
        }

        // 2. Logic Check: Cannot increase and decrease at once
        const discount = Number(discountPercentage) || 0;
        const increase = Number(increasePercentage) || 0;
        if (discount > 0 && increase > 0) {
            return NextResponse.json({ error: 'Choose either a discount or an increase, not both.' }, { status: 400 });
        }

        // 3. Clean Time Formatting 
        const cleanStartTime = startTime && startTime.trim() !== "" ? startTime : undefined;
        const cleanEndTime = endTime && endTime.trim() !== "" ? endTime : undefined;

        // 4. Product Association
        let cleanProductId = null;
        if (productId && isValidObjectId(productId)) {
            cleanProductId = new mongoose.Types.ObjectId(productId);
        }

        const rule = await DynamicPricingRule.create({
            name: name.trim(),
            description: description?.trim() || undefined,
            productId: cleanProductId,
            type: type.toLowerCase(),
            discountPercentage: discount,
            increasePercentage: increase,
            startTime: cleanStartTime,
            endTime: cleanEndTime,
            daysOfWeek: Array.isArray(daysOfWeek) ? daysOfWeek : [],
            active: active !== false,
            priority: Number(priority) || 0,
        });

        // --- NEW ADDITION: AUTO-ENABLE DYNAMIC PRICING ON PRODUCTS ---
        if (cleanProductId) {
            // Enable for the specific product selected
            await Product.findByIdAndUpdate(cleanProductId, { $set: { allowDynamicPricing: true } });
        } else {
            // Enable for ALL products if it's a global rule (productId is null)
            await Product.updateMany({}, { $set: { allowDynamicPricing: true } });
        }
        // -------------------------------------------------------------

        return NextResponse.json({ success: true, rule }, { status: 201 });

    } catch (error) {
        console.error('API_PRICING_RULE_POST_ERROR:', error);
        return NextResponse.json({ 
            error: error.name === 'ValidationError' ? 'Validation Failed' : 'Internal Server Error',
            details: error.errors || error.message 
        }, { status: 500 });
    }
}

/* ============================================================ 
    GET: List Rules (with optional filtering by Product)
   ============================================================ */
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        // Filter: Show rules specifically for this product OR rules for ALL products
        const query = {};
        if (productId && isValidObjectId(productId)) {
            query.$or = [
                { productId: new mongoose.Types.ObjectId(productId) },
                { productId: null }
            ];
        }

        const rules = await DynamicPricingRule.find(query)
            .populate('productId', 'name price category')
            .sort({ priority: -1, createdAt: -1 })
            .lean();

        return NextResponse.json({ 
            success: true, 
            count: rules.length,
            rules 
        });

    } catch (error) {
        console.error('API_PRICING_RULE_GET_ERROR:', error);
        return NextResponse.json({ error: 'Failed to fetch pricing rules' }, { status: 500 });
    }
}