const Invitation = require('../models/Invitation');
const Campaign = require('../models/Campaign');

// GET /api/campaigns/:campaignId/invitations
exports.getInvitationsByCampaign = async (req, res) => {
  try {
    const invitations = await Invitation.find({ campaign: req.params.campaignId })
      .populate('contact', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(invitations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/invitations  (all, with optional status filter)
exports.getAllInvitations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.campaign) filter.campaign = req.query.campaign;

    const invitations = await Invitation.find(filter)
      .populate('contact', 'name phone email')
      .populate('campaign', 'name')
      .sort({ createdAt: -1 });
    res.json(invitations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/invitations/:id  (update status)
exports.updateInvitationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'sent', 'accepted', 'declined', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const update = { status };
    if (status === 'sent') update.sentAt = new Date();
    if (status === 'accepted' || status === 'declined') update.respondedAt = new Date();

    const invitation = await Invitation.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).populate('contact', 'name phone email');

    if (!invitation) return res.status(404).json({ message: 'Invitation not found' });

    // Sync campaign counters
    const campaignId = invitation.campaign;
    const [sentCount, acceptedCount] = await Promise.all([
      Invitation.countDocuments({ campaign: campaignId, status: 'sent' }),
      Invitation.countDocuments({ campaign: campaignId, status: 'accepted' }),
    ]);
    await Campaign.findByIdAndUpdate(campaignId, { sentCount, acceptedCount });

    res.json(invitation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/invitations/stats
exports.getStats = async (req, res) => {
  try {
    const [total, pending, sent, accepted, declined, failed] = await Promise.all([
      Invitation.countDocuments(),
      Invitation.countDocuments({ status: 'pending' }),
      Invitation.countDocuments({ status: 'sent' }),
      Invitation.countDocuments({ status: 'accepted' }),
      Invitation.countDocuments({ status: 'declined' }),
      Invitation.countDocuments({ status: 'failed' }),
    ]);
    res.json({ total, pending, sent, accepted, declined, failed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
