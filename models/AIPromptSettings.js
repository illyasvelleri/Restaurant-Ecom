// models/AIPromptSettings.js
import mongoose from 'mongoose';

const promptVersionSchema = new mongoose.Schema({
  version: {
    type: Number,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

const dailyMetricsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  totalRecommendations: {
    type: Number,
    default: 0
  },
  totalClicks: {
    type: Number,
    default: 0
  },
  totalAddedToCart: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  }
});

const aiPromptSettingsSchema = new mongoose.Schema({
  // No restaurantId anymore – global/single document

  isEnabled: {
    type: Boolean,
    default: true
  },

  // Active Prompt
  currentPrompt: {
    type: String,
    required: true
  },

  currentVersion: {
    type: Number,
    default: 1
  },

  // Version History
  versions: [promptVersionSchema],

  // Basic Performance Tracking
  performance: {
    totalRecommendations: { type: Number, default: 0 },
    totalClicks: { type: Number, default: 0 },
    totalAddedToCart: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    lastCalculated: { type: Date, default: Date.now }
  },

  // Daily Metrics (last 90 days)
  dailyMetrics: [dailyMetricsSchema],

  // Metadata
  lastModifiedBy: {
    type: String,
    required: true
  },

  lastModifiedAt: {
    type: Date,
    default: Date.now
  },

  createdBy: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes (no restaurantId index needed)
aiPromptSettingsSchema.index({ 'dailyMetrics.date': 1 });
aiPromptSettingsSchema.index({ lastModifiedAt: -1 });

// Methods – unchanged
aiPromptSettingsSchema.methods.addVersion = function(prompt, createdBy, notes = '') {
  const newVersion = this.currentVersion + 1;
  
  // Deactivate all previous versions
  this.versions.forEach(v => v.isActive = false);
  
  // Add new version
  this.versions.push({
    version: newVersion,
    prompt,
    createdBy,
    notes,
    isActive: true
  });
  
  this.currentPrompt = prompt;
  this.currentVersion = newVersion;
  this.lastModifiedBy = createdBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

aiPromptSettingsSchema.methods.rollbackToVersion = function(versionNumber, rolledBackBy) {
  const version = this.versions.find(v => v.version === versionNumber);
  
  if (!version) {
    throw new Error(`Version ${versionNumber} not found`);
  }
  
  // Deactivate all versions
  this.versions.forEach(v => v.isActive = false);
  
  // Activate selected version
  version.isActive = true;
  
  this.currentPrompt = version.prompt;
  this.currentVersion = versionNumber;
  this.lastModifiedBy = rolledBackBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

aiPromptSettingsSchema.methods.trackRecommendation = function(clicked = false, added = false, revenue = 0) {
  this.performance.totalRecommendations += 1;
  if (clicked) this.performance.totalClicks += 1;
  if (added) {
    this.performance.totalAddedToCart += 1;
    this.performance.totalRevenue += revenue;
  }
  
  this.performance.lastCalculated = new Date();
  
  return this.save();
};

aiPromptSettingsSchema.methods.addDailyMetric = function(data) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingMetric = this.dailyMetrics.find(
    m => m.date.getTime() === today.getTime()
  );
  
  if (existingMetric) {
    Object.assign(existingMetric, data);
  } else {
    this.dailyMetrics.push({
      date: today,
      ...data
    });
  }
  
  // Keep only last 90 days
  if (this.dailyMetrics.length > 90) {
    this.dailyMetrics = this.dailyMetrics.slice(-90);
  }
  
  return this.save();
};

// Statics – simplified (no restaurantId filter)
aiPromptSettingsSchema.statics.getCurrent = function() {
  return this.findOne().sort({ createdAt: -1 }); // latest/first document
};

aiPromptSettingsSchema.statics.createDefault = async function(createdBy) {
  const defaultPrompt = `You are an expert restaurant recommendation system. 
Analyze the current cart items, time of day, day of week, and suggest 3-5 relevant cross-sell or upsell items that complement the order.
Return only JSON array with objects containing:
- _id (product ID from database)
- name
- price
- reason (short explanation, max 60 characters)
- badge (optional: TRENDING, POPULAR, PERFECT PAIR, NEW)
- type (cross-sell or upsell)

Focus on items NOT already in cart. Prioritize high-margin, popular, or complementary products.`;

  const doc = await this.create({
    currentPrompt: defaultPrompt,
    currentVersion: 1,
    versions: [{
      version: 1,
      prompt: defaultPrompt,
      createdBy,
      notes: 'Initial default prompt for cross-sell & upsell',
      isActive: true
    }],
    createdBy,
    lastModifiedBy: createdBy
  });

  return doc;
};

// Pre-save middleware
aiPromptSettingsSchema.pre('save', function(next) {
  this.lastModifiedAt = new Date();
  next();
});

const AIPromptSettings = mongoose.models.AIPromptSettings || 
  mongoose.model('AIPromptSettings', aiPromptSettingsSchema);

export default AIPromptSettings;