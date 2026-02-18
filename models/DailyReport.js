// models/DailyReport.js

import mongoose from "mongoose";

const DailyReportSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true, // One report per day
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    totalRevenue: {
      type: Number,
      default: 0,
    },

    totalProfit: {
      type: Number,
      default: 0,
    },

    averageOrderValue: {
      type: Number,
      default: 0,
    },

    topProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

// Single-field unique index (no branch dimension)
DailyReportSchema.index({ date: 1 }, { unique: true });

export default mongoose.models.DailyReport ||
  mongoose.model("DailyReport", DailyReportSchema);
