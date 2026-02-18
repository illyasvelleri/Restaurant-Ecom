// models/MarketingCampaign.js

import mongoose from "mongoose";

const MarketingCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["whatsapp", "sms", "email"], required: true },
  targetSegment: { type: String }, // e.g., "inactive-30-days"
  messageTemplate: { type: String },
  discountCode: { type: String },
  sentCount: { type: Number, default: 0 },
  conversionCount: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.MarketingCampaign || mongoose.model("MarketingCampaign", MarketingCampaignSchema);
