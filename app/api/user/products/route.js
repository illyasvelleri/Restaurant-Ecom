
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { uploadImage, deleteImage } from '@/lib/services/cloudinary';

await connectDB();

export async function GET() {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}