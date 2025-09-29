// routes/stores.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const { validateStore, validateRating } = require('../middlewares/validationMIddleware');

router.post('/', verifyToken, requireAdmin, validateStore, storeController.createStore);
router.get('/', verifyToken, storeController.getStores);
router.post('/:storeId/ratings', verifyToken, validateRating, storeController.submitRating);
router.get('/:storeId/ratings', verifyToken, storeController.getStoreRatings);

module.exports = router;