const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  steamId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  profileUrl: {
    type: String,
    required: true
  },
  tradeUrl: {
    type: String,
    default: null
  },
  wallet: {
    balance: {
      type: Number,
      default: 0,
      min: 0
    },
    pendingBalance: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  steamInventory: [{
    assetId: String,
    classId: String,
    instanceId: String,
    name: String,
    marketName: String,
    iconUrl: String,
    tradable: Boolean,
    marketable: Boolean,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  reputation: {
    positive: {
      type: Number,
      default: 0
    },
    negative: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      browser: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showInventory: {
        type: Boolean,
        default: true
      },
      showTradeHistory: {
        type: Boolean,
        default: false
      }
    }
  }
}, {
  timestamps: true
});

// Virtual for reputation percentage
userSchema.virtual('reputationPercentage').get(function() {
  if (this.reputation.total === 0) return 100;
  return Math.round((this.reputation.positive / this.reputation.total) * 100);
});

// Method to update inventory from Steam
userSchema.methods.updateInventory = async function(steamInventory) {
  this.steamInventory = steamInventory.map(item => ({
    assetId: item.assetid,
    classId: item.classid,
    instanceId: item.instanceid,
    name: item.name,
    marketName: item.market_name,
    iconUrl: item.icon_url,
    tradable: item.tradable === 1,
    marketable: item.marketable === 1,
    lastUpdated: new Date()
  }));
  
  await this.save();
};

module.exports = mongoose.model('User', userSchema);