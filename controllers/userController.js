const User = require('../models/User');
const Post = require('../models/Post');
const Engagement = require('../models/Engagement');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

/**
 * Get current user's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getCurrentUserProfile = async (req, res, next) => {
  try {
    // Find user by ID
    const user = await User.findById(req.user.id)
      .select('-password -refreshToken')
      .lean();

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404,
        }
      });
    }

    res.json({
      message: 'User profile retrieved successfully',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get user profile by H.I. Identity name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserByIdentity = async (req, res, next) => {
  try {
    const { hiIdentityName } = req.params;

    // Find user by hiIdentityName
    const user = await User.findOne({ hiIdentityName })
      .select('hiIdentityName createdAt')
      .lean();

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404,
        }
      });
    }

    res.json({
      message: 'User profile retrieved successfully',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update current user's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, hiIdentityName, password, currentPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404,
        }
      });
    }
    
    // Create updated user object
    const updatedUser = {};
    
    // Update fullName if provided
    if (fullName) {
      updatedUser.fullName = fullName;
    }
    
    // Update email if provided
    if (email && email !== user.email) {
      // Check if email already exists
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailExists) {
        return res.status(400).json({
          error: {
            message: 'Email already in use',
            status: 400,
          }
        });
      }
      updatedUser.email = email;
    }
    
    // Update hiIdentityName if provided
    if (hiIdentityName && hiIdentityName !== user.hiIdentityName) {
      // Check if hiIdentityName already exists
      const hiIdentityExists = await User.findOne({ hiIdentityName, _id: { $ne: req.user.id } });
      if (hiIdentityExists) {
        return res.status(400).json({
          error: {
            message: 'H.I. Identity Name already in use',
            status: 400,
          }
        });
      }
      updatedUser.hiIdentityName = hiIdentityName;
    }
    
    // Update password if provided
    if (password && currentPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          error: {
            message: 'Current password is incorrect',
            status: 401,
          }
        });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updatedUser.password = await bcrypt.hash(password, salt);
    }
    
    // Update user
    const updatedUserDoc = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedUser },
      { new: true }
    ).select('-password -refreshToken');
    
    res.json({
      message: 'Profile updated successfully',
      data: { user: updatedUserDoc }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user's posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getCurrentUserPosts = async (req, res, next) => {
  try {
    // Parse query parameters
    const { 
      type,
      limit = 20, 
      skip = 0,
      sort = 'newest'
    } = req.query;

    // Build filter object
    const filter = { author: req.user.id };
    
    if (type) {
      filter.type = type;
    }

    // Build sort object
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { expressionCount: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Execute query with pagination
    const posts = await Post.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(Number(skip))
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments(filter);

    res.json({
      message: 'User posts retrieved successfully',
      data: {
        posts,
        pagination: {
          total,
          limit: Number(limit),
          skip: Number(skip),
          hasMore: total > (Number(skip) + Number(limit)),
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get posts by H.I. Identity name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserPosts = async (req, res, next) => {
  try {
    const { hiIdentityName } = req.params;
    
    // Find user by hiIdentityName
    const user = await User.findOne({ hiIdentityName });
    
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404,
        }
      });
    }
    
    // Parse query parameters
    const { 
      type,
      limit = 20, 
      skip = 0,
      sort = 'newest'
    } = req.query;

    // Build filter object
    const filter = { author: user._id };
    
    if (type) {
      filter.type = type;
    }

    // Build sort object
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { expressionCount: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Execute query with pagination
    const posts = await Post.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(Number(skip))
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments(filter);

    res.json({
      message: 'User posts retrieved successfully',
      data: {
        posts,
        pagination: {
          total,
          limit: Number(limit),
          skip: Number(skip),
          hasMore: total > (Number(skip) + Number(limit)),
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user's interactions (comments, solutions, etc.)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getCurrentUserInteractions = async (req, res, next) => {
  try {
    // Parse query parameters
    const { 
      type,
      limit = 20, 
      skip = 0,
    } = req.query;

    // Build filter object
    const filter = { 
      author: req.user.id,
      type: { $in: ['pov', 'solution', 'discussion', 'debate'] }
    };
    
    if (type) {
      filter.type = type;
    }

    // Execute query with pagination
    const interactions = await Engagement.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate({
        path: 'post',
        select: 'type content author thoughtType',
        populate: {
          path: 'author',
          select: 'hiIdentityName'
        }
      })
      .lean();

    // Get total count for pagination
    const total = await Engagement.countDocuments(filter);

    res.json({
      message: 'User interactions retrieved successfully',
      data: {
        interactions,
        pagination: {
          total,
          limit: Number(limit),
          skip: Number(skip),
          hasMore: total > (Number(skip) + Number(limit)),
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get posts endorsed by current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getCurrentUserEndorsements = async (req, res, next) => {
  try {
    // Parse query parameters
    const { 
      type,
      limit = 20, 
      skip = 0,
    } = req.query;

    // Find endorsements
    const endorsements = await Engagement.find({
      author: req.user.id,
      type: 'endorsement',
    })
      .sort({ createdAt: -1 })
      .select('post')
      .lean();
    
    // Extract post IDs
    const postIds = endorsements.map(e => e.post);
    
    // Build filter object
    const filter = { 
      _id: { $in: postIds }
    };
    
    if (type) {
      filter.type = type;
    }

    // Execute query with pagination
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate('author', 'hiIdentityName')
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments(filter);

    res.json({
      message: 'User endorsements retrieved successfully',
      data: {
        posts,
        pagination: {
          total,
          limit: Number(limit),
          skip: Number(skip),
          hasMore: total > (Number(skip) + Number(limit)),
        }
      }
    });
  } catch (err) {
    next(err);
  }
};