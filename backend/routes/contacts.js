const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const {
  getContactsByCampaign,
  bulkUploadContacts,
  deleteContact,
} = require('../controllers/contactController');

// Store file in memory so we can parse the buffer
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getContactsByCampaign);
router.post('/upload', upload.single('file'), bulkUploadContacts);
router.delete('/:id', deleteContact);

module.exports = router;
