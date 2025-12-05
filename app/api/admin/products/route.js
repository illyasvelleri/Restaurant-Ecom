import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { uploadImage, deleteImage } from '@/lib/services/cloudinary';

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: fetch all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST: create new product
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const imageFile = formData.get('image');

    const imageUrl =
      imageFile && imageFile.size > 0 ? await uploadImage(imageFile) : null;

    const product = await Product.create({
      name: formData.get('name') || 'Unnamed Product',
      category: formData.get('category') || 'Uncategorized',
      price: formData.get('price') || '0.00',
      stock: parseInt(formData.get('stock') || '0'),
      status: formData.get('status') || 'active',
      description: formData.get('description') || '',
      image: imageUrl,
      popular: false,
    });

    return NextResponse.json(
      { message: 'Product created', product },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT: update a product (supports FormData + JSON)
export async function PUT(request) {
  try {
    await connectDB();

    const contentType = request.headers.get('content-type') || '';
    let data = {};
    let isFormData = false;

    if (contentType.includes('form-data')) {
      const formData = await request.formData();
      isFormData = true;
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
    } else {
      data = await request.json();
    }

    const id = data.id;
    if (!id) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Handle image upload
    if (isFormData) {
      const imageFile = data.image;
      if (imageFile instanceof File && imageFile.size > 0) {
        const newUrl = await uploadImage(imageFile);

        if (product.image) {
          const publicId = product.image.split('/').pop().split('.')[0];
          await deleteImage(`restaurant/products/${publicId}`).catch(() => {});
        }

        product.image = newUrl;
      }
    }

    // Update fields
    product.name = data.name ?? product.name;
    product.category = data.category ?? product.category;
    product.price = data.price ?? product.price;
    product.stock =
      data.stock !== undefined ? parseInt(data.stock) : product.stock;
    product.status = data.status ?? product.status;
    product.description = data.description ?? product.description;
    product.popular =
      data.popular !== undefined ? Boolean(data.popular) : product.popular;

    await product.save();

    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE: delete product
export async function DELETE(request) {
  try {
    await connectDB();

    const { id } = await request.json();
    if (!id)
      return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const product = await Product.findById(id);
    if (!product)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await deleteImage(`restaurant/products/${publicId}`).catch(() => {});
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}
