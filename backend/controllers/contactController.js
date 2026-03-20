const { parse } = require('csv-parse/sync');
const Contact = require('../models/Contact');
const Campaign = require('../models/Campaign');
const Invitation = require('../models/Invitation');

// GET /api/campaigns/:campaignId/contacts
exports.getContactsByCampaign = async (req, res) => {
  try {
    const contacts = await Contact.find({ campaign: req.params.campaignId }).sort({
      createdAt: -1,
    });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/campaigns/:campaignId/contacts/upload  (CSV bulk upload)
exports.bulkUploadContacts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const records = parse(req.file.buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (!records.length) {
      return res.status(400).json({ message: 'CSV file is empty or has no valid rows' });
    }

    const contacts = records
      .filter((r) => r.phone || r.Phone || r.PHONE)
      .map((r) => ({
        name: r.name || r.Name || r.NAME || '',
        phone: r.phone || r.Phone || r.PHONE,
        email: r.email || r.Email || r.EMAIL || '',
        campaign: campaign._id,
      }));

    if (!contacts.length) {
      return res.status(400).json({ message: 'No valid contacts found (phone column is required)' });
    }

    const inserted = await Contact.insertMany(contacts, { ordered: false });

    // Update campaign targetCount
    await Campaign.findByIdAndUpdate(campaign._id, {
      $inc: { targetCount: inserted.length },
    });

    // Create pending invitations for each contact
    const invitations = inserted.map((c) => ({
      campaign: campaign._id,
      contact: c._id,
      status: 'pending',
    }));
    await Invitation.insertMany(invitations, { ordered: false });

    res.status(201).json({ imported: inserted.length, contacts: inserted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/contacts/:id
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
