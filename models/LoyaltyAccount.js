// models/LoyaltyAccount.js

import mongoose from "mongoose";

const LoyaltyAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, default: 0 },
  tier: { type: String, enum: ["bronze", "silver", "gold"], default: "bronze" }
}, { timestamps: true });

export default mongoose.models.LoyaltyAccount || mongoose.model("LoyaltyAccount", LoyaltyAccountSchema);
