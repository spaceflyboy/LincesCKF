/**
 * Contact Routes
 * POST /api/contact — Submit a contact message or custom order
 */
const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');

router.post('/', ContactController.submitMessage);

module.exports = router;
