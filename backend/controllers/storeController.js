// controllers/storeController.js
const Store = require('../models/storeModel');
const Rating = require('../models/ratingModel');
const User = require('../models/userModel');

const storeController = {
  // Create store (Admin only)
  createStore: async (req, res) => {
    try {
      const { name, address, ownerId } = req.body;

      // Verify owner exists
      const owner = await User.findById(ownerId);
      if (!owner) {
        return res.status(404).json({
          status: 'error',
          message: 'Owner not found'
        });
      }

      const newStore = new Store({
        name,
        address,
        owner_id: ownerId
      });

      await newStore.save();

      res.status(201).json({
        status: 'success',
        message: 'Store created successfully',
        data: {
          storeId: newStore._id,
          name: newStore.name
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

  // Get all stores with filters
  getStores: async (req, res) => {
    try {
      const { name, address } = req.query;
      const currentUser = req.user;
      
      const filter = { is_active: true };
      if (name) filter.name = { $regex: name, $options: 'i' };
      if (address) filter.address = { $regex: address, $options: 'i' };

      const stores = await Store.find(filter)
        .populate('owner_id', 'name email')
        .sort({ name: 1 });

      const storesWithRatings = await Promise.all(
        stores.map(async (store) => {
          // Get average rating
          const ratings = await Rating.find({ store_id: store._id });
          const avgRating = ratings.length > 0 
            ? ratings.reduce((sum, rating) => sum + rating.rating_value, 0) / ratings.length 
            : 0;

          // Get user's rating if exists
          let userRating = null;
          if (currentUser.role === 'user') {
            const userRatingDoc = await Rating.findOne({
              store_id: store._id,
              user_id: currentUser.userId
            });
            userRating = userRatingDoc ? userRatingDoc.rating_value : null;
          }

          return {
            storeId: store._id,
            name: store.name,
            address: store.address,
            owner: store.owner_id.name,
            overall_rating: Math.round(avgRating * 10) / 10,
            user_rating: userRating,
            total_ratings: ratings.length
          };
        })
      );

      res.json({
        status: 'success',
        data: storesWithRatings
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Submit rating for store
  submitRating: async (req, res) => {
    try {
      const { storeId } = req.params;
      const { rating_value } = req.body;
      const currentUser = req.user;

      if (currentUser.role !== 'user') {
        return res.status(403).json({
          status: 'error',
          message: 'Only normal users can submit ratings'
        });
      }

      // Check if store exists
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({
          status: 'error',
          message: 'Store not found'
        });
      }

      // Check if user already rated this store
      const existingRating = await Rating.findOne({
        store_id: storeId,
        user_id: currentUser.userId
      });

      let rating;
      if (existingRating) {
        // Update existing rating
        existingRating.rating_value = rating_value;
        rating = await existingRating.save();
      } else {
        // Create new rating
        rating = new Rating({
          user_id: currentUser.userId,
          store_id: storeId,
          rating_value
        });
        await rating.save();
      }

      res.json({
        status: 'success',
        message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
        data: {
          ratingId: rating._id,
          rating_value: rating.rating_value
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

  // Get ratings for a specific store
  getStoreRatings: async (req, res) => {
    try {
      const { storeId } = req.params;
      const currentUser = req.user;

      // Check if store exists and user has permission
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({
          status: 'error',
          message: 'Store not found'
        });
      }

      if (currentUser.role !== 'admin' && store.owner_id.toString() !== currentUser.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      const ratings = await Rating.find({ store_id: storeId })
        .populate('user_id', 'name email')
        .sort({ created_at: -1 });

      const ratingData = ratings.map(rating => ({
        userId: rating.user_id._id,
        userName: rating.user_id.name,
        userEmail: rating.user_id.email,
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

module.exports = storeController;