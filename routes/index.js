const express = require('express');
const router = express.Router();
const config = require('../config');

// Import route modules
const authRoutes = require('./auth');
const postRoutes = require('./posts');
const userRoutes = require('./users');
const engagementRoutes = require('./engagement');

// API version prefix
const apiPrefix = `/v${config.apiVersion}`;

// Register routes with version prefix
router.use(`${apiPrefix}/auth`, authRoutes);
router.use(`${apiPrefix}/posts`, postRoutes);
router.use(`${apiPrefix}/users`, userRoutes);
router.use(`${apiPrefix}/engagement`, engagementRoutes);

// API information endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'H.I. API',
    version: config.apiVersion,
    description: 'API for Human Intelligence (H.I.) platform',
    endpoints: [
      `${apiPrefix}/auth - Authentication endpoints`,
      `${apiPrefix}/posts - Post creation and retrieval`,
      `${apiPrefix}/users - User profile endpoints`,
      `${apiPrefix}/engagement - Comments and interactions`,
    ],
  });
});

// Export router
module.exports = router;