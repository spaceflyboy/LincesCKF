/**
 * User Routes
 * PUT /api/user/update      — Update profile
 * PUT /api/user/password    — Change password
 * GET /api/user/preferences — Get notification preferences
 * PUT /api/user/preferences — Update notification preferences
 * All routes require authentication
 */
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.put('/update', authenticate, UserController.updateProfile);
router.put('/password', authenticate, UserController.changePassword);
router.get('/preferences', authenticate, UserController.getPreferences);
router.put('/preferences', authenticate, UserController.updatePreferences);

module.exports = router;
