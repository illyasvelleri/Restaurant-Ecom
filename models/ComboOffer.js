// models/ComboOffer.js → FINAL WORKING VERSION

import mongoose from 'mongoose';

const comboOfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String },
  productIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  order: { type: Number, required: true } // ← REMOVED unique: true
}, { timestamps: true });

// Optional: Add index for sorting (not unique)
comboOfferSchema.index({ order: 1 });

export default mongoose.models.ComboOffer || mongoose.model('ComboOffer', comboOfferSchema);