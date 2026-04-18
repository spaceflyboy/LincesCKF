/**
 * Home Controller
 * Handles the homepage API — returns featured products, categories, and recommendations
 */
const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');

const HomeController = {
  // GET /api/home — Homepage data
  async getHomeData(req, res) {
    try {
      // Fetch featured products, categories, and recommended products in parallel
      const [featuredProducts, categories, recommendedProducts] = await Promise.all([
        ProductModel.getFeatured(),
        CategoryModel.getAll(),
        ProductModel.getRecommended(4),
      ]);

      res.json({
        featuredProducts,
        categories,
        recommendedProducts,
      });
    } catch (error) {
      console.error('Home data error:', error);
      res.status(500).json({ error: 'Failed to fetch homepage data.' });
    }
  },
};

module.exports = HomeController;
