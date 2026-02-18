

// // app/api/admin/products/route.js → FINAL 2025 (ADDONS SAVE FOR NEW & EXISTING PRODUCTS)

// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Product from '@/models/Product';
// import { uploadImage, deleteImage } from '@/lib/services/cloudinary';

// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// // GET – unchanged
// export async function GET() {
//   try {
//     await connectDB();
//     const products = await Product.find({}).sort({ createdAt: -1 }).lean();
//     return NextResponse.json(products);
//   } catch (error) {
//     console.error('GET products error:', error);
//     return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
//   }
// }

// // POST – create new product (WITH ADDONS)
// export async function POST(request) {
//   try {
//     await connectDB();

//     const formData = await request.formData();
//     const imageFile = formData.get('image');

//     const imageUrl = imageFile && imageFile.size > 0 ? await uploadImage(imageFile) : null;

//     // Parse addons
//     let addons = [];
//     const addonsJson = formData.get('addons');
//     if (addonsJson) {
//       try {
//         addons = JSON.parse(addonsJson);
//       } catch (e) {
//         console.warn('Invalid addons JSON');
//       }
//     }

//     const product = await Product.create({
//       name: formData.get('name') || 'Unnamed Product',
//       category: formData.get('category') || 'Uncategorized',
//       price: parseFloat(formData.get('price')) || 0,
//       stock: parseInt(formData.get('stock') || '0'),
//       status: formData.get('status') || 'active',
//       description: formData.get('description') || '',
//       image: imageUrl,
//       addons, // ← SAVES ADDONS
//       popular: false,
//     });

//     return NextResponse.json({ message: 'Product created', product }, { status: 201 });
//   } catch (error) {
//     console.error('POST product error:', error);
//     return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
//   }
// }

// // PUT – UPDATE PRODUCT (THIS FIXES "CANNOT UPDATE ADDONS")
// export async function PUT(request) {
//   try {
//     await connectDB();

//     const formData = await request.formData();
//     const id = formData.get('id');

//     if (!id) {
//       return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
//     }

//     const product = await Product.findById(id);
//     if (!product) {
//       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//     }

//     // Handle image
//     const imageFile = formData.get('image');
//     if (imageFile && imageFile instanceof File && imageFile.size > 0) {
//       if (product.image) {
//         const publicId = product.image.split('/').pop().split('.')[0];
//         await deleteImage(`restaurant/products/${publicId}`).catch(() => {});
//       }
//       product.image = await uploadImage(imageFile);
//     }

//     // UPDATE ALL FIELDS
//     product.name = formData.get('name')?.toString() || product.name;
//     product.category = formData.get('category')?.toString() || product.category;
//     product.price = parseFloat(formData.get('price')) || product.price;
//     product.stock = parseInt(formData.get('stock') || product.stock);
//     product.status = formData.get('status')?.toString() || product.status;
//     product.description = formData.get('description')?.toString() || product.description;

//     // THIS WAS MISSING — NOW ADDONS UPDATE WORKS!
//     const addonsJson = formData.get('addons');
//     if (addonsJson) {
//       try {
//         product.addons = JSON.parse(addonsJson);
//       } catch (e) {
//         console.warn('Invalid addons JSON, keeping old');
//       }
//     }

//     await product.save();

//     return NextResponse.json({
//       message: 'Product updated successfully',
//       product,
//     });
//   } catch (error) {
//     console.error('PUT product error:', error);
//     return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
//   }
// }

// // DELETE – unchanged
// export async function DELETE(request) {
//   try {
//     await connectDB();
//     const { id } = await request.json();
//     if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

//     const product = await Product.findById(id);
//     if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

//     if (product.image) {
//       const publicId = product.image.split('/').pop().split('.')[0];
//       await deleteImage(`restaurant/products/${publicId}`).catch(() => {});
//     }

//     await Product.findByIdAndDelete(id);
//     return NextResponse.json({ message: 'Deleted' });
//   } catch (error) {
//     console.error('DELETE error:', error);
//     return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
//   }
// }


