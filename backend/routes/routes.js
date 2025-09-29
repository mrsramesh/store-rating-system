const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUser} = require('../middlewares/validationMiddleware'); // make sure paths are correct
const {verifyToken}=require('../middlewares/authMiddleware')
// Remove the `/auth` prefix here, because app.js already adds `/api/auth`
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/reset-password', verifyToken, authController.resetPassword);

module.exports = router;
