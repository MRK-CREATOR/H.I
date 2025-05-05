const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./Post');

/**
 * Observation Schema
 * Represents Observation posts in the H.I. platform
 * Inherits from the generic Post schema
 */
const ObservationSchema = new Schema({
  // Specific fields for Observations
  
  // The 'observationType' field categorizes the kind of observation
  observationType: {
    type: String,
    enum: ['trend', 'pattern', 'anomaly', 'insight', 'analysis'],
    default: 'insight'
  },
  
  // The 'source' field indicates where the observation was made (optional)
  source: {
    type: String,
    trim: true
  },
  
  // The 'relevance' field indicates how relevant or significant the observation is
  relevance: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // The 'isVerified' field indicates if the observation has been fact-checked
  isVerified: {
    type: Boolean,
    default: false
  }
});

/**
 * Create a new Observation
 * Factory method to create a new Observation post
 * 
 * @param {Object} data - Observation data
 * @returns {Promise<Object>} - Created Observation post
 */
ObservationSchema.statics.createObservation = async function(data) {
  const { content, industry, author, observationType, source, relevance, isVerified } = data;
  
  // Create a new Post with type 'observation'
  const post = new Post({
    type: 'observation',
    content,
    industry, // Industry is optional for observations
    author,
    expressionCount: 0,
    povCount: 0,
    engagementCount: 0
  });
  
  // Save the post
  await post.save();
  
  // Create and save the Observation with reference to the post
  const observation = new this({
    _id: post._id,
    observationType: observationType || 'insight',
    source: source || '',
    relevance: relevance || 'medium',
    isVerified: isVerified !== undefined ? isVerified : false
  });
  
  await observation.save();
  
  // Return the combined post with Observation fields
  return { ...post.toObject(), ...observation.toObject() };
};

/**
 * Find Observations
 * Method to find Observation posts with filtering and pagination
 * 
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Options for sorting and pagination
 * @returns {Promise<Array>} - Array of Observation posts
 */
ObservationSchema.statics.findObservations = async function(filter = {}, options = {}) {
  // Build the query filter
  const queryFilter = { type: 'observation' };
  
  // Add generic filters
  if (filter.author) queryFilter.author = filter.author;
  if (filter.industry) queryFilter.industry = filter.industry;
  
  // Find posts of type 'observation'
  const observationPosts = await Post.find(queryFilter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 20)
    .populate('author', 'hiIdentityName')
    .lean();
  
  // Get Observation details for these posts
  const observationIds = observationPosts.map(post => post._id);
  
  // Build the specialized filter
  const specializedFilter = { _id: { $in: observationIds } };
  
  // Add specialized filters
  if (filter.observationType) specializedFilter.observationType = filter.observationType;
  if (filter.relevance) specializedFilter.relevance = filter.relevance;
  if (filter.isVerified !== undefined) specializedFilter.isVerified = filter.isVerified;
  
  const observationDetails = await this.find(specializedFilter).lean();
  
  // Map Observation details to posts
  const observationDetailsMap = observationDetails.reduce((map, detail) => {
    map[detail._id.toString()] = detail;
    return map;
  }, {});
  
  // Combine post data with Observation details
  return observationPosts
    .filter(post => observationDetailsMap[post._id.toString()])
    .map(post => ({
      ...post,
      ...observationDetailsMap[post._id.toString()]
    }));
};

/**
 * Verify Observation
 * Method to mark an observation as verified
 * 
 * @param {ObjectId} observationId - Observation post ID
 * @returns {Promise<Object>} - Updated Observation
 */
ObservationSchema.statics.verifyObservation = async function(observationId) {
  // Update the Observation
  const observation = await this.findByIdAndUpdate(
    observationId,
    { isVerified: true },
    { new: true }
  );
  
  return observation;
};

// Create and export the Observation model
const Observation = mongoose.model('Observation', ObservationSchema);
module.exports = Observation;