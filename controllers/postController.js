const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');
const config = require('../config');

/**
 * Get all posts with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getPosts = async (req, res, next) => {
  try {
    // Parse query parameters
    const { 
      type, 
      thoughtType,
      industry,
      author,
      limit = 20, 
      skip = 0,
      sort = 'newest'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (type && config.postTypes.includes(type)) {
      filter.type = type;
      
      // Handle thought type
      if (type === 'thought' && thoughtType && config.thoughtTypes.includes(thoughtType)) {
        filter.thoughtType = thoughtType;
      }
    }
    
    if (industry) {
      filter.industry = industry;
    }
    
    if (author) {
      filter.author = author;
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
      case 'trending':
        sortOptions = { 
          expressionCount: -1,
          createdAt: -1,
        };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Execute query with pagination
    const posts = await Post.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(Number(skip))
      .populate('author', 'hiIdentityName')
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments(filter);

    res.json({
      message: 'Posts retrieved successfully',
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
 * Get trending posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getTrendingPosts = async (req, res, next) => {
  try {
    // Parse query parameters
    const { 
      type, 
      industry,
      limit = 10, 
      skip = 0,
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (type && config.postTypes.includes(type)) {
      filter.type = type;
    }
    
    if (industry) {
      filter.industry = industry;
    }

    // Calculate date for recent posts (last 7 days)
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    filter.createdAt = { $gte: recentDate };

    // Get posts with high engagement
    const posts = await Post.find(filter)
      .sort({ 
        expressionCount: -1,
        engagementCount: -1, // Total of POVs, Solutions, Discussions, Debates
        createdAt: -1,
      })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate('author', 'hiIdentityName')
      .lean();

    res.json({
      message: 'Trending posts retrieved successfully',
      data: {
        posts,
        pagination: {
          limit: Number(limit),
          skip: Number(skip),
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get post by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: {
          message: 'Invalid post ID',
          status: 400,
        }
      });
    }

    // Find post
    const post = await Post.findById(id)
      .populate('author', 'hiIdentityName')
      .lean();

    // Check if post exists
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          status: 404,
        }
      });
    }

    res.json({
      message: 'Post retrieved successfully',
      data: { post }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new post (generic)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createPost = async (req, res, next) => {
  try {
    const { type, content, industry, thoughtType } = req.body;
    
    // Validate post type
    if (!config.postTypes.includes(type)) {
      return res.status(400).json({
        error: {
          message: 'Invalid post type',
          status: 400,
        }
      });
    }
    
    // Validate thought type if post type is thought
    if (type === 'thought' && (!thoughtType || !config.thoughtTypes.includes(thoughtType))) {
      return res.status(400).json({
        error: {
          message: 'Invalid thought type',
          status: 400,
        }
      });
    }

    // Create post object
    const postData = {
      type,
      content,
      industry,
      author: req.user.id,
      expressionCount: 0,
      engagementCount: 0,
    };
    
    // Add thought type if post type is thought
    if (type === 'thought') {
      postData.thoughtType = thoughtType;
    }

    // Create and save post
    const post = new Post(postData);
    await post.save();

    // Populate author
    await post.populate('author', 'hiIdentityName');

    res.status(201).json({
      message: 'Post created successfully',
      data: { post }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new Idea Snap post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createIdeaSnap = async (req, res, next) => {
  try {
    const { content, industry } = req.body;
    
    // Create post object
    const postData = {
      type: 'ideaSnap',
      content,
      industry,
      author: req.user.id,
      expressionCount: 0,
      engagementCount: 0,
    };

    // Create and save post
    const post = new Post(postData);
    await post.save();

    // Populate author
    await post.populate('author', 'hiIdentityName');

    res.status(201).json({
      message: 'Idea Snap created successfully',
      data: { post }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new Market Gap post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createMarketGap = async (req, res, next) => {
  try {
    const { content, industry } = req.body;
    
    // Create post object
    const postData = {
      type: 'marketGap',
      content,
      industry,
      author: req.user.id,
      expressionCount: 0,
      engagementCount: 0,
    };

    // Create and save post
    const post = new Post(postData);
    await post.save();

    // Populate author
    await post.populate('author', 'hiIdentityName');

    res.status(201).json({
      message: 'Market Gap created successfully',
      data: { post }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new Thought post (What If/Why Not)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createThought = async (req, res, next) => {
  try {
    const { content, industry, thoughtType } = req.body;
    
    // Validate thought type
    if (!thoughtType || !config.thoughtTypes.includes(thoughtType)) {
      return res.status(400).json({
        error: {
          message: 'Invalid thought type',
          status: 400,
        }
      });
    }
    
    // Create post object
    const postData = {
      type: 'thought',
      thoughtType,
      content,
      industry,
      author: req.user.id,
      expressionCount: 0,
      engagementCount: 0,
    };

    // Create and save post
    const post = new Post(postData);
    await post.save();

    // Populate author
    await post.populate('author', 'hiIdentityName');

    res.status(201).json({
      message: 'Thought created successfully',
      data: { post }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new Observation post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createObservation = async (req, res, next) => {
  try {
    const { content, industry } = req.body;
    
    // Create post object
    const postData = {
      type: 'observation',
      content,
      industry, // Industry is optional for observations
      author: req.user.id,
      expressionCount: 0,
      engagementCount: 0,
    };

    // Create and save post
    const post = new Post(postData);
    await post.save();

    // Populate author
    await post.populate('author', 'hiIdentityName');

    res.status(201).json({
      message: 'Observation created successfully',
      data: { post }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: {
          message: 'Invalid post ID',
          status: 400,
        }
      });
    }

    // Find post
    const post = await Post.findById(id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          status: 404,
        }
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'Not authorized to delete this post',
          status: 403,
        }
      });
    }

    // Delete post
    await post.remove();

    res.json({
      message: 'Post deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};