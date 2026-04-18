/**
 * Message Model
 * Handles all database operations for the messages table (Socket.IO chat)
 */
const { pool } = require('../config/db');

const MessageModel = {
  // Save a new chat message
  async create(senderId, senderName, message) {
    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, sender_name, message) VALUES (?, ?, ?)',
      [senderId, senderName, message]
    );
    return result.insertId;
  },

  // Get recent chat history (last N messages)
  async getRecent(limit = 50) {
    const [rows] = await pool.query(
      'SELECT * FROM messages ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    // Return in chronological order
    return rows.reverse();
  },
};

module.exports = MessageModel;
