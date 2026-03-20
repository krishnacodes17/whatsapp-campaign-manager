const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getInvitationsByCampaign,
  getAllInvitations,
  updateInvitationStatus,
  getStats,
} = require('../controllers/invitationController');

// Standalone invitation routes (mounted at /api/invitations)
router.get('/', getAllInvitations);
router.get('/stats', getStats);
router.patch('/:id', updateInvitationStatus);

// Per-campaign route (mounted at /api/campaigns/:campaignId/invitations)
router.get('/by-campaign', getInvitationsByCampaign);

module.exports = router;
