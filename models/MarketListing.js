const mongoose = require('mongoose');

const marketListingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    assetId: {
      type: String,
      required: true
    },
    classId: {
      type: String,
      required: true
    },
    instanceId: String,
    name: {
      type: String,
      required: true
    },
    marketName: {
      type: String,
      required: true
    },
    iconUrl: String,
    exterior: String,
    rarity: String,
    type: String,
    weapon: String,
    skin: String,
    stattrak: {
      type: Boolean,
      default: false
    },
    souvenir: {
      type: Boolean,
      default: false
    },
    float: Number,
    inspectUrl: String
  },
  price: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP']
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'cancelled', 'pending_trade'],
    default: 'active'
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  tradeOfferId: {
    type: String,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  autoAccept: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: 500
  },
  tags: [String],
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

// Index for efficient searching
marketListingSchema.index({ status: 1, price: 1 });
marketListingSchema.index({ 'item.marketName': 'text', 'item.name': 'text' });
marketListingSchema.index({ seller: 1, status: 1 });
marketListingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for item condition/exterior
marketListingSchema.virtual('condition').get(function() {
  if (this.item.exterior) return this.item.exterior;
  if (this.item.float) {
    if (this.item.float <= 0.07) return 'Factory New';
    if (this.item.float <= 0.15) return 'Minimal Wear';
    if (this.item.float <= 0.38) return 'Field-Tested';
    if (this.item.float <= 0.45) return 'Well-Worn';
    return 'Battle-Scarred';
  }
  return 'Unknown';
});

module.exports = mongoose.model('MarketListing', marketListingSchema);