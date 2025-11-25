import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true }, // or Number if you prefer: type: Number
  stock: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  description: { type: String },
  image: { type: String, default: null }, // Cloudinary URL
  rating: { type: String, default: '0.0' },
  sales: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);