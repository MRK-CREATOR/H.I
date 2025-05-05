const express = require('express');
const router = express.Router();
const engagementController = require('../controllers/engagementController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validation');

/**
 * @route   GET /api/v1/engagement/post/:postId
 * @desc    Get all engagements for a specific post
 * @access  Private
 */
router.get('/post/:postId', auth, engagementController.getPostEngagements);

/**
 * @route   POST /api/v1/engagement/pov/:postId
 * @desc    Add a Point of View (comment) to a post
 * @access  Private
 */
router.post('/pov/:postId', auth, validate('pov'), engagementController.addPOV);

/**
 * @route   POST /api/v1/engagement/solution/:postId
 * @desc    Add a Solution to a Market Gap post
 * @access  Private
 */
router.post('/solution/:postId', auth, validate('solution'), engagementController.addSolution);

/**
 * @route   POST /api/v1/engagement/discussion/:postId
 * @desc    Join discussion on a What If thought
 * @access  Private
 */
router.post('/discussion/:postId', auth, validate('discussion'), engagementController.joinDiscussion);

/**
 * @route   POST /api/v1/engagement/debate/:postId
 * @desc    Join debate on a Why Not thought
 * @access  Private
 */
router.post('/debate/:postId', auth, validate('debate'), engagementController.joinDebate);

/**
 * @route   POST /api/v1/engagement/expression/:postId
 * @desc    Toggle like/expression on a post
 * @access  Private
 */
router.post('/expression/:postId', auth, engagementController.toggleExpression);

/**
 * @route   POST /api/v1/engagement/endorse/:postId
 * @desc    Toggle endorsement on a post
 * @access  Private
 */
router.post('/endorse/:postId', auth, engagementController.toggleEndorsement);

/**
 * @route   DELETE /api/v1/engagement/:engagementId
 * @desc    Delete an engagement (own engagement only)
 * @access  Private
 */
router.delete('/:engagementId', auth, engagementController.deleteEngagement);

module.exports = router;