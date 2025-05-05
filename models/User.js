const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 * Represents user accounts in the H.I. platform
 */
const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  hiIdentityName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, 'H.I. Identity Name must be at least 3 characters long'],
    maxlength: [20, 'H.I. Identity Name cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9]+$/, 'H.I. Identity Name can only contain alphanumeric characters']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  refreshToken: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    }
  }
});

// Pre-save middleware to update the updatedAt field
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;