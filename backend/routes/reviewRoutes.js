/**
 * Review Routes
 * POST /api/reviews — Add a product review (requires authentication)
 */
const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, ReviewController.addReview);

module.exports = router;
