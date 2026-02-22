// // api/admin/products

// import { NextResponse } from 'next/server';
// import { uploadImage } from '../../services/imageService';

// // In-memory database (replace with MongoDB/Prisma in production)
// let products = [
//   {
//     id: 1,
//     name: 'Margherita Pizza',
//     category: 'Pizza',
//     price: '12.99',
//     stock: 45,
//     status: 'active',
//     rating: '4.8',
//     sales: 234,
//     description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
//     image: null,
//   },
//   // ... other initial products
// ];

// // POST: Create a new product
// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const imageFile = formData.get('image');
//     const imageUrl = imageFile ? await uploadImage(imageFile) : null;

//     const productData = {
//       id: products.length + 1,
//       name: formData.get('name'),
//       category: formData.get('category'),
//       price: formData.get('price'),
//       stock: parseInt(formData.get('stock'), 10),
//       status: formData.get('status'),
//       description: formData.get('description'),
//       image: imageUrl,
//       rating: '0.0',
//       sales: 0,
//     };

//     if (!productData.name || !productData.category || !productData.price || !productData.stock) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     products.push(productData);
//     return NextResponse.json({ message: 'Product created successfully', product: productData }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
//   }
// }

// // PUT: Update an existing product
// export async function PUT(request) {
//   try {
//     const formData = await request.formData();
//     const id = parseInt(formData.get('id'), 10);
//     const imageFile = formData.get('image');
//     const imageUrl = imageFile ? await uploadImage(imageFile) : formData.get('existingImage');

//     const productIndex = products.findIndex((p) => p.id === id);
//     if (productIndex === -1) {
//       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//     }

//     const updatedProduct = {
//       ...products[productIndex],
//       name: formData.get('name'),
//       category: formData.get('category'),
//       price: formData.get('price'),
//       stock: parseInt(formData.get('stock'), 10),
//       status: formData.get('status'),
//       description: formData.get('description'),
//       image: imageUrl || products[productIndex].image,
//     };

//     if (!updatedProduct.name || !updatedProduct.category || !updatedProduct.price || !updatedProduct.stock) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     products[productIndex] = updatedProduct;
//     return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
//   }
// }

// // DELETE: Delete a product
// export async function DELETE(request) {
//   try {
//     const { id } = await request.json();
//     const productIndex = products.findIndex((p) => p.id === id);

//     if (productIndex === -1) {
//       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//     }

//     products = products.filter((p) => p.id !== id);
//     return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
//   }
// }

// // GET: Retrieve all products
// export async function GET() {
//   return NextResponse.json(products, { status: 200 });
// }



//api/products

// api/products/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import DynamicPricingRule from '@/models/DynamicPricingRule';
// IMPORT THE HELPER HERE
import { calculateDynamicPrice } from '@/lib/priceResolver'; 

export async function GET() {
  try {
    await connectDB();
    
    const [dbProducts, activeRules] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).lean(),
      DynamicPricingRule.find({ active: true }).lean()
    ]);

    const productsWithPricing = dbProducts.map(product => {
      // USE THE HELPER HERE
      const pricingInfo = calculateDynamicPrice(product, activeRules);
      
      return {
        ...product,
        currentPrice: pricingInfo ? pricingInfo.currentPrice : product.price,
        isDynamic: !!pricingInfo,
        activeRuleName: pricingInfo ? pricingInfo.ruleName : null
      };
    });

    return NextResponse.json(productsWithPricing);
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

/* ============================================================ 
   POST: Create a New Product (Production)
   ============================================================ */
export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    
    const imageFile = formData.get('image');
    const imageUrl = imageFile && imageFile.size > 0 ? await uploadImage(imageFile) : null;

    const productData = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      costPrice: Number(formData.get('costPrice') || 0),
      packagingCost: Number(formData.get('packagingCost') || 0),
      stock: parseInt(formData.get('stock'), 10),
      status: formData.get('status') || 'active',
      description: formData.get('description'),
      image: imageUrl,
      allowDynamicPricing: formData.get('allowDynamicPricing') === 'true',
      allowAIUpsell: formData.get('allowAIUpsell') !== 'false', // Default true
    };

    if (!productData.name || !productData.category || isNaN(productData.price)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await Product.create(productData);
    return NextResponse.json({ message: 'Product created', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ============================================================ 
   PUT: Update an Existing Product (Production)
   ============================================================ */
export async function PUT(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const id = formData.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const existingProduct = await Product.findById(id);
    if (!existingProduct) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const imageFile = formData.get('image');
    let imageUrl = existingProduct.image;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    const updates = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      costPrice: Number(formData.get('costPrice')),
      packagingCost: Number(formData.get('packagingCost')),
      stock: parseInt(formData.get('stock'), 10),
      status: formData.get('status'),
      description: formData.get('description'),
      image: imageUrl,
      allowDynamicPricing: formData.get('allowDynamicPricing') === 'true',
    };

    Object.assign(existingProduct, updates);
    await existingProduct.save(); // Triggers the "pre-save" margin calculation

    return NextResponse.json({ message: 'Product updated', product: existingProduct }, { status: 200 });
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ============================================================ 
   DELETE: Remove a Product (Production)
   ============================================================ */
export async function DELETE(request) {
  try {
    await connectDB();
    const { id } = await request.json();

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE PRODUCT ERROR:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}