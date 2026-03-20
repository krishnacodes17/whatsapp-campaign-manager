require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const campaignRoutes = require('./routes/campaigns');
const contactRoutes = require('./routes/contacts');
const contactsStandaloneRoutes = require('./routes/contactsStandalone');
const invitationRoutes = require('./routes/invitations');

const app = express();

app.use(cors());
app.use(express.json());

// Rate limiting: max 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/campaigns/:campaignId/contacts', contactRoutes);
app.use('/api/campaigns/:campaignId/invitations', invitationRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/contacts', contactsStandaloneRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp_campaign_manager';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
