const Engagement = require('../models/Engagement');
const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');
const config = require('../config');

/**
 * Get all engagements for a specific post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getPostEngagements = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { type, limit = 20, skip = 0 } = req.query;
    
    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid post ID',
          status: 400,
        }
      });
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          status: 404,
        }
      });
    }
    
    // Build filter
    const filter = {
      post: postId,
    };
    
    // Add type filter if provided
    if (type && config.engagementTypes.includes(type)) {
      filter.type = type;
    } else if (type) {
      return res.status(400).json({
        error: {
          message: 'Invalid engagement type',
          status: 400,
        }
      });
    }
    
    // Get engagements with pagination
    const engagements = await Engagement.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate('author', 'hiIdentityName')
      .lean();
    
    // Get total count for pagination
    const total = await Engagement.countDocuments(filter);
    
    res.json({
      message: 'Post engagements retrieved successfully',
      data: {
        engagements,
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
 * Add a Point of View (comment) to a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.addPOV = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    
    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid post ID',
          status: 400,
        }
      });
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          status: 404,
        }
      });
    }
    
    // Create new engagement
    const engagement = new Engagement({
      type: 'pov',
      content,
      post: postId,
      author: req.user.id,
    });
    
    // Save engagement
    await engagement.save();
    
    // Update post engagement count
    await Post.findByIdAndUpdate(postId, {
      $inc: { engagementCount: 1, povCount: 1 },
    });
    
    // Populate author
    await engagement.populate('author', 'hiIdentityName');
    
    res.status(201).json({
      message: 'Point of View added successfully',
      data: { engagement }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Add a Solution to a Market Gap post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.addSolution = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    
    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid post ID',
          status: 400,
        }
      });
    }
    
    // Check if post exists and is a Market Gap
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          status: 404,
        }
      });
    }
    
    if (post.type !== 'marketGap') {
      return res.status(400).json({
        error: {
          message: 'Solutions can only be added to Market Gap posts',
          status: 400,
        }
      });
    }
    
    // Create new engagement
    const engagement = new Engagement({
      type: 'solution',
      content,
      post: postId,
      author: req.user.id,
    });
    
    // Save engagement
    await engagement.save();
    
    // Update post engagement count
    await Post.findByIdAndUpdate(postId, {
      $inc: { engagementCount: 1, solutionCount: 1 },
    });
    
    // Populate author
    await engagement.populate('author', 'hiIdentityName');
    
    res.status(201).json({
      message: 'Solution added successfully',
      data: { engagement }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Join discussion on a What If thought
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.joinDiscussion = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    
    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid post ID',
          status: 400,
        }
      });
    }
    
    // Check if post exists and is a What If thought
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          status: 404,
        }
      });
    }
    
    if (post.type !== 'thought' || post.thoughtType !== 'whatIf') {
      return res.status(400).json({
        error: {
          message: 'Discussions can only be added to What If thoughts',
          status: 400,
        }
      });
    }
    
    // Create new engagement
    const engagement = new Engagement({
      type: 'discussion',
      content,
      post: postId,
      author: req.user.id,
    });
    
    // Save engagement
    await engagement.save();
    
    // Update post engagement count
    await Post.findByIdAndUpdate(postId, {
      $inc: { engagementCount: 1, discussionCount: 1 },
    });
    
    // Populate author
    await engagement.populate('author', 'hiIdentityName');
    
    res.status(201).json({
      message: 'Joined discussion successfully',
      data: { engagement }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Join debate on a Why Not thought
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.joinDebate = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    
    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid post ID',
          status: 400,
        }
      });
    }
    
    // Check if post exists and is a Why Not thought
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          status: 404,
        }
      });
    }
    
    if (post.type !== 'thought' || post.thoughtType !== 'whyNot') {
      return res.status(400).json({
        error: {
          message: 'Debates can only be added to Why Not thoughts',
          status: 400,
        }
      });
    }
    
    // Create new engagement
    const engagement = new Engagement({
      type: 'debate',
      content,
      post: postId,
      author: req.user.id,
    });
    
    // Save engagement
    await engagement.save();
    
    // Update post engagement count
    await Post.findByIdAndUpdate(postId, {
      $inc: { engagementCount: 1, debateCount: 1 },
    });
    
    // Populate author
    await engagement.populate('author', 'hiIdentityName');
    
    res.status(201).json({
      message: 'Joined debate successfully',
      data: { engagement }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle like/expression on a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.toggleExpression = async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid post ID',
          status: 400,
        }
      });
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          status: 404,
        }
      });
    }
    
    // Check if user already expressed
    const existingExpression = await Engagement.findOne({
      type: 'expression',
      post: postId,
      author: req.user.id,
    });
    
    let result;
    
    if (existingExpression) {
      // Remove expression
      await Engagement.findByIdAndDelete(existingExpression._id);
      
      // Decrement post expression count
      await Post.findByIdAndUpdate(postId, {
        $inc: { expressionCount: -1 },
      });
      
      result = {
        action: 'removed',
        expressionCount: post.expressionCount - 1,
      };
    } else {
      // Create new expression
      const engagement = new Engagement({
        type: 'expression',
        post: postId,
        author: req.user.id,
      });
      
      // Save engagement
      await engagement.save();
      
      // Increment post expression count
      await Post.findByIdAndUpdate(postId, {
        $inc: { expressionCount: 1 },
      });
      
      result = {
        action: 'added',
        expressionCount: post.expressionCount + 1,
      };
    }
    
    res.json({
      message: `Expression ${result.action} successfully`,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle endorsement on a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.toggleEndorsement = async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid post ID',
          status: 400,
        }
      });
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          status: 404,
        }
      });
    }
    
    // Check if user already endorsed
    const existingEndorsement = await Engagement.findOne({
      type: 'endorsement',
      post: postId,
      author: req.user.id,
    });
    
    let result;
    
    if (existingEndorsement) {
      // Remove endorsement
      await Engagement.findByIdAndDelete(existingEndorsement._id);
      
      // Decrement post endorsement count
      await Post.findByIdAndUpdate(postId, {
        $inc: { endorsementCount: -1 },
      });
      
      result = {
        action: 'removed',
        endorsementCount: (post.endorsementCount || 0) - 1,
      };
    } else {
      // Create new endorsement
      const engagement = new Engagement({
        type: 'endorsement',
        post: postId,
        author: req.user.id,
      });
      
      // Save engagement
      await engagement.save();
      
      // Increment post endorsement count
      await Post.findByIdAndUpdate(postId, {
        $inc: { endorsementCount: 1 },
      });
      
      result = {
        action: 'added',
        endorsementCount: (post.endorsementCount || 0) + 1,
      };
    }
    
    res.json({
      message: `Endorsement ${result.action} successfully`,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete an engagement (own engagement only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteEngagement = async (req, res, next) => {
  try {
    const { engagementId } = req.params;
    
    // Validate engagement ID
    if (!mongoose.Types.ObjectId.isValid(engagementId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid engagement ID',
          status: 400,
        }
      });
    }
    
    // Check if engagement exists
    const engagement = await Engagement.findById(engagementId);
    if (!engagement) {
      return res.status(404).json({
        error: {
          message: 'Engagement not found',
          status: 404,
        }
      });
    }
    
    // Check if user is the author
    if (engagement.author.toString() !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'Not authorized to delete this engagement',
          status: 403,
        }
      });
    }
    
    // Determine which counter to decrement based on engagement type
    let updateObj = { $inc: { engagementCount: -1 } };
    
    switch (engagement.type) {
      case 'pov':
        updateObj.$inc.povCount = -1;
        break;
      case 'solution':
        updateObj.$inc.solutionCount = -1;
        break;
      case 'discussion':
        updateObj.$inc.discussionCount = -1;
        break;
      case 'debate':
        updateObj.$inc.debateCount = -1;
        break;
      case 'expression':
        updateObj = { $inc: { expressionCount: -1 } };
        break;
      case 'endorsement':
        updateObj = { $inc: { endorsementCount: -1 } };
        break;
    }
    
    // Update post counters
    await Post.findByIdAndUpdate(engagement.post, updateObj);
    
    // Delete engagement
    await Engagement.findByIdAndDelete(engagementId);
    
    res.json({
      message: 'Engagement deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};