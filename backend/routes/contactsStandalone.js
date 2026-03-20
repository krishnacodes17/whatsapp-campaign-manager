const express = require('express');
const router = express.Router();
const { deleteContact } = require('../controllers/contactController');

router.delete('/:id', deleteContact);

module.exports = router;
