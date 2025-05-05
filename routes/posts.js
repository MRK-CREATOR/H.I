const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validation');

/**
 * @route   GET /api/v1/posts
 * @desc    Get all posts with optional filtering
 * @access  Private
 */
router.get('/', auth, postController.getPosts);

/**
 * @route   GET /api/v1/posts/trending
 * @desc    Get trending posts
 * @access  Private
 */
router.get('/trending', auth, postController.getTrendingPosts);

/**
 * @route   GET /api/v1/posts/:id
 * @desc    Get post by ID
 * @access  Private
 */
router.get('/:id', auth, postController.getPostById);

/**
 * @route   POST /api/v1/posts
 * @desc    Create a new post
 * @access  Private
 */
router.post('/', auth, validate('post'), postController.createPost);

/**
 * @route   POST /api/v1/posts/ideaSnap
 * @desc    Create a new Idea Snap post
 * @access  Private
 */
router.post('/ideaSnap', auth, validate('ideaSnap'), postController.createIdeaSnap);

/**
 * @route   POST /api/v1/posts/marketGap
 * @desc    Create a new Market Gap post
 * @access  Private
 */
router.post('/marketGap', auth, validate('marketGap'), postController.createMarketGap);

/**
 * @route   POST /api/v1/posts/thought
 * @desc    Create a new Thought post (What If/Why Not)
 * @access  Private
 */
router.post('/thought', auth, validate('thought'), postController.createThought);

/**
 * @route   POST /api/v1/posts/observation
 * @desc    Create a new Observation post
 * @access  Private
 */
router.post('/observation', auth, validate('observation'), postController.createObservation);

/**
 * @route   DELETE /api/v1/posts/:id
 * @desc    Delete a post
 * @access  Private (post owner only)
 */
router.delete('/:id', auth, postController.deletePost);

module.exports = router;