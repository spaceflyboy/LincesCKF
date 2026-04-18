/**
 * Review Model
 * Handles all database operations for the reviews table
 */
const { pool } = require('../config/db');

const ReviewModel = {
  // Get all reviews for a product
  async getByProductId(productId) {
    const [rows] = await pool.query(
      'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );
    return rows;
  },

  // Create a new review
  async create(userId, productId, author, rating, comment) {
    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, product_id, author, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [userId, productId, author, rating, comment]
    );
    return result.insertId;
  },

  // Get average rating for a product
  async getAverageRating(productId) {
    const [rows] = await pool.query(
      'SELECT AVG(rating) AS avg_rating, COUNT(*) AS count FROM reviews WHERE product_id = ?',
      [productId]
    );
    return {
      avgRating: rows[0].avg_rating ? parseFloat(rows[0].avg_rating) : 0,
      count: rows[0].count,
    };
  },
};

module.exports = ReviewModel;
