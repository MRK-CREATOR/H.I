const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Post Schema
 * Generic schema for all post types in the H.I. platform
 */
const PostSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['ideaSnap', 'marketGap', 'thought', 'observation'],
    index: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Post content cannot exceed 500 characters']
  },
  industry: {
    type: String,
    trim: true,
    index: true
  },
  // Fields for thought posts
  thoughtType: {
    type: String,
    enum: ['whatIf', 'whyNot'],
    required: function() {
      return this.type === 'thought';
    }
  },
  // Engagement counters
  expressionCount: {
    type: Number,
    default: 0,
    min: 0
  },
  povCount: {
    type: Number,
    default: 0,
    min: 0
  },
  solutionCount: {
    type: Number,
    default: 0,
    min: 0
  },
  discussionCount: {
    type: Number,
    default: 0,
    min: 0
  },
  debateCount: {
    type: Number,
    default: 0,
    min: 0
  },
  endorsementCount: {
    type: Number,
    default: 0,
    min: 0
  },
  engagementCount: {
    type: Number,
    default: 0,
    min: 0
  },
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
PostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
PostSchema.index({ type: 1, createdAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ expressionCount: -1 });
PostSchema.index({ industry: 1, type: 1 });

// Create and export the Post model
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;