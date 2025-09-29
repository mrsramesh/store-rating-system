// utils/helpers.js
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isStrongPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
  return strongPasswordRegex.test(password);
};

// Format response
const formatResponse = (status, message, data = null) => {
  return {
    status,
    message,
    ...(data && { data })
  };
};

// Calculate average rating
const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((total, rating) => total + rating.rating_value, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

module.exports = {
  generateToken,
  verifyToken,
  isValidEmail,
  isStrongPassword,
  formatResponse,
  calculateAverageRating
};