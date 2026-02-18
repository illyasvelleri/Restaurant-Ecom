// models/CustomerAnalytics.js

import mongoose from "mongoose";

const CustomerAnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  avgOrderValue: { type: Number, default: 0 },
  lastOrderDate: { type: Date },
  favoriteProductId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  churnRiskScore: { type: Number, default: 0 } // AI-calculated
}, { timestamps: true });

export default mongoose.models.CustomerAnalytics || mongoose.model("CustomerAnalytics", CustomerAnalyticsSchema);
