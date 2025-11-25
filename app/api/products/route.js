// api/admin/products

import { NextResponse } from 'next/server';
import { uploadImage } from '../../services/imageService';

// In-memory database (replace with MongoDB/Prisma in production)
let products = [
  {
    id: 1,
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: '12.99',
    stock: 45,
    status: 'active',
    rating: '4.8',
    sales: 234,
    description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
    image: null,
  },
  // ... other initial products
];

// POST: Create a new product
export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const imageUrl = imageFile ? await uploadImage(imageFile) : null;

    const productData = {
      id: products.length + 1,
      name: formData.get('name'),
      category: formData.get('category'),
      price: formData.get('price'),
      stock: parseInt(formData.get('stock'), 10),
      status: formData.get('status'),
      description: formData.get('description'),
      image: imageUrl,
      rating: '0.0',
      sales: 0,
    };

    if (!productData.name || !productData.category || !productData.price || !productData.stock) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    products.push(productData);
    return NextResponse.json({ message: 'Product created successfully', product: productData }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT: Update an existing product
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = parseInt(formData.get('id'), 10);
    const imageFile = formData.get('image');
    const imageUrl = imageFile ? await uploadImage(imageFile) : formData.get('existingImage');

    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = {
      ...products[productIndex],
      name: formData.get('name'),
      category: formData.get('category'),
      price: formData.get('price'),
      stock: parseInt(formData.get('stock'), 10),
      status: formData.get('status'),
      description: formData.get('description'),
      image: imageUrl || products[productIndex].image,
    };

    if (!updatedProduct.name || !updatedProduct.category || !updatedProduct.price || !updatedProduct.stock) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    products[productIndex] = updatedProduct;
    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE: Delete a product
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products = products.filter((p) => p.id !== id);
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

// GET: Retrieve all products
export async function GET() {
  return NextResponse.json(products, { status: 200 });
}
