const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, hiIdentityName, password } = req.body;

    // Check if email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        error: {
          message: 'Email already registered',
          status: 400,
        }
      });
    }

    // Check if hiIdentityName already exists
    user = await User.findOne({ hiIdentityName });
    if (user) {
      return res.status(400).json({
        error: {
          message: 'H.I. Identity Name already taken',
          status: 400,
        }
      });
    }

    // Create new user
    user = new User({
      fullName,
      email,
      hiIdentityName,
      password,
    });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        hiIdentityName: user.hiIdentityName,
      }
    };

    const token = jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Return user info and token
    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        hiIdentityName: user.hiIdentityName,
        email: user.email,
        createdAt: user.createdAt,
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Authenticate user & get token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          status: 401,
        }
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          status: 401,
        }
      });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        hiIdentityName: user.hiIdentityName,
      }
    };

    const token = jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Return user info and token
    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        hiIdentityName: user.hiIdentityName,
        email: user.email,
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify user token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.verifyToken = async (req, res, next) => {
  try {
    // Token is already verified by auth middleware
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404,
        }
      });
    }

    res.json({
      message: 'Token valid',
      user: {
        id: user.id,
        fullName: user.fullName,
        hiIdentityName: user.hiIdentityName,
        email: user.email,
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Refresh access token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: {
          message: 'Refresh token is required',
          status: 400,
        }
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwtSecret);
    
    // Find user with this refresh token
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        error: {
          message: 'Invalid refresh token',
          status: 401,
        }
      });
    }

    // Generate new access token
    const payload = {
      user: {
        id: user.id,
        hiIdentityName: user.hiIdentityName,
      }
    };

    const token = jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    // Return new access token
    res.json({
      message: 'Token refreshed',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        hiIdentityName: user.hiIdentityName,
        email: user.email,
      }
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          message: 'Invalid or expired refresh token',
          status: 401,
        }
      });
    }
    next(err);
  }
};

/**
 * Logout user / invalidate token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.logout = async (req, res, next) => {
  try {
    // Clear refresh token in database
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    
    res.json({
      message: 'Logout successful',
    });
  } catch (err) {
    next(err);
  }
};