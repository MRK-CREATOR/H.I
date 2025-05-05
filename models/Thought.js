const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./Post');

/**
 * Thought Schema
 * Represents "What If" and "Why Not" thought posts in the H.I. platform
 * Inherits from the generic Post schema
 */
const ThoughtSchema = new Schema({
  // Specific fields for Thoughts
  
  // The thoughtType is already in the Post schema, but we reference it here as well
  // for consistency with other specialized models
  thoughtType: {
    type: String,
    enum: ['whatIf', 'whyNot'],
    required: true
  },
  
  // The 'category' field represents the general category of the thought
  category: {
    type: String,
    enum: ['technology', 'society', 'business', 'science', 'education', 'environment', 'other'],
    default: 'other'
  },
  
  // The 'feasibility' field represents how feasible the thought might be
  feasibility: {
    type: String,
    enum: ['speculative', 'theoretical', 'practical'],
    default: 'speculative'
  },
  
  // The 'timeframe' field represents when this might be possible/relevant
  timeframe: {
    type: String,
    enum: ['present', 'near-future', 'distant-future'],
    default: 'near-future'
  }
});

/**
 * Create a new Thought
 * Factory method to create a new Thought post
 * 
 * @param {Object} data - Thought data
 * @returns {Promise<Object>} - Created Thought post
 */
ThoughtSchema.statics.createThought = async function(data) {
  const { content, industry, author, thoughtType, category, feasibility, timeframe } = data;
  
  // Validate thought type
  if (!thoughtType || !['whatIf', 'whyNot'].includes(thoughtType)) {
    throw new Error('Invalid thought type. Must be "whatIf" or "whyNot".');
  }
  
  // Create a new Post with type 'thought'
  const post = new Post({
    type: 'thought',
    thoughtType,
    content,
    industry,
    author,
    expressionCount: 0,
    engagementCount: 0,
    // Set the appropriate counter based on thought type
    ...(thoughtType === 'whatIf' ? { discussionCount: 0 } : { debateCount: 0 })
  });
  
  // Save the post
  await post.save();
  
  // Create and save the Thought with reference to the post
  const thought = new this({
    _id: post._id,
    thoughtType,
    category: category || 'other',
    feasibility: feasibility || 'speculative',
    timeframe: timeframe || 'near-future'
  });
  
  await thought.save();
  
  // Return the combined post with Thought fields
  return { ...post.toObject(), ...thought.toObject() };
};

/**
 * Find Thoughts
 * Method to find Thought posts with filtering and pagination
 * 
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Options for sorting and pagination
 * @returns {Promise<Array>} - Array of Thought posts
 */
ThoughtSchema.statics.findThoughts = async function(filter = {}, options = {}) {
  // Build the query filter
  const queryFilter = { type: 'thought' };
  
  // Add thoughtType filter if specified
  if (filter.thoughtType) {
    queryFilter.thoughtType = filter.thoughtType;
  }
  
  // Add other generic filters
  if (filter.author) queryFilter.author = filter.author;
  if (filter.industry) queryFilter.industry = filter.industry;
  
  // Find posts of type 'thought'
  const thoughtPosts = await Post.find(queryFilter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 20)
    .populate('author', 'hiIdentityName')
    .lean();
  
  // Get Thought details for these posts
  const thoughtIds = thoughtPosts.map(post => post._id);
  
  // Build the specialized filter
  const specializedFilter = { _id: { $in: thoughtIds } };
  
  // Add specialized filters
  if (filter.category) specializedFilter.category = filter.category;
  if (filter.feasibility) specializedFilter.feasibility = filter.feasibility;
  if (filter.timeframe) specializedFilter.timeframe = filter.timeframe;
  
  const thoughtDetails = await this.find(specializedFilter).lean();
  
  // Map Thought details to posts
  const thoughtDetailsMap = thoughtDetails.reduce((map, detail) => {
    map[detail._id.toString()] = detail;
    return map;
  }, {});
  
  // Combine post data with Thought details
  return thoughtPosts
    .filter(post => thoughtDetailsMap[post._id.toString()])
    .map(post => ({
      ...post,
      ...thoughtDetailsMap[post._id.toString()]
    }));
};

// Create and export the Thought model
const Thought = mongoose.model('Thought', ThoughtSchema);
module.exports = Thought;