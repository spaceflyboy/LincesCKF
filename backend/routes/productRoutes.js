/**
 * Product Routes
 * GET  /api/products              — List all products (filter, sort, search, pagination)
 * GET  /api/products/categories   — Get all categories
 * GET  /api/products/:id          — Get product detail with reviews and related products
 * POST /api/products              — Create a new product (brand accounts only, auth required)
 */
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

// Categories must come BEFORE /:id to avoid conflict
router.get('/categories', ProductController.getCategories);
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', authenticate, ProductController.createProduct);

module.exports = router;
