// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const { validateUser } = require('../middlewares/validationMIddleware');

router.post('/', verifyToken, requireAdmin, validateUser, userController.createUser);
router.get('/', verifyToken, requireAdmin, userController.getUsers);
router.get('/:userId/ratings', verifyToken, userController.getUserRatings);

module.exports = router;