// routes/ratings.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const { validateRating } = require('../middlewares/validationMIddleware');

 router.patch('/:ratingId', verifyToken, validateRating, ratingController.updateRating);
router.get('/aggregate/store/:storeId', verifyToken, ratingController.getStoreAggregation);
router.get('/aggregate/user/:userId', verifyToken, requireAdmin, ratingController.getUserAggregation);

module.exports = router;