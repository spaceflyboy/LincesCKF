/**
 * Home Routes
 * GET /api/home — Return homepage data (featured, categories, recommended)
 */
const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/homeController');

router.get('/', HomeController.getHomeData);

module.exports = router;
