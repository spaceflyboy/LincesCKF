/**
 * Product Controller
 * Handles product listing, product detail, and product creation (brand accounts)
 */
const ProductModel = require('../models/productModel');
const ReviewModel = require('../models/reviewModel');
const CategoryModel = require('../models/categoryModel');

const ProductController = {
  // GET /api/products — List products with filtering, sorting, search, pagination
  async getProducts(req, res) {
    try {
      const { category, sort, search, page, limit } = req.query;
      const result = await ProductModel.getAll({ category, sort, search, page, limit });
      res.json(result);
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to fetch products.' });
    }
  },

  // GET /api/products/:id — Get product detail with reviews and related products
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getById(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      // Fetch reviews and related products in parallel
      const [reviews, relatedProducts] = await Promise.all([
        ReviewModel.getByProductId(id),
        ProductModel.getRelated(product.id, product.category_id, 3),
      ]);

      res.json({
        ...product,
        reviews,
        relatedProducts,
      });
    } catch (error) {
      console.error('Get product detail error:', error);
      res.status(500).json({ error: 'Failed to fetch product details.' });
    }
  },

  // POST /api/products — Create a new product (brand accounts only)
  async createProduct(req, res) {
    try {
      const { nameEn, nameEs, descriptionEn, descriptionEs, price, categoryId, image, sizes } = req.body;

      // Validate required fields
      if (!nameEn || !price || !categoryId) {
        return res.status(400).json({ error: 'Product name, price, and category are required.' });
      }

      // Verify user is a brand account
      if (req.user.accountType !== 'brand') {
        // Also check from DB since JWT may not have accountType
        const UserModel = require('../models/userModel');
        const dbUser = await UserModel.findById(req.user.id);
        if (!dbUser || dbUser.account_type !== 'brand') {
          return res.status(403).json({ error: 'Only brand accounts can list products.' });
        }
      }

      // Verify category exists
      const category = await CategoryModel.getById(categoryId);
      if (!category) {
        return res.status(400).json({ error: 'Invalid category.' });
      }

      const productId = await ProductModel.create({
        nameEn,
        nameEs: nameEs || nameEn,
        descriptionEn: descriptionEn || '',
        descriptionEs: descriptionEs || descriptionEn || '',
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        image: image || '/images/placeholder.png',
        sizes: sizes || ['One Size'],
      });

      const product = await ProductModel.getById(productId);

      res.status(201).json({
        message: 'Product listed successfully',
        product,
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product.' });
    }
  },

  // GET /api/products/categories/all — Get all categories (for product creation form)
  async getCategories(req, res) {
    try {
      const categories = await CategoryModel.getAll();
      res.json({ categories });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Failed to fetch categories.' });
    }
  },
};

module.exports = ProductController;
