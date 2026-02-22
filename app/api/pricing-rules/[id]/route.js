import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DynamicPricingRule from '@/models/DynamicPricingRule';
import Product from '@/models/Product'; // ADDED: Required to update product flags
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ============================================================ 
   GET: Fetch a Single Rule
   ============================================================ */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid rule ID' }, { status: 400 });
    }

    const rule = await DynamicPricingRule.findById(id)
      .populate('productId', 'name price category')
      .lean();

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, rule });
  } catch (error) {
    console.error('GET RULE ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch rule' }, { status: 500 });
  }
}

/* ============================================================ 
   PUT: Update an Existing Rule
   ============================================================ */
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid rule ID' }, { status: 400 });
    }

    const body = await request.json();

    const rule = await DynamicPricingRule.findById(id);
    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    // --- FIX 1: ReferenceError Fix ---
    const discount = Number(body.discountPercentage) || 0;
    const increase = Number(body.increasePercentage) || 0; 
    
    if (discount > 0 && increase > 0) {
      return NextResponse.json({ error: 'Cannot apply both discount and increase' }, { status: 400 });
    }

    // --- FIX 2: Data Cleaning ---
    const updates = { ...body };

    if (updates.startTime === "") updates.startTime = undefined;
    if (updates.endTime === "") updates.endTime = undefined;
    
    // --- FIX 3: Product ID handling ---
    if (!updates.productId || updates.productId === '' || updates.productId === 'null') {
      updates.productId = null;
    } else if (!isValidObjectId(updates.productId)) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }

    // 3. Prevent overwriting protected fields
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    // 4. Save with Validation
    rule.set(updates); 
    await rule.save();

    // --- NEW ADDITION: AUTO-ENABLE DYNAMIC PRICING ON PRODUCTS DURING UPDATE ---
    // If the rule is being set to ACTIVE, ensure products have the flag enabled
    if (updates.active !== false) {
      if (updates.productId) {
        await Product.findByIdAndUpdate(updates.productId, { $set: { allowDynamicPricing: true } });
      } else {
        await Product.updateMany({}, { $set: { allowDynamicPricing: true } });
      }
    }
    // --------------------------------------------------------------------------

    const updatedRule = await DynamicPricingRule.findById(id)
      .populate('productId', 'name price category')
      .lean();

    return NextResponse.json({ success: true, rule: updatedRule });
  } catch (error) {
    console.error('PUT RULE ERROR:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update rule' }, { status: 500 });
  }
}

/* ============================================================ 
   DELETE: Remove a Rule
   ============================================================ */
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid rule ID' }, { status: 400 });
    }

    const deletedRule = await DynamicPricingRule.findByIdAndDelete(id);
    if (!deletedRule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Rule deleted successfully' });
  } catch (error) {
    console.error('DELETE RULE ERROR:', error);
    return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 });
  }
}