// models/PopularItem.js
import mongoose from 'mongoose';

const popularItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  order: {
    type: Number,
    required: true,
    unique: true
  }
}, { timestamps: true });

// Auto-increment order
popularItemSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('PopularItem').countDocuments();
    this.order = count + 1;
  }
  next();
});

export default mongoose.models.PopularItem || mongoose.model('PopularItem', popularItemSchema);