// app/api/admin/products/route.js → MERGED & FINAL 2025
// Combines your reliable version with new fields support

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { uploadImage, deleteImage } from '@/lib/services/cloudinary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET – return clean numbers
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Ensure numbers are numbers (prevents frontend toFixed errors)
    const safeProducts = products.map(p => ({
      ...p,
      price: Number(p.price || 0),
      costPrice: Number(p.costPrice || 0),
      packagingCost: Number(p.packagingCost || 0),
      profitMargin: Number(p.profitMargin || 0),
      profitPerItem: Number(p.profitPerItem || 0),
      stock: Number(p.stock || 0),
      prepTimeMinutes: Number(p.prepTimeMinutes || 10),
      addons: (p.addons || []).map(a => ({
        ...a,
        price: Number(a.price || 0),
        cost: Number(a.cost || 0),
      })),
    }));

    return NextResponse.json(safeProducts);
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST – create
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const imageFile = formData.get('image');

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    // Parse addons safely
    let addons = [];
    const addonsJson = formData.get('addons');
    if (addonsJson) {
      try {
        addons = JSON.parse(addonsJson);
        // Ensure addon prices are numbers
        addons = addons.map(a => ({
          ...a,
          price: Number(a.price || 0),
          cost: Number(a.cost || 0),
        }));
      } catch (e) {
        console.warn('Invalid addons JSON in POST');
      }
    }

    const product = await Product.create({
      name: formData.get('name')?.trim() || 'Unnamed Product',
      category: formData.get('category')?.trim() || 'Uncategorized',
      price: Number(formData.get('price')) || 0,
      costPrice: Number(formData.get('costPrice')) || 0,
      packagingCost: Number(formData.get('packagingCost')) || 0,
      prepTimeMinutes: Number(formData.get('prepTimeMinutes')) || 10,
      stock: Number(formData.get('stock')) || 0,
      status: formData.get('status') || 'active',
      description: formData.get('description')?.trim() || '',
      image: imageUrl,
      addons,
      popular: false,
      // profitMargin & profitPerItem will be auto-calculated by pre-save hook
    });

    return NextResponse.json({ message: 'Product created', product }, { status: 201 });
  } catch (error) {
    console.error('POST product error:', error);
    return NextResponse.json(
      { error: error.name === 'ValidationError' ? 'Validation failed' : 'Failed to create' },
      { status: 500 }
    );
  }
}

// PUT – update (addons now fully supported)
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

    // Image handling
    const imageFile = formData.get('image');
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      if (product.image) {
        const publicId = product.image.split('/').pop().split('.')[0];
        await deleteImage(`restaurant/products/${publicId}`).catch(() => {});
      }
      product.image = await uploadImage(imageFile);
    }

    // Update scalar fields
    product.name = formData.get('name')?.trim() || product.name;
    product.category = formData.get('category')?.trim() || product.category;
    product.price = Number(formData.get('price')) || product.price;
    product.costPrice = Number(formData.get('costPrice')) || product.costPrice;
    product.packagingCost = Number(formData.get('packagingCost')) || product.packagingCost;
    product.prepTimeMinutes = Number(formData.get('prepTimeMinutes')) || product.prepTimeMinutes;
    product.stock = Number(formData.get('stock')) || product.stock;
    product.status = formData.get('status') || product.status;
    product.description = formData.get('description')?.trim() || product.description;

    // Update addons – this was the critical fix in your original
    const addonsJson = formData.get('addons');
    if (addonsJson !== null && addonsJson !== undefined) {
      try {
        let parsed = JSON.parse(addonsJson);
        parsed = parsed.map(a => ({
          ...a,
          price: Number(a.price || 0),
          cost: Number(a.cost || 0),
        }));
        product.addons = parsed;
      } catch (e) {
        console.warn('Invalid addons JSON in PUT – keeping existing');
      }
    }

    await product.save(); // triggers pre-save hook for margin calculation

    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json(
      { error: error.name === 'ValidationError' ? 'Validation failed' : 'Failed to update' },
      { status: 500 }
    );
  }
}

// DELETE – keep your clean version
export async function DELETE(request) {
  try {
    await connectDB();
    const body = await request.json();
    const id = body.id;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await deleteImage(`restaurant/products/${publicId}`).catch(() => {});
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}