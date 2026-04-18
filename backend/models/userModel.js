/**
 * User Model
 * Handles all database operations for the users table
 */
const { pool } = require('../config/db');

const UserModel = {
  // Find a user by their email address
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  // Find a user by their ID
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, account_type, preferences, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Create a new user
  async create(name, email, hashedPassword, accountType = 'customer') {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, account_type) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, accountType]
    );
    return result.insertId;
  },

  // Update user profile (name, email)
  async updateProfile(id, name, email) {
    await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
  },

  // Update user password
  async updatePassword(id, hashedPassword) {
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  },

  // Get user password hash (for verification during password change)
  async getPasswordHash(id) {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [id]);
    return rows[0] ? rows[0].password : null;
  },

  // Get user preferences
  async getPreferences(id) {
    const [rows] = await pool.query('SELECT preferences FROM users WHERE id = ?', [id]);
    return rows[0] ? rows[0].preferences : null;
  },

  // Update user preferences
  async updatePreferences(id, preferences) {
    await pool.query('UPDATE users SET preferences = ? WHERE id = ?', [JSON.stringify(preferences), id]);
  },
};

module.exports = UserModel;
