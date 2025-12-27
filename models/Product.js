import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  description: { type: String },
  image: { type: String, default: null }, // Cloudinary URL
  addons: [{
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }
  }],
  rating: { type: String, default: '0.0' },
  sales: { type: Number, default: 0 },
}, {
  timestamps: true,
  strict: false  // ← THIS IS THE KEY FIX
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);