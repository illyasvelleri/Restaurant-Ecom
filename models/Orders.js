// // models/Order.js → FINAL 2025 (ORDER ID + TIME)

// import mongoose from "mongoose";

// const OrderItemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   quantity: { type: Number, required: true, min: 1 },
//   price: { type: Number, required: true },
//   addons: [{
//     name: { type: String, required: true },
//     price: { type: Number, required: true }
//   }],
// });

// const OrderSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: false,
//     },
//     branchId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Branch",
//       required: true
//     }
//     ,
//     items: [OrderItemSchema],
//     total: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "preparing", "on-the-way", "delivered", "cancelled"],
//       default: "pending",
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["cash", "card-online", "apple-pay", "stc-pay"],
//       default: "cash",
//     },
//     deliveryAddress: { type: String, required: true },
//     phone: { type: String, required: true },
//     customerName: { type: String, required: true },
//     whatsapp: { type: String },
//     notes: { type: String, default: "" },
//     orderId: { type: String, unique: true },       // ← NEW: Unique Order ID
//     orderTime: { type: String },                  // ← NEW: Order Time
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Order || mongoose.model("Order", OrderSchema);


// // models/Order.js (polished – branchId required + indexed)

// import mongoose from "mongoose";

// const OrderItemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   quantity: { type: Number, required: true, min: 1 },
//   price: { type: Number, required: true },
//   addons: [{
//     name: { type: String, required: true },
//     price: { type: Number, required: true }
//   }],
// });

// const OrderSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: false,
//     },
//     branchId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Branch",
//       required: [true, "Branch is required"],
//       index: true, // ← fast filtering by branch
//     },
//     items: [OrderItemSchema],
//     total: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "preparing", "on-the-way", "delivered", "cancelled"],
//       default: "pending",
//       index: true, // fast status queries
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["cash", "card-online", "apple-pay", "stc-pay"],
//       default: "cash",
//     },
//     deliveryAddress: { type: String, required: true },
//     phone: { type: String, required: true },
//     customerName: { type: String, required: true },
//     whatsapp: { type: String },
//     notes: { type: String, default: "" },
//     orderId: { type: String, unique: true, index: true }, // unique order number
//     orderTime: { type: String }, // formatted time
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Order || mongoose.model("Order", OrderSchema);


// models/Order.js

import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  addons: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    items: [OrderItemSchema],

    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "on-the-way", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card-online", "apple-pay", "stc-pay"],
      default: "cash",
    },

    deliveryAddress: { type: String, required: true },
    phone: { type: String, required: true },
    customerName: { type: String, required: true },
    whatsapp: { type: String },
    notes: { type: String, default: "" },

    orderId: { type: String, unique: true, index: true },
    orderTime: { type: String },

  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
