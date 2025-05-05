const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./Post');

/**
 * IdeaSnap Schema
 * Represents Idea Snap posts in the H.I. platform
 * Inherits from the generic Post schema
 */
const IdeaSnapSchema = new Schema({
  // Specific fields for Idea Snaps
  
  // The 'isImplementable' field indicates whether the idea can be practically implemented
  isImplementable: {
    type: Boolean,
    default: true
  },
  
  // The 'complexity' field represents the complexity level of the idea
  complexity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // The 'isPotentialStartup' field indicates if the idea could be a startup
  isPotentialStartup: {
    type: Boolean,
    default: false
  }
});

/**
 * Create a new Idea Snap
 * Factory method to create a new Idea Snap post
 * 
 * @param {Object} data - Idea Snap data
 * @returns {Promise<Object>} - Created Idea Snap post
 */
IdeaSnapSchema.statics.createIdeaSnap = async function(data) {
  const { content, industry, author, isImplementable, complexity, isPotentialStartup } = data;
  
  // Create a new Post with type 'ideaSnap'
  const post = new Post({
    type: 'ideaSnap',
    content,
    industry,
    author,
    expressionCount: 0,
    povCount: 0,
    engagementCount: 0
  });
  
  // Save the post
  await post.save();
  
  // Create and save the IdeaSnap with reference to the post
  const ideaSnap = new this({
    _id: post._id,
    isImplementable: isImplementable !== undefined ? isImplementable : true,
    complexity: complexity || 'medium',
    isPotentialStartup: isPotentialStartup !== undefined ? isPotentialStartup : false
  });
  
  await ideaSnap.save();
  
  // Return the combined post with IdeaSnap fields
  return { ...post.toObject(), ...ideaSnap.toObject() };
};

/**
 * Find Idea Snaps
 * Method to find Idea Snap posts with filtering and pagination
 * 
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Options for sorting and pagination
 * @returns {Promise<Array>} - Array of Idea Snap posts
 */
IdeaSnapSchema.statics.findIdeaSnaps = async function(filter = {}, options = {}) {
  // Find posts of type 'ideaSnap'
  const ideaSnapPosts = await Post.find({ 
    type: 'ideaSnap',
    ...filter 
  })
  .sort(options.sort || { createdAt: -1 })
  .skip(options.skip || 0)
  .limit(options.limit || 20)
  .populate('author', 'hiIdentityName')
  .lean();
  
  // Get IdeaSnap details for these posts
  const ideaSnapIds = ideaSnapPosts.map(post => post._id);
  const ideaSnapDetails = await this.find({ _id: { $in: ideaSnapIds } }).lean();
  
  // Map IdeaSnap details to posts
  const ideaSnapDetailsMap = ideaSnapDetails.reduce((map, detail) => {
    map[detail._id.toString()] = detail;
    return map;
  }, {});
  
  // Combine post data with IdeaSnap details
  return ideaSnapPosts.map(post => ({
    ...post,
    ...(ideaSnapDetailsMap[post._id.toString()] || {})
  }));
};

// Create and export the IdeaSnap model
const IdeaSnap = mongoose.model('IdeaSnap', IdeaSnapSchema);
module.exports = IdeaSnap;