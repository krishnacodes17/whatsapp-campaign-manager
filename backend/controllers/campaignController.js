const Campaign = require('../models/Campaign');

// GET /api/campaigns
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/campaigns/:id
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/campaigns
exports.createCampaign = async (req, res) => {
  try {
    const { name, description, groupLink, status } = req.body;
    const campaign = new Campaign({ name, description, groupLink, status });
    const saved = await campaign.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/campaigns/:id
exports.updateCampaign = async (req, res) => {
  try {
    const { name, description, groupLink, status, sentCount, acceptedCount, targetCount } =
      req.body;
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { name, description, groupLink, status, sentCount, acceptedCount, targetCount },
      { new: true, runValidators: true }
    );
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/campaigns/:id
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
