const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate('register'), authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', validate('login'), authController.login);

/**
 * @route   GET /api/v1/auth/verify
 * @desc    Verify user token
 * @access  Private
 */
router.get('/verify', authController.verifyToken);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public (with refresh token)
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user / invalidate token
 * @access  Private
 */
router.post('/logout', authController.logout);

module.exports = router;