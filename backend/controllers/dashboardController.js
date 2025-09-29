// controllers/dashboardController.js
const User = require('../models/userModel');
const Store = require('../models/storeModel');
const Rating = require('../models/ratingModel');

const dashboardController = {
  // Admin dashboard
  getAdminDashboard: async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalStores = await Store.countDocuments();
      const totalRatings = await Rating.countDocuments();

      // Recent activities
      const recentRatings = await Rating.find()
        .populate('user_id', 'name')
        .populate('store_id', 'name')
        .sort({ created_at: -1 })
        .limit(10);

      const recentActivities = recentRatings.map(rating => ({
        userName: rating.user_id.name,
        storeName: rating.store_id.name,
        rating: rating.rating_value,
        date: rating.created_at
      }));

      res.json({
        status: 'success',
        data: {
          total_users: totalUsers,
          total_stores: totalStores,
          total_ratings: totalRatings,
          recent_activities: recentActivities
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

  // Store owner dashboard
  getStoreOwnerDashboard: async (req, res) => {
    try {
      const currentUser = req.user;

      // Get stores owned by current user
      const stores = await Store.find({ owner_id: currentUser.userId });
      const storeIds = stores.map(store => store._id);

      // Get ratings for these stores
      const ratings = await Rating.find({ store_id: { $in: storeIds } })
        .populate('user_id', 'name email')
        .populate('store_id', 'name')
        .sort({ created_at: -1 });

      // Calculate aggregate data per store
      const storeStats = await Promise.all(
        stores.map(async (store) => {
          const storeRatings = ratings.filter(r => r.store_id._id.toString() === store._id.toString());
          const avgRating = storeRatings.length > 0 
            ? storeRatings.reduce((sum, r) => sum + r.rating_value, 0) / storeRatings.length 
            : 0;

          return {
            storeId: store._id,
            storeName: store.name,
            total_ratings: storeRatings.length,
            avg_rating: Math.round(avgRating * 10) / 10,
            recent_ratings: storeRatings.slice(0, 5).map(r => ({
              userName: r.user_id.name,
              rating: r.rating_value,
              date: r.created_at
            }))
          };
        })
      );

      res.json({
        status: 'success',
        data: {
          total_stores: stores.length,
          total_ratings: ratings.length,
          store_stats: storeStats
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

module.exports = dashboardController;