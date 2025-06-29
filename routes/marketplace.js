const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const MarketListing = require('../models/MarketListing');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { validateListing, validatePurchase } = require('../middleware/validation');
const logger = require('../utils/logger');

// Get all market listings with filters and pagination
router.get('/listings', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      minPrice,
      maxPrice,
      rarity,
      exterior,
      weapon,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { status: 'active' };

    // Apply search filter
    if (search) {
      filter.$or = [
        { 'item.marketName': { $regex: search, $options: 'i' } },
        { 'item.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Apply price filters
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Apply other filters
    if (rarity) filter['item.rarity'] = rarity;
    if (exterior) filter['item.exterior'] = exterior;
    if (weapon) filter['item.weapon'] = weapon;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const listings = await MarketListing.find(filter)
      .populate('seller', 'username displayName avatar reputation')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await MarketListing.countDocuments(filter);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    logger.error('Error fetching market listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Get single listing
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await MarketListing.findById(req.params.id)
      .populate('seller', 'username displayName avatar reputation steamId');

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Increment view count
    listing.views += 1;
    await listing.save();

    res.json(listing);
  } catch (error) {
    logger.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// Create new listing
router.post('/listings', authenticateToken, validateListing, async (req, res) => {
  try {
    const {
      assetId,
      classId,
      instanceId,
      name,
      marketName,
      iconUrl,
      price,
      description,
      autoAccept
    } = req.body;

    // Verify user owns the item
    const user = await User.findById(req.user.id);
    const item = user.steamInventory.find(item => item.assetId === assetId);

    if (!item) {
      return res.status(400).json({ error: 'Item not found in inventory' });
    }

    if (!item.tradable) {
      return res.status(400).json({ error: 'Item is not tradable' });
    }

    // Check if item is already listed
    const existingListing = await MarketListing.findOne({
      'item.assetId': assetId,
      seller: req.user.id,
      status: { $in: ['active', 'pending_trade'] }
    });

    if (existingListing) {
      return res.status(400).json({ error: 'Item is already listed' });
    }

    const listing = new MarketListing({
      seller: req.user.id,
      item: {
        assetId,
        classId,
        instanceId,
        name,
        marketName,
        iconUrl,
        // Additional item data would be parsed from Steam API
      },
      price: parseFloat(price),
      description,
      autoAccept: autoAccept || false
    });

    await listing.save();

    const populatedListing = await MarketListing.findById(listing._id)
      .populate('seller', 'username displayName avatar');

    res.status(201).json(populatedListing);
  } catch (error) {
    logger.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Purchase item
router.post('/listings/:id/purchase', authenticateToken, validatePurchase, async (req, res) => {
  try {
    const listing = await MarketListing.findById(req.params.id)
      .populate('seller');

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({ error: 'Listing is not available' });
    }

    if (listing.seller._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot purchase your own item' });
    }

    const buyer = await User.findById(req.user.id);

    // Check buyer has sufficient funds
    if (buyer.wallet.balance < listing.price) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Check buyer has valid trade URL
    if (!buyer.tradeUrl) {
      return res.status(400).json({ error: 'Trade URL not set' });
    }

    // Update listing
    listing.status = 'pending_trade';
    listing.buyer = req.user.id;
    await listing.save();

    // Deduct funds from buyer (hold in pending)
    buyer.wallet.balance -= listing.price;
    buyer.wallet.pendingBalance += listing.price;
    await buyer.save();

    // Queue trade with Steam bot
    const tradeData = {
      listingId: listing._id,
      partnerSteamId: buyer.steamId,
      tradeUrl: buyer.tradeUrl,
      itemsToGive: [{ assetid: listing.item.assetId, appid: 730, contextid: 2 }],
      itemsToReceive: [],
      message: `CSGO Skinfo Marketplace - Purchase of ${listing.item.marketName}`
    };

    req.steamBotManager.queueTrade(tradeData);

    // Create pending transaction
    await Transaction.create({
      type: 'purchase',
      user: req.user.id,
      amount: -listing.price,
      marketListing: listing._id,
      status: 'pending',
      description: `Purchase of ${listing.item.marketName}`
    });

    res.json({ 
      message: 'Purchase initiated, trade offer will be sent shortly',
      listing 
    });
  } catch (error) {
    logger.error('Error purchasing item:', error);
    res.status(500).json({ error: 'Failed to purchase item' });
  }
});

// Get user's listings
router.get('/my-listings', authenticateToken, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;
    
    const filter = { seller: req.user.id };
    if (status !== 'all') {
      filter.status = status;
    }

    const listings = await MarketListing.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await MarketListing.countDocuments(filter);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    logger.error('Error fetching user listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Update listing
router.put('/listings/:id', authenticateToken, async (req, res) => {
  try {
    const { price, description, autoAccept } = req.body;
    
    const listing = await MarketListing.findOne({
      _id: req.params.id,
      seller: req.user.id,
      status: 'active'
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found or not editable' });
    }

    if (price !== undefined) listing.price = parseFloat(price);
    if (description !== undefined) listing.description = description;
    if (autoAccept !== undefined) listing.autoAccept = autoAccept;

    await listing.save();

    res.json(listing);
  } catch (error) {
    logger.error('Error updating listing:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Cancel listing
router.delete('/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await MarketListing.findOne({
      _id: req.params.id,
      seller: req.user.id,
      status: { $in: ['active', 'pending_trade'] }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found or cannot be cancelled' });
    }

    listing.status = 'cancelled';
    await listing.save();

    // If there was a pending purchase, refund the buyer
    if (listing.buyer) {
      const buyer = await User.findById(listing.buyer);
      if (buyer) {
        buyer.wallet.balance += listing.price;
        buyer.wallet.pendingBalance -= listing.price;
        await buyer.save();
      }
    }

    res.json({ message: 'Listing cancelled successfully' });
  } catch (error) {
    logger.error('Error cancelling listing:', error);
    res.status(500).json({ error: 'Failed to cancel listing' });
  }
});

module.exports = router;