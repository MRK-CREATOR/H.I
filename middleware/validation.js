const { body, validationResult } = require('express-validator');
const config = require('../config');

/**
 * Input validation rules for different routes
 */
const validationRules = {
  // Authentication validation rules
  register: [
    body('fullName')
      .trim()
      .notEmpty().withMessage('Full Name is required')
      .isLength({ max: 50 }).withMessage('Full Name cannot exceed 50 characters'),
    
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(),
    
    body('hiIdentityName')
      .trim()
      .notEmpty().withMessage('H.I. Identity Name is required')
      .isLength({ min: 3 }).withMessage('H.I. Identity Name must be at least 3 characters long')
      .isLength({ max: 20 }).withMessage('H.I. Identity Name cannot exceed 20 characters')
      .isAlphanumeric().withMessage('H.I. Identity Name can only contain alphanumeric characters'),
    
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/\d/).withMessage('Password must contain at least one number')
      .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),
  ],
  
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required'),
  ],
  
  // User profile validation rules
  updateProfile: [
    body('fullName')
      .optional()
      .trim()
      .isLength({ max: 50 }).withMessage('Full Name cannot exceed 50 characters'),
    
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(),
    
    body('hiIdentityName')
      .optional()
      .trim()
      .isLength({ min: 3 }).withMessage('H.I. Identity Name must be at least 3 characters long')
      .isLength({ max: 20 }).withMessage('H.I. Identity Name cannot exceed 20 characters')
      .isAlphanumeric().withMessage('H.I. Identity Name can only contain alphanumeric characters'),
    
    body('password')
      .optional()
      .trim()
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/\d/).withMessage('Password must contain at least one number')
      .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),
    
    body('currentPassword')
      .if(body('password').exists())
      .notEmpty().withMessage('Current password is required to set a new password'),
  ],
  
  // Post validation rules
  post: [
    body('type')
      .trim()
      .notEmpty().withMessage('Post type is required')
      .isIn(config.postTypes).withMessage('Invalid post type'),
    
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ max: 500 }).withMessage('Content cannot exceed 500 characters'),
    
    body('industry')
      .optional()
      .trim()
      .isLength({ max: 50 }).withMessage('Industry cannot exceed 50 characters'),
    
    body('thoughtType')
      .if(body('type').equals('thought'))
      .trim()
      .notEmpty().withMessage('Thought type is required for thought posts')
      .isIn(config.thoughtTypes).withMessage('Invalid thought type'),
  ],
  
  // Idea Snap validation rules
  ideaSnap: [
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ max: 500 }).withMessage('Content cannot exceed 500 characters'),
    
    body('industry')
      .trim()
      .notEmpty().withMessage('Industry is required')
      .isLength({ max: 50 }).withMessage('Industry cannot exceed 50 characters'),
  ],
  
  // Market Gap validation rules
  marketGap: [
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ max: 500 }).withMessage('Content cannot exceed 500 characters'),
    
    body('industry')
      .trim()
      .notEmpty().withMessage('Industry is required')
      .isLength({ max: 50 }).withMessage('Industry cannot exceed 50 characters'),
  ],
  
  // Thought validation rules
  thought: [
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ max: 500 }).withMessage('Content cannot exceed 500 characters'),
    
    body('industry')
      .trim()
      .notEmpty().withMessage('Industry is required')
      .isLength({ max: 50 }).withMessage('Industry cannot exceed 50 characters'),
    
    body('thoughtType')
      .trim()
      .notEmpty().withMessage('Thought type is required')
      .isIn(config.thoughtTypes).withMessage('Invalid thought type'),
  ],
  
  // Observation validation rules
  observation: [
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ max: 500 }).withMessage('Content cannot exceed 500 characters'),
    
    body('industry')
      .optional()
      .trim()
      .isLength({ max: 50 }).withMessage('Industry cannot exceed 50 characters'),
  ],
  
  // Engagement validation rules
  pov: [
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ max: 500 }).withMessage('Content cannot exceed 500 characters'),
  ],
  
  solution: [
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ max: 500 }).withMessage('Content cannot exceed 500 characters'),
  ],
  
  discussion: [
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ max: 500 }).withMessage('Content cannot exceed 500 characters'),
  ],
  
  debate: [
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ max: 500 }).withMessage('Content cannot exceed 500 characters'),
  ],
};

/**
 * Validation middleware generator
 * Returns middleware for validating specific routes
 * 
 * @param {string} route - Route name to get validation rules for
 * @returns {Function} - Express middleware function
 */
exports.validate = (route) => {
  if (!validationRules[route]) {
    throw new Error(`Validation rules not found for route: ${route}`);
  }
  
  return [
    // Apply validation rules
    ...validationRules[route],
    
    // Check for validation errors
    (req, res, next) => {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        // Format error messages
        const formattedErrors = errors.array().map(error => ({
          field: error.param,
          message: error.msg,
        }));
        
        return res.status(400).json({
          error: {
            message: 'Validation failed',
            status: 400,
            errors: formattedErrors,
          }
        });
      }
      
      next();
    }
  ];
};