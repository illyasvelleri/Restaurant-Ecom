// app/api/inventory-log/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InventoryLog from '@/models/InventoryLog';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// POST /api/inventory-log
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      productId,
      type,
      quantity,
      unitPrice,
      reason,
      performedBy,
      reference,
      notes,
      metadata,
    } = body;

    // Required fields (branchId removed)
    if (!productId || !type || quantity === undefined) {
      return NextResponse.json(
        { error: 'productId, type, and quantity are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid productId format' }, { status: 400 });
    }

    if (performedBy && !mongoose.Types.ObjectId.isValid(performedBy)) {
      return NextResponse.json({ error: 'Invalid performedBy user ID' }, { status: 400 });
    }

    const log = await InventoryLog.create({
      productId,
      type,
      quantity: Number(quantity),
      unitPrice: unitPrice ? Number(unitPrice) : undefined,
      reason: reason?.trim(),
      performedBy,
      reference: reference?.trim(),
      notes: notes?.trim(),
      metadata: metadata || {},
    });

    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error) {
    console.error('POST /inventory-log error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create inventory log', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/inventory-log
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const performedBy = searchParams.get('performedBy');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || '-createdAt';

    const query = {};

    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      query.productId = productId;
    }

    if (
      type &&
      [
        'sale',
        'restock',
        'manual-adjustment',
        'waste',
        'theft',
        'damage',
        'return',
        'correction',
      ].includes(type)
    ) {
      query.type = type;
    }

    if (performedBy && mongoose.Types.ObjectId.isValid(performedBy)) {
      query.performedBy = performedBy;
    }

    // Date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const logs = await InventoryLog.find(query)
      .populate('productId', 'name price category')
      .populate('performedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await InventoryLog.countDocuments(query);

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /inventory-log error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory logs', details: error.message },
      { status: 500 }
    );
  }
}
