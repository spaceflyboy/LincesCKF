/**
 * Order Controller
 * Handles order placement and order history retrieval
 */
const OrderModel = require('../models/orderModel');
const CartModel = require('../models/cartModel');

const OrderController = {
  // POST /api/orders — Place a new order (creates from current cart)
  async placeOrder(req, res) {
    try {
      const userId = req.user.id;
      const { shippingInfo } = req.body;

      // Validate shipping info
      if (!shippingInfo || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zip) {
        return res.status(400).json({ error: 'Complete shipping information is required.' });
      }

      // Get cart items
      const cartItems = await CartModel.getItems(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty.' });
      }

      // Calculate total from the cart
      const total = await CartModel.getTotal(userId);

      // Format items for order creation
      const orderItems = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        selected_size: item.selected_size,
      }));

      // Create the order
      const orderId = await OrderModel.create(userId, total, shippingInfo, orderItems);

      // Clear the cart after successful order
      await CartModel.clearCart(userId);

      res.status(201).json({
        message: 'Order placed successfully',
        orderId,
      });
    } catch (error) {
      console.error('Place order error:', error);
      res.status(500).json({ error: 'Failed to place order.' });
    }
  },

  // GET /api/orders — Get order history for the authenticated user
  async getOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await OrderModel.getByUserId(userId);
      res.json({ orders });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders.' });
    }
  },

  // GET /api/orders/:id — Get a single order by ID
  async getOrderById(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const order = await OrderModel.getById(id, userId);

      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }

      res.json({ order });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ error: 'Failed to fetch order.' });
    }
  },
};

module.exports = OrderController;
