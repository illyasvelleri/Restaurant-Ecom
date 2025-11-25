// app/api/admin/combos/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ComboOffer from '@/models/ComboOffer';
import Product from '@/models/Product';
import { uploadImage } from '@/lib/services/cloudinary';

await connectDB();

const MAX_COMBOS = 10;

// GET all combos
export async function GET() {
  try {
    const combos = await ComboOffer.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(combos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch combos' }, { status: 500 });
  }
}

// POST: Create new combo
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const price = parseFloat(formData.get('price'));
    const productIds = JSON.parse(formData.get('productIds') || '[]');

    const count = await ComboOffer.countDocuments();
    if (count >= MAX_COMBOS) {
      return NextResponse.json({ error: 'Maximum 10 combo offers allowed' }, { status: 400 });
    }

    let imageUrl = null;
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    const combo = await ComboOffer.create({
      title,
      description: formData.get('description'),
      price,
      originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null,
      image: imageUrl,
      productIds,
      order: count + 1
    });

    return NextResponse.json({ message: 'Combo created!', combo }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create combo' }, { status: 500 });
  }
}

// DELETE combo
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await ComboOffer.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Combo deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}