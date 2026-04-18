/**
 * Cart Controller
 * Handles cart operations: get, add, update, remove
 * All operations require authentication
 */
const CartModel = require('../models/cartModel');

const CartController = {
  // GET /api/cart — Get the authenticated user's cart
  async getCart(req, res) {
    try {
      const userId = req.user.id;
      const items = await CartModel.getItems(userId);
      const total = await CartModel.getTotal(userId);

      res.json({ items, total });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ error: 'Failed to fetch cart.' });
    }
  },

  // POST /api/cart/add — Add an item to the cart
  async addItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity, selectedSize } = req.body;

      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required.' });
      }

      await CartModel.addItem(userId, productId, quantity || 1, selectedSize || null);
      const items = await CartModel.getItems(userId);
      const total = await CartModel.getTotal(userId);

      res.json({ message: 'Item added to cart', items, total });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ error: 'Failed to add item to cart.' });
    }
  },

  // PUT /api/cart/update — Update item quantity in the cart
  async updateItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      if (!productId || quantity === undefined) {
        return res.status(400).json({ error: 'Product ID and quantity are required.' });
      }

      await CartModel.updateQuantity(userId, productId, quantity);
      const items = await CartModel.getItems(userId);
      const total = await CartModel.getTotal(userId);

      res.json({ message: 'Cart updated', items, total });
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(500).json({ error: 'Failed to update cart.' });
    }
  },

  // DELETE /api/cart/remove — Remove an item from the cart
  async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required.' });
      }

      await CartModel.removeItem(userId, productId);
      const items = await CartModel.getItems(userId);
      const total = await CartModel.getTotal(userId);

      res.json({ message: 'Item removed from cart', items, total });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({ error: 'Failed to remove item from cart.' });
    }
  },
};

module.exports = CartController;
