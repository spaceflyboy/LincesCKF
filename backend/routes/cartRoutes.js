/**
 * Cart Routes
 * GET    /api/cart        — Get cart items
 * POST   /api/cart/add    — Add item to cart
 * PUT    /api/cart/update — Update item quantity
 * DELETE /api/cart/remove — Remove item from cart
 * All routes require authentication
 */
const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, CartController.getCart);
router.post('/add', authenticate, CartController.addItem);
router.put('/update', authenticate, CartController.updateItem);
router.delete('/remove', authenticate, CartController.removeItem);

module.exports = router;
