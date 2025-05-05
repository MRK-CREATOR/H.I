const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({
      error: {
        message: 'No authentication token, authorization denied',
        status: 401,
      }
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Add user from payload
    req.user = decoded.user;
    
    // Verify that the user still exists in the database
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'User not found, authorization denied',
          status: 401,
        }
      });
    }
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          message: 'Token has expired, please log in again',
          status: 401,
          isExpired: true,
        }
      });
    }
    
    res.status(401).json({
      error: {
        message: 'Token is not valid',
        status: 401,
      }
    });
  }
};