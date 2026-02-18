// models/KitchenQueue.js

import mongoose from "mongoose";

const KitchenQueueSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  station: { type: String },
  priorityScore: { type: Number, default: 0 },
  estimatedCompletionTime: { type: Date },
  status: { type: String, enum: ["queued", "preparing", "ready"], default: "queued" }
}, { timestamps: true });

export default mongoose.models.KitchenQueue || mongoose.model("KitchenQueue", KitchenQueueSchema);
