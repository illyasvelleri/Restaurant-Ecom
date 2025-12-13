// models/Setting.js → FINAL 2025 (FULLY WORKING WITH CURRENCY)

import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  profile: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  restaurant: {
    name: { type: String, default: 'My Restaurant' },
    description: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    address: { type: String, default: '' },
    website: { type: String, default: '' },
    timezone: { type: String, default: 'Asia/Riyadh' },
    currency: {
      type: String,
      enum: ['SAR', 'AED', 'USD', 'EUR', 'INR'],
      default: 'SAR'
    }
  },
  notifications: {
    type: Map,
    of: Boolean,
    default: () => ({
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      orderNotifications: true,
      customerNotifications: true,
      inventoryAlerts: true,
      reportEmails: true
    })
  },
  delivery: {
    deliveryEnabled: { type: Boolean, default: true },
    deliveryRadius: { type: String, default: '10' },
    deliveryFee: { type: String, default: '20.00' },
    minOrderAmount: { type: String, default: '50.00' },
    estimatedTime: { type: String, default: '30-45' }
  }
}, { 
  timestamps: true,
  collection: 'settings'
});

// Prevent model overwrite in development
export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);