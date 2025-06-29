const express = require('express');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const router = express.Router();

// Configure Steam strategy
passport.use(new SteamStrategy({
  returnURL: `${process.env.BASE_URL}/api/auth/steam/return`,
  realm: process.env.BASE_URL,
  apiKey: process.env.STEAM_API_KEY
}, async (identifier, profile, done) => {
  try {
    const steamId = identifier.split('/').pop();
    
    let user = await User.findOne({ steamId });
    
    if (!user) {
      user = new User({
        steamId,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.photos[2].value, // Large avatar
        profileUrl: profile._json.profileurl
      });
      await user.save();
      logger.info(`New user registered: ${steamId}`);
    } else {
      // Update user info
      user.username = profile.username;
      user.displayName = profile.displayName;
      user.avatar = profile.photos[2].value;
      user.profileUrl = profile._json.profileurl;
      await user.save();
    }
    
    return done(null, user);
  } catch (error) {
    logger.error('Steam authentication error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Steam authentication routes
router.get('/steam', passport.authenticate('steam'));

router.get('/steam/return', 
  passport.authenticate('steam', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: req.user._id, steamId: req.user.steamId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    } catch (error) {
      logger.error('Error in Steam return:', error);
      res.redirect(`${process.env.CLIENT_URL}/auth/error`);
    }
  }
);

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-steamInventory');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;