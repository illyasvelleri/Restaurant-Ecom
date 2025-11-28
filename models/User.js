// models/User.js → ENGLISH + FULL SAUDI DELIVERY FIELDS

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },

    // BASIC PROFILE
    name: { type: String, default: function () { return this.username; }, trim: true },
    email: { type: String, lowercase: true, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },

    // SAUDI DELIVERY ADDRESS (MANDATORY FOR CHECKOUT)
    address: { type: String, trim: true, default: "" },
    building: { type: String, trim: true, default: "" },        // Building / Villa
    floor: { type: String, trim: true, default: "" },           // Floor
    apartment: { type: String, trim: true, default: "" },       // Apartment No.
    pincode: { type: String, trim: true, default: "" },         // Postal Code
    city: { type: String, trim: true, default: "Riyadh" },
    neighborhood: { type: String, trim: true, default: "" },    // District / Area

    // SETTINGS
    notifications: { type: Boolean, default: true },
    locationAccess: { type: Boolean, default: true },

    // PASSWORD RESET
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    strict: false
  }
);

UserSchema.index({ email: 1 }, { sparse: true });
UserSchema.index({ phone: 1 }, { sparse: true });
UserSchema.index({ pincode: 1 }, { sparse: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;