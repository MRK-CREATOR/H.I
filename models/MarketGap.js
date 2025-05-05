const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./Post');

/**
 * MarketGap Schema
 * Represents Market Gap/Problem posts in the H.I. platform
 * Inherits from the generic Post schema
 */
const MarketGapSchema = new Schema({
  // Specific fields for Market Gaps
  
  // The 'scope' field indicates the scope of the market gap/problem
  scope: {
    type: String,
    enum: ['local', 'regional', 'global'],
    default: 'global'
  },
  
  // The 'targetAudience' field indicates the primary audience affected by the problem
  targetAudience: {
    type: String,
    trim: true
  },
  
  // The 'urgency' field represents how urgent the problem is
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // The 'hasBestSolution' field is updated when a solution is marked as best by the author
  hasBestSolution: {
    type: Boolean,
    default: false
  },
  
  // Reference to the best solution if one is selected
  bestSolution: {
    type: Schema.Types.ObjectId,
    ref: 'Engagement',
    default: null
  }
});

/**
 * Create a new Market Gap
 * Factory method to create a new Market Gap post
 * 
 * @param {Object} data - Market Gap data
 * @returns {Promise<Object>} - Created Market Gap post
 */
MarketGapSchema.statics.createMarketGap = async function(data) {
  const { content, industry, author, scope, targetAudience, urgency } = data;
  
  // Create a new Post with type 'marketGap'
  const post = new Post({
    type: 'marketGap',
    content,
    industry,
    author,
    expressionCount: 0,
    povCount: 0,
    solutionCount: 0,
    engagementCount: 0
  });
  
  // Save the post
  await post.save();
  
  // Create and save the MarketGap with reference to the post
  const marketGap = new this({
    _id: post._id,
    scope: scope || 'global',
    targetAudience: targetAudience || '',
    urgency: urgency || 'medium',
    hasBestSolution: false,
    bestSolution: null
  });
  
  await marketGap.save();
  
  // Return the combined post with MarketGap fields
  return { ...post.toObject(), ...marketGap.toObject() };
};

/**
 * Find Market Gaps
 * Method to find Market Gap posts with filtering and pagination
 * 
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Options for sorting and pagination
 * @returns {Promise<Array>} - Array of Market Gap posts
 */
MarketGapSchema.statics.findMarketGaps = async function(filter = {}, options = {}) {
  // Find posts of type 'marketGap'
  const marketGapPosts = await Post.find({ 
    type: 'marketGap',
    ...filter 
  })
  .sort(options.sort || { createdAt: -1 })
  .skip(options.skip || 0)
  .limit(options.limit || 20)
  .populate('author', 'hiIdentityName')
  .lean();
  
  // Get MarketGap details for these posts
  const marketGapIds = marketGapPosts.map(post => post._id);
  const marketGapDetails = await this.find({ _id: { $in: marketGapIds } })
    .populate('bestSolution', 'content author')
    .lean();
  
  // Map MarketGap details to posts
  const marketGapDetailsMap = marketGapDetails.reduce((map, detail) => {
    map[detail._id.toString()] = detail;
    return map;
  }, {});
  
  // Combine post data with MarketGap details
  return marketGapPosts.map(post => ({
    ...post,
    ...(marketGapDetailsMap[post._id.toString()] || {})
  }));
};

/**
 * Mark Solution as Best
 * Method to mark a solution as the best solution for this market gap
 * 
 * @param {ObjectId} marketGapId - Market Gap post ID
 * @param {ObjectId} solutionId - Solution engagement ID
 * @returns {Promise<Object>} - Updated Market Gap with best solution
 */
MarketGapSchema.statics.markSolutionAsBest = async function(marketGapId, solutionId) {
  // Update the MarketGap
  const marketGap = await this.findByIdAndUpdate(
    marketGapId,
    {
      hasBestSolution: true,
      bestSolution: solutionId
    },
    { new: true }
  ).populate('bestSolution', 'content author');
  
  return marketGap;
};

// Create and export the MarketGap model
const MarketGap = mongoose.model('MarketGap', MarketGapSchema);
module.exports = MarketGap;