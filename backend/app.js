/**
 * Express Application Setup
 * Configures middleware, CORS, JSON parsing, and all API routes
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getAllowedOrigins } = require('./config/corsOrigins');

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

// Enable CORS for frontend communication (Vite dev :5173, preview :4173, or CLIENT_URL)
app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
  }),
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ============================================================
// API ROUTES
// ============================================================

// Authentication routes (register, login)
app.use('/api/auth', require('./routes/authRoutes'));

// Homepage route (featured products, categories, recommended)
app.use('/api/home', require('./routes/homeRoutes'));

// Product routes (listing, detail)
app.use('/api/products', require('./routes/productRoutes'));

// Cart routes (get, add, update, remove)
app.use('/api/cart', require('./routes/cartRoutes'));

// Order routes (place order, order history)
app.use('/api/orders', require('./routes/orderRoutes'));

// User account routes (profile, password, preferences)
app.use('/api/user', require('./routes/userRoutes'));

// Contact form route
app.use('/api/contact', require('./routes/contactRoutes'));

// Review routes (add product review)
app.use('/api/reviews', require('./routes/reviewRoutes'));

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Linces\'CKF Backend API is running' });
});

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
