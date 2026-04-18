/**
 * Product Model
 * Handles all database operations for the products table
 * Supports filtering, sorting, searching, and pagination
 */
const { pool } = require('../config/db');

const ProductModel = {
  // Get all products with optional filtering, sorting, search, and pagination
  async getAll({ category, sort, search, page = 1, limit = 12 }) {
    let query = `
      SELECT p.*, c.name AS category
      FROM products p
      JOIN categories c ON p.category_id = c.id
    `;
    const params = [];
    const conditions = [];

    // Filter by category name
    if (category && category !== 'all') {
      conditions.push('c.name = ?');
      params.push(category);
    }

    // Search by product name or description (both languages)
    if (search && search.trim()) {
      conditions.push('(p.name_en LIKE ? OR p.name_es LIKE ? OR p.description_en LIKE ? OR p.description_es LIKE ?)');
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Apply WHERE conditions
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY p.price DESC';
        break;
      case 'name_asc':
        query += ' ORDER BY p.name_en ASC';
        break;
      case 'name_desc':
        query += ' ORDER BY p.name_en DESC';
        break;
      default:
        query += ' ORDER BY p.created_at DESC';
    }

    // Count total before pagination for frontend to know total pages
    const countQuery = query.replace(/SELECT p\.\*, c\.name AS category/, 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);

    // Parse sizes JSON for each product
    const products = rows.map((row) => ({
      ...row,
      sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes,
    }));

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Get a single product by ID
  async getById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    if (!rows[0]) return null;

    const product = rows[0];
    product.sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
    return product;
  },

  // Get featured products
  async getFeatured() {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.featured = TRUE
       ORDER BY p.created_at DESC`
    );
    return rows.map((row) => ({
      ...row,
      sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes,
    }));
  },

  // Get related products (same category, excluding current product)
  async getRelated(productId, categoryId, limit = 3) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.id != ?
       LIMIT ?`,
      [categoryId, productId, limit]
    );
    return rows.map((row) => ({
      ...row,
      sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes,
    }));
  },

  // Get recommended products (rating-driven picks for a smarter storefront)
  async getRecommended(limit = 4) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category,
              COALESCE(rstats.avg_rating, 0) AS avg_rating,
              COALESCE(rstats.review_count, 0) AS review_count
       FROM products p
       JOIN categories c ON p.category_id = c.id
       LEFT JOIN (
         SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
         FROM reviews
         GROUP BY product_id
       ) rstats ON rstats.product_id = p.id
       ORDER BY avg_rating DESC, review_count DESC, p.created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows.map((row) => ({
      ...row,
      sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes,
    }));
  },

  // Create a new product (for brand/business accounts)
  async create({ nameEn, nameEs, descriptionEn, descriptionEs, price, categoryId, image, sizes }) {
    const [result] = await pool.query(
      `INSERT INTO products (name_en, name_es, description_en, description_es, price, category_id, image, featured, sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, FALSE, ?)`,
      [nameEn, nameEs || nameEn, descriptionEn, descriptionEs || descriptionEn, price, categoryId, image || '/images/placeholder.png', JSON.stringify(sizes || ['One Size'])]
    );
    return result.insertId;
  },
};

module.exports = ProductModel;
