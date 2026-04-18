/**
 * Contact Model
 * Handles all database operations for the contact_messages table
 */
const { pool } = require('../config/db');

const ContactModel = {
  // Create a new contact message
  async create(name, email, subject, message, type = 'contact') {
    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message, type) VALUES (?, ?, ?, ?, ?)',
      [name, email, subject, message, type]
    );
    return result.insertId;
  },

  // Get all contact messages (for admin use)
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return rows;
  },
};

module.exports = ContactModel;
