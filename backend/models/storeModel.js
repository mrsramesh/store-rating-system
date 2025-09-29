// models/Store.js
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  owner_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true, 
    maxlength: 100,
    trim: true
  },
  address: { 
    type: String, 
    maxlength: 400,
    trim: true
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  description: {
    type: String,
    maxlength: 500,
    trim: true
  }
}, { 
  timestamps: true,
  collection: "stores"  // Fixed collection name
});

// Indexes
storeSchema.index({ owner_id: 1 });
storeSchema.index({ is_active: 1 });
storeSchema.index({ name: 'text', address: 'text' });

module.exports = mongoose.model('Store', storeSchema);