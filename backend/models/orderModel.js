/**
 * Order Model
 * Handles all database operations for orders and order_items tables
 */
const { pool } = require('../config/db');

const OrderModel = {
  // Create a new order with items
  async create(userId, totalPrice, shippingInfo, items) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert the order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (user_id, total_price, shipping_address, shipping_city, shipping_state, shipping_zip)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, totalPrice, shippingInfo.address, shippingInfo.city, shippingInfo.state, shippingInfo.zip]
      );
      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price, selected_size)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price, item.selected_size || null]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get all orders for a user
  async getByUserId(userId) {
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    // Fetch items for each order
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, p.name_en, p.name_es, p.image
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return orders;
  },

  // Get a single order by ID
  async getById(orderId, userId) {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );
    if (!orders[0]) return null;

    const order = orders[0];
    const [items] = await pool.query(
      `SELECT oi.*, p.name_en, p.name_es, p.image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );
    order.items = items;

    return order;
  },
};

module.exports = OrderModel;
