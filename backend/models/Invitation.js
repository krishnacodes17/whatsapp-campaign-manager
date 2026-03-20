const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'accepted', 'declined', 'failed'],
      default: 'pending',
    },
    sentAt: {
      type: Date,
      default: null,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invitation', invitationSchema);
