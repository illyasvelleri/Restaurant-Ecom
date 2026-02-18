// app/api/pricing-rules/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DynamicPricingRule from '@/models/DynamicPricingRule';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ============================= */
/* CREATE RULE */
/* ============================= */
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

    if (!name?.trim() || !type) {
      return NextResponse.json({ error: 'Rule name and type are required' }, { status: 400 });
    }

    const discount = Number(discountPercentage) || 0;
    const increase = Number(increasePercentage) || 0;
    if (discount > 0 && increase > 0) {
      return NextResponse.json({ error: 'Cannot apply both discount and increase' }, { status: 400 });
    }

    let cleanProductId;
    if (productId) {
      if (!isValidObjectId(productId)) {
        return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
      }
      cleanProductId = new mongoose.Types.ObjectId(productId);
    }

    const rule = await DynamicPricingRule.create({
      name: name.trim(),
      description: description?.trim() || undefined,
      productId: cleanProductId,
      type,
      discountPercentage: discount,
      increasePercentage: increase,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      daysOfWeek: Array.isArray(daysOfWeek) ? daysOfWeek : [],
      active: Boolean(active !== false),
      priority: Number(priority) || 0,
    });

    console.log('CREATED RULE ID:', rule._id);

    return NextResponse.json({ success: true, rule }, { status: 201 });
  } catch (error) {
    console.error('POST ERROR:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create rule' }, { status: 500 });
  }
}

/* ============================= */
/* LIST RULES */
/* ============================= */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

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

    return NextResponse.json({ success: true, rules });
  } catch (error) {
    console.error('GET LIST ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
  }
}
