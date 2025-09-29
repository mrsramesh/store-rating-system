// controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {

    // Signup
  signup: async (req, res) => {
    console.log("inside the signup");
    
    try {
      const { name, email, password, address, role = 'user' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User already exists with this email'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        address,
        role
      });

      await newUser.save();

      res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
          userId: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Signin
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        status: 'success',
        message: 'Login successful',
        data: {
          token,
          user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Reset Password
  resetPassword: async (req, res) => {
    try {
      const { email, new_password, confirm_password, reset_token } = req.body;

      if (new_password !== confirm_password) {
        return res.status(400).json({
          status: 'error',
          message: 'Passwords do not match'
        });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(new_password, saltRounds);

      user.password = hashedPassword;
      await user.save();

      res.json({
        status: 'success',
        message: 'Password reset successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = authController;