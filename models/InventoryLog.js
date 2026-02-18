// // models/InventoryLog.js
// import mongoose from 'mongoose';

// const InventoryLogSchema = new mongoose.Schema(
//   {
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true,
//       index: true,
//     },
//     branchId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Branch',
//       required: true,
//       index: true,
//     },
//     type: {
//       type: String,
//       enum: ['sale', 'restock', 'manual-adjustment', 'waste', 'theft', 'damage', 'return', 'correction'],
//       required: true,
//       index: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     unitPrice: {
//       type: Number,
//       min: 0,
//       default: 0,
//     },
//     totalValue: {
//       type: Number,
//     },
//     reason: {
//       type: String,
//       maxlength: 500,
//       trim: true,
//     },
//     performedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       default: null, // can be null if system-generated (e.g. POS sale)
//     },
//     reference: {
//       type: String, // orderId, invoice number, adjustment ticket, etc.
//       trim: true,
//     },
//     notes: {
//       type: String,
//       maxlength: 1000,
//       trim: true,
//     },
//     metadata: {
//       type: mongoose.Schema.Types.Mixed,
//       default: {},
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Auto-calculate totalValue if unitPrice exists
// InventoryLogSchema.pre('save', function (next) {
//   if (this.unitPrice !== undefined && this.unitPrice !== null) {
//     this.totalValue = this.unitPrice * Math.abs(this.quantity);
//   }
//   next();
// });

// export default mongoose.models.InventoryLog || mongoose.model('InventoryLog', InventoryLogSchema);

// models/InventoryLog.js
import mongoose from 'mongoose';

const InventoryLogSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ['sale', 'restock', 'manual-adjustment', 'waste', 'theft', 'damage', 'return', 'correction'],
      required: true,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unitPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalValue: {
      type: Number,
    },

    reason: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    reference: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      maxlength: 1000,
      trim: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate totalValue if unitPrice exists
InventoryLogSchema.pre('save', function (next) {
  if (this.unitPrice !== undefined && this.unitPrice !== null) {
    this.totalValue = this.unitPrice * Math.abs(this.quantity);
  }
  next();
});

export default mongoose.models.InventoryLog || mongoose.model('InventoryLog', InventoryLogSchema);
