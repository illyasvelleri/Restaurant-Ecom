// app/api/admin/products/[id]/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { uploadImage } from '@/lib/services/cloudinary';

export const dynamic = 'force-dynamic';

// GET single product
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`GET /admin/products/${params.id} error:`, error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT - update product
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const formData = await request.formData();
    const updateData = {};

    const fields = ['name', 'category', 'description', 'status'];
    fields.forEach(f => {
      const val = formData.get(f)?.toString().trim();
      if (val) updateData[f] = val;
    });

    const numFields = ['price', 'stock'];
    numFields.forEach(f => {
      const val = formData.get(f);
      if (val !== undefined && val !== '') {
        updateData[f] = f === 'price' ? parseFloat(val) : parseInt(val);
      }
    });

    const addonsRaw = formData.get('addons');
    if (addonsRaw) {
      try {
        let addons = JSON.parse(addonsRaw);
        addons = addons.filter(
          a =>
            a.name?.trim() &&
            !isNaN(parseFloat(a.price)) &&
            parseFloat(a.price) >= 0
        );
        updateData.addons = addons;
      } catch {}
    }

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      updateData.image = await uploadImage(imageFile);
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`PUT /admin/products/${params.id} error:`, error);
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`DELETE /admin/products/${params.id} error:`, error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
