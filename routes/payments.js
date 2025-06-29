const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

// Create payment intent for deposit
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    // Validate amount (minimum $1, maximum $500)
    if (amount < 100 || amount > 50000) {
      return res.status(400).json({ 
        error: 'Amount must be between $1.00 and $500.00' 
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId: req.user.id,
        type: 'wallet_deposit'
      }
    });

    // Create pending transaction
    await Transaction.create({
      type: 'deposit',
      user: req.user.id,
      amount: amount / 100, // Convert cents to dollars
      currency: currency.toUpperCase(),
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      description: `Wallet deposit of $${(amount / 100).toFixed(2)}`
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

async function handlePaymentSuccess(paymentIntent) {
  try {
    const transaction = await Transaction.findOne({
      stripePaymentIntentId: paymentIntent.id
    });

    if (!transaction) {
      logger.error(`Transaction not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update transaction status
    transaction.status = 'completed';
    await transaction.save();

    // Add funds to user wallet
    const user = await User.findById(transaction.user);
    if (user) {
      user.wallet.balance += transaction.amount;
      await user.save();

      logger.info(`Added $${transaction.amount} to user ${user.steamId} wallet`);
    }
  } catch (error) {
    logger.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent) {
  try {
    const transaction = await Transaction.findOne({
      stripePaymentIntentId: paymentIntent.id
    });

    if (transaction) {
      transaction.status = 'failed';
      await transaction.save();
    }

    logger.info(`Payment failed for intent: ${paymentIntent.id}`);
  } catch (error) {
    logger.error('Error handling payment failure:', error);
  }
}

// Get user's transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    const filter = { user: req.user.id };
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
      .populate('marketListing', 'item.marketName item.iconUrl')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Request withdrawal
router.post('/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);

    // Validate amount
    if (amount < 5 || amount > user.wallet.balance) {
      return res.status(400).json({ 
        error: 'Invalid withdrawal amount' 
      });
    }

    // Deduct from wallet
    user.wallet.balance -= amount;
    await user.save();

    // Create withdrawal transaction
    await Transaction.create({
      type: 'withdrawal',
      user: req.user.id,
      amount: -amount,
      status: 'pending',
      description: `Withdrawal request of $${amount.toFixed(2)}`
    });

    // In a real implementation, you would process the withdrawal
    // This could involve PayPal, bank transfer, etc.

    res.json({ 
      message: 'Withdrawal request submitted',
      newBalance: user.wallet.balance 
    });
  } catch (error) {
    logger.error('Error processing withdrawal:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

module.exports = router;