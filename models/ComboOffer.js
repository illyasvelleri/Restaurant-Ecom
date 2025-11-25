// models/ComboOffer.js
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
  order: { type: Number, required: true, unique: true }
}, { timestamps: true });

export default mongoose.models.ComboOffer || mongoose.model('ComboOffer', comboOfferSchema);