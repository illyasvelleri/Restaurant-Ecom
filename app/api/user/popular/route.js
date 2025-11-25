// app/api/user/popular/route.js
import connectDB from '@/lib/db';
import PopularItem from '@/models/PopularItem';

await connectDB();

export async function GET() {
  try {
    const populars = await PopularItem.find({})
      .sort({ order: 1 })
      .populate('productId')
      .lean();

    const items = populars.map(p => ({
      product: {
        ...p.productId,
        _id: p.productId._id.toString()
      }
    }));

    return Response.json(items);
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}