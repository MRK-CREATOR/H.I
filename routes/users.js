const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validation');

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/profile', auth, userController.getCurrentUserProfile);

/**
 * @route   GET /api/v1/users/:hiIdentityName
 * @desc    Get user profile by H.I. Identity name
 * @access  Private
 */
router.get('/:hiIdentityName', auth, userController.getUserByIdentity);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/profile', auth, validate('updateProfile'), userController.updateProfile);

/**
 * @route   GET /api/v1/users/posts
 * @desc    Get current user's posts
 * @access  Private
 */
router.get('/posts', auth, userController.getCurrentUserPosts);

/**
 * @route   GET /api/v1/users/:hiIdentityName/posts
 * @desc    Get posts by H.I. Identity name
 * @access  Private
 */
router.get('/:hiIdentityName/posts', auth, userController.getUserPosts);

/**
 * @route   GET /api/v1/users/interactions
 * @desc    Get current user's interactions (comments, solutions, etc.)
 * @access  Private
 */
router.get('/interactions', auth, userController.getCurrentUserInteractions);

/**
 * @route   GET /api/v1/users/endorsements
 * @desc    Get posts endorsed by current user
 * @access  Private
 */
router.get('/endorsements', auth, userController.getCurrentUserEndorsements);

module.exports = router;