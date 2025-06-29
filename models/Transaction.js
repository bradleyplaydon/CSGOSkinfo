const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'purchase', 'sale', 'fee'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  stripePaymentIntentId: String,
  marketListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketListing'
  },
  description: String,
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Index for user transactions
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ status: 1, type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);