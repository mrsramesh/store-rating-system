// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/admin', verifyToken, requireAdmin, dashboardController.getAdminDashboard);
router.get('/store-owner', verifyToken, dashboardController.getStoreOwnerDashboard);

module.exports = router;