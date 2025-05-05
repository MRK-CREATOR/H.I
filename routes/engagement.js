const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Engagement Schema
 * Represents user engagements with posts (POVs, Solutions, Discussions, Debates, Expressions)
 */
const EngagementSchema = new Schema({
  // Type of engagement
  type: {
    type: String,
    required: true,
    enum: ['pov', 'solution', 'discussion', 'debate', 'expression', 'endorsement'],
    index: true
  },
  
  // Content of the engagement (not applicable for expressions/endorsements)
  content: {
    type: String,
    trim: true,
    maxlength: [500, 'Engagement content cannot exceed 500 characters'],
    // Required for all types except expression and endorsement
    required: function() {
      return !['expression', 'endorsement'].includes(this.type);
    }
  },
  
  // Reference to the post this engagement is for
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true
  },
  
  // User who created this engagement
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Engagement metadata
  
  // For solutions: indicates if this is marked as the best solution
  isBestSolution: {
    type: Boolean,
    default: false
  },
  
  // For solutions: score given by post author or other users
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  
  // Expressions on this engagement (likes)
  expressionCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to update the updatedAt field
EngagementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
EngagementSchema.index({ post: 1, type: 1, createdAt: -1 });
EngagementSchema.index({ author: 1, type: 1, createdAt: -1 });

/**
 * Find POVs for a post
 * @param {ObjectId} postId - Post ID
 * @param {Object} options - Options for sorting and pagination
 * @returns {Promise<Array>} - Array of POVs
 */
EngagementSchema.statics.findPOVs = async function(postId, options = {}) {
  return this.find({ post: postId, type: 'pov' })
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 20)
    .populate('author', 'hiIdentityName')
    .lean();
};

/**
 * Find Discussions for a What If thought post
 * @param {ObjectId} postId - Post ID
 * @param {Object} options - Options for sorting and pagination
 * @returns {Promise<Array>} - Array of Discussions
 */
EngagementSchema.statics.findDiscussions = async function(postId, options = {}) {
  return this.find({ post: postId, type: 'discussion' })
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 20)
    .populate('author', 'hiIdentityName')
    .lean();
};

/**
 * Find Debates for a Why Not thought post
 * @param {ObjectId} postId - Post ID
 * @param {Object} options - Options for sorting and pagination
 * @returns {Promise<Array>} - Array of Debates
 */
EngagementSchema.statics.findDebates = async function(postId, options = {}) {
  return this.find({ post: postId, type: 'debate' })
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 20)
    .populate('author', 'hiIdentityName')
    .lean();
};

/**
 * Check if a user has expressed interest in a post
 * @param {ObjectId} postId - Post ID
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Boolean>} - Whether the user has expressed interest
 */
EngagementSchema.statics.hasExpressed = async function(postId, userId) {
  const expression = await this.findOne({
    post: postId,
    author: userId,
    type: 'expression'
  });
  
  return !!expression;
};

/**
 * Check if a user has endorsed a post
 * @param {ObjectId} postId - Post ID
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Boolean>} - Whether the user has endorsed the post
 */
EngagementSchema.statics.hasEndorsed = async function(postId, userId) {
  const endorsement = await this.findOne({
    post: postId,
    author: userId,
    type: 'endorsement'
  });
  
  return !!endorsement;
};

/**
 * Toggle expression (like) on a post
 * @param {ObjectId} postId - Post ID
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Object>} - Result of the toggle operation
 */
EngagementSchema.statics.toggleExpression = async function(postId, userId) {
  const existingExpression = await this.findOne({
    post: postId,
    author: userId,
    type: 'expression'
  });
  
  let result;
  
  if (existingExpression) {
    // Remove expression
    await this.findByIdAndDelete(existingExpression._id);
    result = { action: 'removed' };
  } else {
    // Add expression
    const expression = new this({
      type: 'expression',
      post: postId,
      author: userId
    });
    
    await expression.save();
    result = { action: 'added' };
  }
  
  return result;
};

/**
 * Toggle endorsement on a post
 * @param {ObjectId} postId - Post ID
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Object>} - Result of the toggle operation
 */
EngagementSchema.statics.toggleEndorsement = async function(postId, userId) {
  const existingEndorsement = await this.findOne({
    post: postId,
    author: userId,
    type: 'endorsement'
  });
  
  let result;
  
  if (existingEndorsement) {
    // Remove endorsement
    await this.findByIdAndDelete(existingEndorsement._id);
    result = { action: 'removed' };
  } else {
    // Add endorsement
    const endorsement = new this({
      type: 'endorsement',
      post: postId,
      author: userId
    });
    
    await endorsement.save();
    result = { action: 'added' };
  }
  
  return result;
};

/**
 * Mark a solution as the best solution
 * @param {ObjectId} solutionId - Solution ID
 * @returns {Promise<Object>} - Updated solution
 */
EngagementSchema.statics.markAsBestSolution = async function(solutionId) {
  const solution = await this.findById(solutionId);
  
  if (!solution || solution.type !== 'solution') {
    throw new Error('Invalid solution ID');
  }
  
  solution.isBestSolution = true;
  await solution.save();
  
  return solution;
};

// Create and export the Engagement model
const Engagement = mongoose.model('Engagement', EngagementSchema);
module.exports = Engagement;options.skip || 0)
    .limit(options.limit || 20)
    .populate('author', 'hiIdentityName')
    .lean();
};

/**
 * Find Solutions for a Market Gap post
 * @param {ObjectId} postId - Post ID
 * @param {Object} options - Options for sorting and pagination
 * @returns {Promise<Array>} - Array of Solutions
 */
EngagementSchema.statics.findSolutions = async function(postId, options = {}) {
  return this.find({ post: postId, type: 'solution' })
    .sort(options.sort || { createdAt: -1 })
    .skip(