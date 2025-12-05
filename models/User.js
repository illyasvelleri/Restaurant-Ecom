// models/User.js → WhatsApp + Full Saudi Delivery Ready (2025 Best Practice)

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
      select: false, // don't return password by default
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    // MAIN CONTACT — WhatsApp is primary in Saudi
    whatsapp: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      match: [/^\d{9,15}$/, "Please enter a valid WhatsApp number"],
      default: null,
    },

    // OPTIONAL PROFILE
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
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      default: null,
    },

    // SAUDI DELIVERY ADDRESS — Full & Real-World Ready
    address: { type: String, trim: true, default: "" },           // Street / Landmark
    building: { type: String, trim: true, default: "" },         // Building or Villa No.
    floor: { type: String, trim: true, default: "" },            // Floor number
    apartment: { type: String, trim: true, default: "" },        // Apartment / Office No.
    neighborhood: { type: String, trim: true, default: "" },     // District (e.g. Al Olaya)
    city: {
      type: String,
      type: String,
      trim: true,
      default: "Riyadh",
      enum: ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah", "Khobar", "Taif"],
    },
    pincode: { type: String, trim: true, default: "" },          // Saudi postal code

    // OPTIONAL EXTRAS
    notes: { type: String, trim: true, default: "" },            // e.g. "Near mosque"

    // USER SETTINGS
    notifications: { type: Boolean, default: true },
    locationAccess: { type: Boolean, default: true },
    preferredLanguage: { type: String, default: "en", enum: ["en", "ar"] },

    // PASSWORD RESET
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Indexes for performance
UserSchema.index({ username: 1 });
UserSchema.index({ whatsapp: 1 }, { sparse: true });
UserSchema.index({ email: 1 }, { sparse: true });
UserSchema.index({ pincode: 1 });
UserSchema.index({ city: 1, neighborhood: 1 });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;