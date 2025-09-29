// controllers/ratingController.js
const Rating = require('../models/ratingModel');
const Store = require('../models/storeModel');
const User = require('../models/userModel');

const ratingController = {
  // Update rating
  updateRating: async (req, res) => {
    try {
      const { ratingId } = req.params;
      const { rating_value } = req.body;
      const currentUser = req.user;

      const rating = await Rating.findById(ratingId);
      if (!rating) {
        return res.status(404).json({
          status: 'error',
          message: 'Rating not found'
        });
      }

      // Check if user owns this rating
      if (rating.user_id.toString() !== currentUser.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'You can only update your own ratings'
        });
      }

      rating.rating_value = rating_value;
      await rating.save();

      res.json({
        status: 'success',
        message: 'Rating updated successfully',
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

  // Get store rating aggregation
  getStoreAggregation: async (req, res) => {
    try {
      const { storeId } = req.params;
      const currentUser = req.user;

      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({
          status: 'error',
          message: 'Store not found'
        });
      }

      // Check permission
      if (currentUser.role !== 'admin' && store.owner_id.toString() !== currentUser.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      const ratings = await Rating.find({ store_id: storeId });
      const totalRatings = ratings.length;
      const avgRating = totalRatings > 0 
        ? ratings.reduce((sum, rating) => sum + rating.rating_value, 0) / totalRatings 
        : 0;

      // Rating distribution
      const distribution = [1, 2, 3, 4, 5].map(star => ({
        star,
        count: ratings.filter(r => r.rating_value === star).length
      }));

      res.json({
        status: 'success',
        data: {
          avg_rating: Math.round(avgRating * 10) / 10,
          total_ratings: totalRatings,
          distribution,
          store_name: store.name
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

  // Get user rating aggregation
  getUserAggregation: async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = req.user;

      if (currentUser.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied - Admin only'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      const ratings = await Rating.find({ user_id: userId });
      const totalRatings = ratings.length;
      
      // Get unique stores rated by user
      const storeIds = [...new Set(ratings.map(r => r.store_id.toString()))];
      const stores = await Store.find({ _id: { $in: storeIds } });

      res.json({
        status: 'success',
        data: {
          total_ratings: totalRatings,
          rated_stores: stores.map(store => ({
            storeId: store._id,
            storeName: store.name,
            address: store.address
          })),
          user_name: user.name,
          user_email: user.email
        }
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

module.exports = ratingController;