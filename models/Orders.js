// models/Orders.js

import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "on-the-way", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card-online", "apple-pay", "stc-pay"],
      default: "cash",
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    // For WhatsApp orders
    whatsappMessageId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

// Prevent model overwrite in development
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;