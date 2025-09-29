// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = {
  // Verify JWT token
  verifyToken: (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid token'
      });
    }
  },

  // Check if user is admin
  requireAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin role required.'
      });
    }
    next();
  },

  // Check if user is store owner or admin
  requireStoreOwnerOrAdmin: (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'store_owner') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Store owner or admin role required.'
      });
    }
    next();
  }
};

module.exports = authMiddleware;