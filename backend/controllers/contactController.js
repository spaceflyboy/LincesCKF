/**
 * Contact Controller
 * Handles contact form and custom order submissions
 */
const ContactModel = require('../models/contactModel');

const ContactController = {
  // POST /api/contact — Submit a contact form or custom order
  async submitMessage(req, res) {
    try {
      const { name, email, subject, message, type } = req.body;

      // Validate required fields
      if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
      }

      const messageId = await ContactModel.create(
        name || 'Anonymous',
        email || '',
        subject || '',
        message,
        type || 'contact'
      );

      res.status(201).json({
        message: 'Message sent successfully',
        id: messageId,
      });
    } catch (error) {
      console.error('Contact submit error:', error);
      res.status(500).json({ error: 'Failed to send message.' });
    }
  },
};

module.exports = ContactController;
