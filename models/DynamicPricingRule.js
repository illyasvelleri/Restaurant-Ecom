import mongoose from 'mongoose';

const DynamicPricingRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Rule name is required'],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // If null → applies to ALL products
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
      index: true,
    },

    type: {
      type: String,
      enum: [
        'happy-hour',
        'weekend',
        'surge',
        'low-demand',
        'promo',
        'seasonal',
      ],
      required: true,
      lowercase: true,
      trim: true,
    },

    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    increasePercentage: {
      type: Number,
      min: 0,
      default: 0,
    },

    startTime: {
      type: String,
      match: /^([0-1]?\d|2[0-3]):([0-5]\d)$/, // allows 9:00 and 09:00
    },

    endTime: {
      type: String,
      match: /^([0-1]?\d|2[0-3]):([0-5]\d)$/,
    },

    daysOfWeek: {
      type: [String],
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      set: (days) =>
        Array.isArray(days)
          ? days.map(
              (d) =>
                d.charAt(0).toUpperCase() +
                d.slice(1).toLowerCase()
            )
          : [],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },

    priority: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Prevent both discount and increase being applied at same time
 */
DynamicPricingRuleSchema.pre('validate', function (next) {
  if (this.discountPercentage > 0 && this.increasePercentage > 0) {
    return next(
      new Error('Cannot apply discount and increase at the same time')
    );
  }
  next();
});

export default mongoose.models.DynamicPricingRule ||
  mongoose.model('DynamicPricingRule', DynamicPricingRuleSchema);
