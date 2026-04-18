/**
 * Order Routes
 * GET  /api/orders     — Get user's order history
 * POST /api/orders     — Place a new order
 * GET  /api/orders/:id — Get a specific order
 * All routes require authentication
 */
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, OrderController.getOrders);
router.post('/', authenticate, OrderController.placeOrder);
router.get('/:id', authenticate, OrderController.getOrderById);

module.exports = router;
