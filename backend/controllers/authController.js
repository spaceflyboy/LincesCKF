/**
 * Auth Controller
 * Handles user registration and login with JWT authentication
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// Generate a JWT token for a user
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, accountType: user.account_type },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

const AuthController = {
  // POST /api/auth/register — Register a new user
  async register(req, res) {
    try {
      const { name, email, password, accountType } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      // Check if user already exists
      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'A user with this email already exists.' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the user
      const userId = await UserModel.create(name, email, hashedPassword, accountType || 'customer');
      const user = await UserModel.findById(userId);

      // Generate token
      const token = generateToken(user);

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          accountType: user.account_type,
        },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Server error during registration.' });
    }
  },

  // POST /api/auth/login — Login an existing user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Generate token
      const token = generateToken(user);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          accountType: user.account_type,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error during login.' });
    }
  },
};

module.exports = AuthController;
