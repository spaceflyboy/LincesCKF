/**
 * User Controller
 * Handles user profile updates, password changes, and preferences
 */
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

const UserController = {
  // PUT /api/user/update — Update user profile (name, email)
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
      }

      await UserModel.updateProfile(userId, name, email);
      const updatedUser = await UserModel.findById(userId);

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          accountType: updatedUser.account_type,
        },
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile.' });
    }
  },

  // PUT /api/user/password — Change user password
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required.' });
      }

      // Verify current password
      const currentHash = await UserModel.getPasswordHash(userId);
      const isMatch = await bcrypt.compare(currentPassword, currentHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }

      // Hash and save new password
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(newPassword, salt);
      await UserModel.updatePassword(userId, newHash);

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password.' });
    }
  },

  // GET /api/user/preferences — Get notification preferences
  async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = await UserModel.getPreferences(userId);
      res.json({ preferences: preferences || {} });
    } catch (error) {
      console.error('Get preferences error:', error);
      res.status(500).json({ error: 'Failed to fetch preferences.' });
    }
  },

  // PUT /api/user/preferences — Update notification preferences
  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const { preferences } = req.body;

      await UserModel.updatePreferences(userId, preferences);
      res.json({ message: 'Preferences updated successfully', preferences });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ error: 'Failed to update preferences.' });
    }
  },
};

module.exports = UserController;
