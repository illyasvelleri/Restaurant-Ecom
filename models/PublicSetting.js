// models/PublicSetting.js
//public-safe fields to fethc and display front end of web about restaurant
import mongoose from 'mongoose';

const publicSettingSchema = new mongoose.Schema({
  restaurantName:      { type: String, default: 'My Restaurant' },
  restaurantDescription: { type: String, default: '' },
  logo:                { type: String, default: '' },           // public URL
  address:             { type: String, default: '' },
  phone:               { type: String, default: '' },
  whatsapp:            { type: String, default: '' },
  email:               { type: String, default: '' },
  facebook:            { type: String, default: '' },
  instagram:           { type: String, default: '' },
  twitter:             { type: String, default: '' },          // or x.com
  workingHours:        { type: String, default: 'Daily: 11:00 AM – 11:00 PM' },
  currency:            { type: String, default: 'SAR' },
  // You can add more public-safe fields later (hero title, announcement bar text, etc)
}, {
  timestamps: true,
  collection: 'publicSettings'
});

export default mongoose.models.PublicSetting || mongoose.model('PublicSetting', publicSettingSchema);