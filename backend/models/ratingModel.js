// models/Rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  store_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store', 
    required: true 
  },
  rating_value: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating value must be an integer'
    }
  },
  comment: {
    type: String,
    maxlength: 500,
    trim: true
  }
}, { 
  timestamps: true,
  collection: "ratings" 
});

// Enforce unique rating per user per store
ratingSchema.index({ user_id: 1, store_id: 1 }, { unique: true });

// Index for better query performance
ratingSchema.index({ store_id: 1, created_at: -1 });
ratingSchema.index({ user_id: 1, created_at: -1 });

module.exports = mongoose.model('Rating', ratingSchema);