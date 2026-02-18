// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   category: { type: String, required: true },
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   stock: { type: Number, required: true, min: 0 },
//   status: { type: String, enum: ['active', 'inactive'], default: 'active' },
//   description: { type: String },
//   image: { type: String, default: null }, // Cloudinary URL
//   addons: [{
//     name: { type: String, required: true },
//     price: { type: Number, required: true, min: 0 }
//   }],
//   rating: { type: String, default: '0.0' },
//   sales: { type: Number, default: 0 },
// }, {
//   timestamps: true,
//   strict: false  // ← THIS IS THE KEY FIX
// });

// export default mongoose.models.Product || mongoose.model('Product', productSchema);


// models/Product.js → ENTERPRISE VERSION

import mongoose from "mongoose";

const AddonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },     // selling price
  cost: { type: Number, default: 0 },                  // real cost
}, { _id: false });

const ProductSchema = new mongoose.Schema({

  // BASIC
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: null },
  description: { type: String },

  // SELLING
  price: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, default: 0 },            // ← NEW
  packagingCost: { type: Number, default: 0 },        // ← NEW

  // AUTO CALCULATED (store for speed)
  profitMargin: { type: Number, default: 0 },         // %
  profitPerItem: { type: Number, default: 0 },

  // INVENTORY
  stock: { type: Number, required: true, min: 0 },
  lowStockThreshold: { type: Number, default: 5 },
  autoDisableWhenOutOfStock: { type: Boolean, default: true },

  // OPERATIONS
  prepTimeMinutes: { type: Number, default: 10 },
  kitchenStation: { type: String, default: "main" },
  dineInOnly: { type: Boolean, default: false },
  deliveryEligible: { type: Boolean, default: true },

  // STATUS
  status: { type: String, enum: ["active", "inactive"], default: "active" },

  // ADDONS
  addons: [AddonSchema],

  // AI / AUTOMATION FLAGS
  allowDynamicPricing: { type: Boolean, default: false },
  allowAIUpsell: { type: Boolean, default: true },
  allowAutoPromotion: { type: Boolean, default: false },

  // ANALYTICS
  rating: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  revenueGenerated: { type: Number, default: 0 },
  profitGenerated: { type: Number, default: 0 },

}, { timestamps: true });

/* AUTO MARGIN CALCULATION */
ProductSchema.pre("save", function(next) {
  const totalCost = this.costPrice + this.packagingCost;
  this.profitPerItem = this.price - totalCost;

  if (this.price > 0) {
    this.profitMargin = ((this.profitPerItem / this.price) * 100).toFixed(2);
  }

  next();
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
