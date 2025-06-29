# CSGO Skinfo Marketplace

A modern marketplace for CS2/CSGO skins with Steam integration, automated trading bots, and Stripe payments.

## Features

### Core Marketplace
- **Steam Authentication**: Login with Steam account
- **Inventory Integration**: Automatic inventory sync from Steam
- **Listing Management**: Create, edit, and manage skin listings
- **Advanced Search**: Filter by price, rarity, condition, weapon type
- **Real-time Updates**: Live notifications for trades and purchases

### Trading System
- **Automated Steam Bots**: Handle trade offers automatically
- **Trade Queue**: Efficient processing of multiple trades
- **Trade Validation**: Verify items and prevent fraud
- **Trade History**: Complete transaction records

### Payment System
- **Stripe Integration**: Secure payment processing
- **Wallet System**: Internal balance management
- **Deposit/Withdrawal**: Add funds via card, withdraw to PayPal/bank
- **Transaction History**: Complete financial records

### Security & Safety
- **JWT Authentication**: Secure API access
- **Rate Limiting**: Prevent abuse and spam
- **Input Validation**: Comprehensive data validation
- **Audit Logging**: Track all important actions

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **Passport.js** for Steam authentication
- **Stripe** for payment processing

### Steam Integration
- **steam-user**: Bot account management
- **steam-community**: Community features
- **steam-tradeoffer-manager**: Trade offer handling

### Security
- **Helmet.js**: Security headers
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT tokens
- **express-rate-limit**: Rate limiting

## Installation

### Prerequisites
- Node.js 16+ 
- MongoDB
- Steam API key
- Stripe account
- Steam bot accounts

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd csgo-marketplace
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Required Environment Variables**
```env
# Steam API Key (get from https://steamcommunity.com/dev/apikey)
STEAM_API_KEY=your-steam-api-key

# Steam Bot Credentials
STEAM_BOT_1_USERNAME=bot-username
STEAM_BOT_1_PASSWORD=bot-password
STEAM_BOT_1_SHARED_SECRET=shared-secret
STEAM_BOT_1_IDENTITY_SECRET=identity-secret

# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
MONGODB_URI=mongodb://localhost:27017/csgo-marketplace

# JWT Secrets
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## Steam Bot Setup

### Creating Bot Accounts

1. **Create Steam Account**
   - Create new Steam account for bot
   - Add CS2 to library (free to play)
   - Enable Steam Guard mobile authenticator

2. **Get Bot Credentials**
   - Username and password
   - Shared secret from mobile authenticator
   - Identity secret from mobile authenticator

3. **Configure Bot**
   - Add credentials to `.env` file
   - Ensure bot account has CS2 in library
   - Set bot profile to public

### Bot Security
- Use dedicated accounts only for trading
- Enable all Steam Guard features
- Regularly monitor bot activity
- Keep credentials secure

## API Endpoints

### Authentication
```
GET  /api/auth/steam          - Initiate Steam login
GET  /api/auth/steam/return   - Steam login callback
GET  /api/auth/me             - Get current user
POST /api/auth/logout         - Logout
```

### Marketplace
```
GET    /api/marketplace/listings           - Get all listings
GET    /api/marketplace/listings/:id       - Get single listing
POST   /api/marketplace/listings           - Create listing
PUT    /api/marketplace/listings/:id       - Update listing
DELETE /api/marketplace/listings/:id       - Cancel listing
POST   /api/marketplace/listings/:id/purchase - Purchase item
GET    /api/marketplace/my-listings        - Get user's listings
```

### Payments
```
POST /api/payments/create-payment-intent   - Create Stripe payment
POST /api/payments/webhook                 - Stripe webhook
GET  /api/payments/transactions            - Get transaction history
POST /api/payments/withdraw                - Request withdrawal
```

### Steam Integration
```
GET  /api/steam/inventory        - Get user inventory
POST /api/steam/trade-url        - Set trade URL
GET  /api/steam/trade-history    - Get trade history
```

## Database Schema

### User Model
```javascript
{
  steamId: String,
  username: String,
  displayName: String,
  avatar: String,
  tradeUrl: String,
  wallet: {
    balance: Number,
    pendingBalance: Number
  },
  steamInventory: [InventoryItem],
  reputation: {
    positive: Number,
    negative: Number,
    total: Number
  }
}
```

### Market Listing Model
```javascript
{
  seller: ObjectId,
  buyer: ObjectId,
  item: {
    assetId: String,
    name: String,
    marketName: String,
    iconUrl: String,
    rarity: String,
    exterior: String
  },
  price: Number,
  status: String, // active, sold, cancelled, pending_trade
  tradeOfferId: String
}
```

### Transaction Model
```javascript
{
  type: String, // deposit, withdrawal, purchase, sale, fee
  user: ObjectId,
  amount: Number,
  status: String, // pending, completed, failed
  stripePaymentIntentId: String,
  marketListing: ObjectId
}
```

## Trading Flow

1. **User Lists Item**
   - Item verified in Steam inventory
   - Listing created in database
   - Item marked as "listed" (not tradable to others)

2. **Buyer Purchases**
   - Funds deducted from buyer wallet
   - Listing status changed to "pending_trade"
   - Trade queued for bot processing

3. **Bot Processes Trade**
   - Bot sends trade offer to buyer
   - Trade offer includes seller's item
   - Buyer accepts trade offer

4. **Trade Completion**
   - Bot receives confirmation
   - Funds transferred to seller (minus fees)
   - Listing marked as "sold"
   - Transaction records created

## Payment Flow

1. **Deposit Funds**
   - User initiates deposit via Stripe
   - Payment intent created
   - User completes payment
   - Webhook confirms payment
   - Funds added to user wallet

2. **Purchase Item**
   - Funds deducted from wallet
   - Held in pending balance during trade
   - Released to seller on completion
   - Refunded on trade failure

3. **Withdrawal**
   - User requests withdrawal
   - Funds deducted from wallet
   - Manual processing (PayPal/bank transfer)
   - Transaction recorded

## Security Considerations

### API Security
- JWT tokens for authentication
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

### Trading Security
- Verify item ownership before listing
- Validate trade offers match expectations
- Monitor for suspicious activity
- Automatic trade offer validation
- Bot account isolation

### Payment Security
- Stripe handles all card processing
- No card data stored locally
- Webhook signature verification
- Transaction amount validation
- Fraud detection integration

## Monitoring & Logging

### Application Logs
- Winston logger with multiple transports
- Error tracking and alerting
- Performance monitoring
- Trade activity logging

### Key Metrics
- Active listings count
- Trade success rate
- Payment processing times
- User activity metrics
- Bot performance stats

## Deployment

### Production Setup
1. **Environment**
   - Use production MongoDB cluster
   - Configure Redis for caching
   - Set up SSL certificates
   - Configure reverse proxy (nginx)

2. **Steam Bots**
   - Deploy bots on separate servers
   - Monitor bot connectivity
   - Implement bot failover
   - Regular bot maintenance

3. **Monitoring**
   - Application performance monitoring
   - Database monitoring
   - Payment processing alerts
   - Trade failure notifications

### Scaling Considerations
- Horizontal scaling with load balancer
- Database sharding for large datasets
- Redis cluster for session storage
- Multiple bot instances for high volume
- CDN for static assets

## Contributing

1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create GitHub issue
- Check documentation
- Review API examples

## Disclaimer

This software is for educational purposes. Ensure compliance with:
- Steam Terms of Service
- Local gambling regulations
- Payment processing requirements
- Data protection laws

Always implement proper security measures and conduct thorough testing before production deployment.