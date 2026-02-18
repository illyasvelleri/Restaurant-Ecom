// models/User.js → Simplified

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // AUTH & CORE
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "user",
        "staff",
        "kitchen",
        "kitchen_manager",
        "waiter",
        "cashier",
        "delivery_boy",
        "manager",
        "admin",
        "superadmin"
      ],
      default: "user",
    },

    // MAIN CONTACT (WhatsApp-first)
    whatsapp: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      match: [/^\d{9,15}$/, "Invalid WhatsApp number"],
      default: null,
    },

    // PROFILE
    name: {
      type: String,
      trim: true,
      default: function () {
        return this.username;
      },
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
      default: null,
    },

    // DELIVERY ADDRESS
    address: { type: String, trim: true, default: "" },
    building: { type: String, trim: true, default: "" },
    floor: { type: String, trim: true, default: "" },
    apartment: { type: String, trim: true, default: "" },
    neighborhood: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "", maxlength: 100 },
    pincode: { type: String, trim: true, default: "" },

    notes: { type: String, trim: true, default: "" },

    // SETTINGS
    notifications: { type: Boolean, default: true },
    locationAccess: { type: Boolean, default: true },
    preferredLanguage: {
      type: String,
      default: "en",
      enum: ["en", "ar"],
    },

    // PASSWORD RESET
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    strict: true, // changed from false (important)
  }
);

/* Indexes */
UserSchema.index({ username: 1 });
UserSchema.index({ whatsapp: 1 }, { sparse: true });
UserSchema.index({ email: 1 }, { sparse: true });
UserSchema.index({ city: 1, neighborhood: 1 });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
