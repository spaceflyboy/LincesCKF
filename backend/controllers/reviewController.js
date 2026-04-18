/**
 * Review Controller
 * Handles product review creation
 */
const ReviewModel = require('../models/reviewModel');

const ReviewController = {
  // POST /api/reviews — Add a review for a product (requires authentication)
  async addReview(req, res) {
    try {
      const userId = req.user.id;
      const { productId, rating, comment } = req.body;
      const author = req.user.name;

      // Validate required fields
      if (!productId || !rating) {
        return res.status(400).json({ error: 'Product ID and rating are required.' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
      }

      const reviewId = await ReviewModel.create(userId, productId, author, rating, comment || '');

      res.status(201).json({
        message: 'Review added successfully',
        id: reviewId,
      });
    } catch (error) {
      console.error('Add review error:', error);
      res.status(500).json({ error: 'Failed to add review.' });
    }
  },
};

module.exports = ReviewController;
