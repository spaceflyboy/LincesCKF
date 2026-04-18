/**
 * Category Model
 * Handles all database operations for the categories table
 */
const { pool } = require('../config/db');

const CategoryModel = {
  // Get all categories
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    return rows;
  },

  // Get a single category by ID
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
  },
};

module.exports = CategoryModel;
