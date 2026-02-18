// app/api/pricing-rules/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DynamicPricingRule from '@/models/DynamicPricingRule';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ============================= */
/* GET SINGLE RULE */
/* ============================= */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

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

/* ============================= */
/* UPDATE RULE */
/* ============================= */
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid rule ID' }, { status: 400 });
    }

    const body = await request.json();
    console.log('PUT BODY:', body);

    const rule = await DynamicPricingRule.findById(id);
    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    // Remove protected fields
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;

    const discount = Number(body.discountPercentage) || 0;
    const increase = Number(body.increasePercentage) || 0;
    if (discount > 0 && increase > 0) {
      return NextResponse.json({ error: 'Cannot apply both discount and increase' }, { status: 400 });
    }

    if (body.productId === '') body.productId = undefined;
    if (body.productId && !isValidObjectId(body.productId)) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }

    Object.assign(rule, body);
    await rule.save();

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

/* ============================= */
/* DELETE RULE */
/* ============================= */
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

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
