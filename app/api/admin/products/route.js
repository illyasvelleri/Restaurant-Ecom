// // app/api/admin/products/route.js → 100% WORKING (no syntax errors)

// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Product from '@/models/Product';
// import { uploadImage, deleteImage } from '@/lib/services/cloudinary';

// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// // GET – fetch all products
// export async function GET() {
//   try {
//     await connectDB();
//     const products = await Product.find({}).sort({ createdAt: -1 }).lean();
//     return NextResponse.json(products);
//   } catch (error) {
//     console.error('GET products error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch products' },
//       { status: 500 }
//     );
//   }
// }

// // POST – create new product
// export async function POST(request) {
//   try {
//     await connectDB();

//     const formData = await request.formData();
//     const imageFile = formData.get('image');

//     const imageUrl =
//       imageFile && imageFile.size > 0 ? await uploadImage(imageFile) : null;

//     const product = await Product.create({
//       name: formData.get('name') || 'Unnamed Product',
//       category: formData.get('category') || 'Uncategorized',
//       price: parseFloat(formData.get('price')) || 0,
//       stock: parseInt(formData.get('stock') || '0'),
//       status: formData.get('status') || 'active',
//       description: formData.get('description') || '',
//       image: imageUrl,
//       popular: false,
//     });

//     return NextResponse.json(
//       { message: 'Product created successfully', product },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('POST product error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to create product' },
//       { status: 500 }
//     );
//   }
// }

// // PUT – update product
// export async function PUT(request) {
//   try {
//     await connectDB();

//     const formData = await request.formData();
//     const id = formData.get('id');

//     if (!id) {
//       return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
//     }

//     const product = await Product.findById(id);
//     if (!product) {
//       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//     }

//     // Handle image upload
//     const imageFile = formData.get('image');
//     if (imageFile && imageFile instanceof File && imageFile.size > 0) {
//       // Delete old image
//       if (product.image) {
//         const publicId = product.image.split('/').pop().split('.')[0];
//         await deleteImage(`restaurant/products/${publicId}`).catch(() => {});
//       }
//       // Upload new image
//       product.image = await uploadImage(imageFile);
//     }

//     // Update fields
//     product.name = formData.get('name')?.toString() || product.name;
//     product.category = formData.get('category')?.toString() || product.category;
//     product.price = parseFloat(formData.get('price')) || product.price;
//     product.stock = parseInt(formData.get('stock') || product.stock);
//     product.status = formData.get('status')?.toString() || product.status;
//     product.description = formData.get('description')?.toString() || product.description;

//     await product.save();

//     return NextResponse.json({
//       message: 'Product updated successfully',
//       product,
//     });
//   } catch (error) {
//     console.error('PUT product error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to update product' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE – delete product
// export async function DELETE(request) {
//   try {
//     await connectDB();

//     const { id } = await request.json();
//     if (!id) {
//       return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
//     }

//     const product = await Product.findById(id);
//     if (!product) {
//       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//     }

//     // Delete image from Cloudinary
//     if (product.image) {
//       const publicId = product.image.split('/').pop().split('.')[0];
//       await deleteImage(`restaurant/products/${publicId}`).catch(() => {});
//     }

//     await Product.findByIdAndDelete(id);

//     return NextResponse.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     console.error('DELETE product error:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete product' },
//       { status: 500 }
//     );
//   }
// }


// app/api/admin/products/route.js → FINAL 2025 (ADDONS SAVE FOR NEW & EXISTING PRODUCTS)

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { uploadImage, deleteImage } from '@/lib/services/cloudinary';

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// GET – unchanged
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST – create new product (WITH ADDONS)
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const imageFile = formData.get('image');

    const imageUrl = imageFile && imageFile.size > 0 ? await uploadImage(imageFile) : null;

    // Parse addons
    let addons = [];
    const addonsJson = formData.get('addons');
    if (addonsJson) {
      try {
        addons = JSON.parse(addonsJson);
      } catch (e) {
        console.warn('Invalid addons JSON');
      }
    }

    const product = await Product.create({
      name: formData.get('name') || 'Unnamed Product',
      category: formData.get('category') || 'Uncategorized',
      price: parseFloat(formData.get('price')) || 0,
      stock: parseInt(formData.get('stock') || '0'),
      status: formData.get('status') || 'active',
      description: formData.get('description') || '',
      image: imageUrl,
      addons, // ← SAVES ADDONS
      popular: false,
    });

    return NextResponse.json({ message: 'Product created', product }, { status: 201 });
  } catch (error) {
    console.error('POST product error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

// PUT – UPDATE PRODUCT (THIS FIXES "CANNOT UPDATE ADDONS")
export async function PUT(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const id = formData.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Handle image
    const imageFile = formData.get('image');
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      if (product.image) {
        const publicId = product.image.split('/').pop().split('.')[0];
        await deleteImage(`restaurant/products/${publicId}`).catch(() => {});
      }
      product.image = await uploadImage(imageFile);
    }

    // UPDATE ALL FIELDS
    product.name = formData.get('name')?.toString() || product.name;
    product.category = formData.get('category')?.toString() || product.category;
    product.price = parseFloat(formData.get('price')) || product.price;
    product.stock = parseInt(formData.get('stock') || product.stock);
    product.status = formData.get('status')?.toString() || product.status;
    product.description = formData.get('description')?.toString() || product.description;

    // THIS WAS MISSING — NOW ADDONS UPDATE WORKS!
    const addonsJson = formData.get('addons');
    if (addonsJson) {
      try {
        product.addons = JSON.parse(addonsJson);
      } catch (e) {
        console.warn('Invalid addons JSON, keeping old');
      }
    }

    await product.save();

    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE – unchanged
export async function DELETE(request) {
  try {
    await connectDB();
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await deleteImage(`restaurant/products/${publicId}`).catch(() => {});
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}