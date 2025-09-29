// controllers/userController.js
const User = require('../models/userModel');
const Rating = require('../models/ratingModel');
const Store = require('../models/storeModel');
const bcrypt = require('bcryptjs');

const userController = {
  // Create user (Admin only)
  createUser: async (req, res) => {
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

  // Get all users with filters (Admin only)
  getUsers: async (req, res) => {
    try {
      const { role, name, email, address } = req.query;
      
      const filter = {};
      if (role) filter.role = role;
      if (name) filter.name = { $regex: name, $options: 'i' };
      if (email) filter.email = { $regex: email, $options: 'i' };
      if (address) filter.address = { $regex: address, $options: 'i' };

      const users = await User.find(filter)
        .select('-password')
        .sort({ name: 1 });

      // Get ratings for each user to determine if they've rated stores
      const usersWithRatings = await Promise.all(
        users.map(async (user) => {
          const ratings = await Rating.find({ user_id: user._id });
          return {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
            ratedStores: ratings.length > 0
          };
        })
      );

      res.json({
        status: 'success',
        data: usersWithRatings
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get user ratings
  getUserRatings: async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = req.user;

      // Check if user has permission
      if (currentUser.role !== 'admin' && currentUser.userId !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      const ratings = await Rating.find({ user_id: userId })
        .populate('store_id', 'name address')
        .sort({ created_at: -1 });

      const ratingData = ratings.map(rating => ({
        storeId: rating.store_id._id,
        storeName: rating.store_id.name,
        rating_value: rating.rating_value,
        created_at: rating.created_at
      }));

      res.json({
        status: 'success',
        data: ratingData
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

module.exports = userController;