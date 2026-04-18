/**
 * Cart Model
 * Handles all database operations for the cart and cart_items tables
 * Each user has exactly one cart
 */
const { pool } = require('../config/db');

const CartModel = {
  // Get or create a cart for a user
  async getOrCreateCart(userId) {
    // Check if cart exists
    const [existing] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (existing.length > 0) {
      return existing[0].id;
    }
    // Create new cart
    const [result] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
    return result.insertId;
  },

  // Get all items in a user's cart with product details
  async getItems(userId) {
    const [rows] = await pool.query(
      `SELECT ci.id AS cart_item_id, ci.quantity, ci.selected_size,
              p.id AS product_id, p.name_en, p.name_es, p.description_en, p.description_es,
              p.price, p.image, p.sizes, c.name AS category
       FROM cart
       JOIN cart_items ci ON ci.cart_id = cart.id
       JOIN products p ON ci.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       WHERE cart.user_id = ?`,
      [userId]
    );

    return rows.map((row) => ({
      ...row,
      sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes,
    }));
  },

  // Add an item to the cart
  async addItem(userId, productId, quantity = 1, selectedSize = null) {
    const cartId = await this.getOrCreateCart(userId);

    // Check if item already exists in cart
    const [existing] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existing.length > 0) {
      // Update quantity if item already in cart
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
      return existing[0].id;
    }

    // Insert new item
    const [result] = await pool.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity, selected_size) VALUES (?, ?, ?, ?)',
      [cartId, productId, quantity, selectedSize]
    );
    return result.insertId;
  },

  // Update item quantity
  async updateQuantity(userId, productId, quantity) {
    const cartId = await this.getOrCreateCart(userId);

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await pool.query(
        'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
        [cartId, productId]
      );
      return;
    }

    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
      [quantity, cartId, productId]
    );
  },

  // Remove an item from the cart
  async removeItem(userId, productId) {
    const cartId = await this.getOrCreateCart(userId);
    await pool.query(
      'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
  },

  // Clear all items from the cart
  async clearCart(userId) {
    const [cart] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (cart.length > 0) {
      await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);
    }
  },

  // Calculate the total price of all items in the cart
  async getTotal(userId) {
    const [result] = await pool.query(
      `SELECT SUM(ci.quantity * p.price) AS total
       FROM cart
       JOIN cart_items ci ON ci.cart_id = cart.id
       JOIN products p ON ci.product_id = p.id
       WHERE cart.user_id = ?`,
      [userId]
    );
    return result[0].total || 0;
  },
};

module.exports = CartModel;
