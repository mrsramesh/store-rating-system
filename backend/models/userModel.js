// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,//20,
    maxlength: 60,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
     minlength: 8,
    // maxlength: 16,
    validate: {
      validator: function(v) {
        return /^(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(v);
      },
      message: 'Password must contain at least one uppercase letter and one special character'
    }
  },
  address: {
    type: String,
    maxlength: 400,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'store_owner'],
    default: 'user'
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  collection: "users"
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ created_at: -1 });

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);