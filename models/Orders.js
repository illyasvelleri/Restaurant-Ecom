// models/Orders.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  note: { type: String, default: "" },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,      // WhatsApp orders may come without login
    },

    items: [OrderItemSchema],

    total: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "on-the-way",
        "delivered",
        "cancelled"
      ],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card-online", "apple-pay", "stc-pay"],
      default: "cash",
    },

    deliveryAddress: { type: String, required: true },
    phone: { type: String, required: true },
    customerName: { type: String, required: true },
    whatsapp: { type: String, required: false },
    notes: { type: String, default: "" },

    // source: {
    //   type: String,
    //   enum: ["Website", "WhatsApp", "Admin", "MobileApp"],
    //   default: "Website"
    // },

    whatsappMessageId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
