// models/AuditLog.js

import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  entity: { type: String }, // product, order, user
  entityId: { type: mongoose.Schema.Types.ObjectId },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changes: { type: Object }
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
