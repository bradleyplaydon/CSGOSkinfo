const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const MarketListing = require('../models/MarketListing');
const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

// Get user profile
router.get('/profile/:steamId', async (req, res) => {
  try {
    const { steamId } = req.params;
    
    const user = await User.findOne({ steamId })
      .select('steamId username displayName avatar reputation createdAt settings.privacy');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's active listings count
    const activeListings = await MarketListing.countDocuments({
      seller: user._id,
      status: 'active'
    });

    // Get user's completed sales count
    const completedSales = await MarketListing.countDocuments({
      seller: user._id,
      status: 'sold'
    });

    const profile = {
      steamId: user.steamId,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      reputation: user.reputation,
      reputationPercentage: user.reputationPercentage,
      memberSince: user.createdAt,
      activeListings,
      completedSales
    };

    res.json(profile);
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get user's public listings
router.get('/profile/:steamId/listings', async (req, res) => {
  try {
    const { steamId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findOne({ steamId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const listings = await MarketListing.find({
      seller: user._id,
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const total = await MarketListing.countDocuments({
      seller: user._id,
      status: 'active'
    });

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    logger.error('Error fetching user listings:', error);
    res.status(500).json({ error: 'Failed to fetch user listings' });
  }
});

// Update user settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { notifications, privacy } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (notifications) {
      user.settings.notifications = { ...user.settings.notifications, ...notifications };
    }

    if (privacy) {
      user.settings.privacy = { ...user.settings.privacy, ...privacy };
    }

    await user.save();

    res.json({ 
      message: 'Settings updated successfully',
      settings: user.settings 
    });
  } catch (error) {
    logger.error('Error updating user settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get user's wallet information
router.get('/wallet', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wallet');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.wallet);
  } catch (error) {
    logger.error('Error fetching wallet:', error);
    res.status(500).json({ error: 'Failed to fetch wallet information' });
  }
});

// Admin: Get all users
router.get('/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, search, status } = req.query;
    
    const filter = {};
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { steamId: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'banned') {
      filter.isBanned = true;
    } else if (status === 'active') {
      filter.isBanned = false;
    }

    const users = await User.find(filter)
      .select('steamId username displayName avatar wallet.balance reputation isBanned isAdmin createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Admin: Ban/unban user
router.put('/admin/users/:id/ban', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { banned, reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isBanned = banned;
    await user.save();

    // Cancel all active listings if banned
    if (banned) {
      await MarketListing.updateMany(
        { seller: id, status: 'active' },
        { status: 'cancelled' }
      );
    }

    logger.info(`User ${user.steamId} ${banned ? 'banned' : 'unbanned'} by admin`, {
      adminId: req.user.id,
      reason
    });

    res.json({ 
      message: `User ${banned ? 'banned' : 'unbanned'} successfully`,
      user: {
        id: user._id,
        steamId: user.steamId,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    logger.error('Error updating user ban status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Admin: Get user details
router.get('/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's recent transactions
    const recentTransactions = await Transaction.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('marketListing', 'item.marketName');

    // Get user's listings stats
    const listingsStats = await MarketListing.aggregate([
      { $match: { seller: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' }
        }
      }
    ]);

    res.json({
      user,
      recentTransactions,
      listingsStats
    });
  } catch (error) {
    logger.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

module.exports = router;