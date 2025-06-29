const Joi = require('joi');

const validateListing = (req, res, next) => {
  const schema = Joi.object({
    assetId: Joi.string().required(),
    classId: Joi.string().required(),
    instanceId: Joi.string().allow(''),
    name: Joi.string().required(),
    marketName: Joi.string().required(),
    iconUrl: Joi.string().uri().required(),
    price: Joi.number().min(0.01).max(10000).required(),
    description: Joi.string().max(500).allow(''),
    autoAccept: Joi.boolean().default(false)
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.details[0].message 
    });
  }

  next();
};

const validatePurchase = (req, res, next) => {
  // Add any purchase validation logic here
  next();
};

const validateTradeUrl = (req, res, next) => {
  const schema = Joi.object({
    tradeUrl: Joi.string().pattern(/^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[a-zA-Z0-9_-]+$/).required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      error: 'Invalid trade URL format' 
    });
  }

  next();
};

module.exports = {
  validateListing,
  validatePurchase,
  validateTradeUrl
};