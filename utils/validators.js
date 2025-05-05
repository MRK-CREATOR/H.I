/**
 * Form validation functions for H.I. application
 * Contains reusable validation logic for forms
 */

/**
 * Check if value is empty (null, undefined, empty string, or only whitespace)
 * @param {any} value - Value to check
 * @returns {boolean} - True if empty, false otherwise
 */
export const isEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  );
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (isEmpty(email)) return false;
  
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validatePassword = (password) => {
  if (isEmpty(password)) {
    return {
      isValid: false,
      message: 'Password is required',
    };
  }
  
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }
  
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one letter',
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid',
  };
};

/**
 * Validate H.I. Identity Name
 * @param {string} hiIdentityName - H.I. Identity Name to validate
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validateHiIdentityName = (hiIdentityName) => {
  if (isEmpty(hiIdentityName)) {
    return {
      isValid: false,
      message: 'H.I. Identity Name is required',
    };
  }
  
  if (hiIdentityName.length < 3) {
    return {
      isValid: false,
      message: 'H.I. Identity Name must be at least 3 characters long',
    };
  }
  
  if (hiIdentityName.length > 20) {
    return {
      isValid: false,
      message: 'H.I. Identity Name cannot exceed 20 characters',
    };
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(hiIdentityName)) {
    return {
      isValid: false,
      message: 'H.I. Identity Name can only contain alphanumeric characters',
    };
  }
  
  return {
    isValid: true,
    message: 'H.I. Identity Name is valid',
  };
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @param {string} fieldName - Name of the field
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validateRequired = (value, fieldName) => {
  if (isEmpty(value)) {
    return {
      isValid: false,
      message: `${fieldName} is required`,
    };
  }
  
  return {
    isValid: true,
    message: `${fieldName} is valid`,
  };
};

/**
 * Validate maximum length
 * @param {string} value - Value to check
 * @param {number} maxLength - Maximum allowed length
 * @param {string} fieldName - Name of the field
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validateMaxLength = (value, maxLength, fieldName) => {
  if (isEmpty(value)) {
    return {
      isValid: true, // Empty is valid for max length check
      message: '',
    };
  }
  
  if (value.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} cannot exceed ${maxLength} characters`,
    };
  }
  
  return {
    isValid: true,
    message: `${fieldName} is valid`,
  };
};

/**
 * Validate post content
 * @param {string} content - Post content to validate
 * @param {number} maxLength - Maximum allowed length (default: 500)
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validatePostContent = (content, maxLength = 500) => {
  const requiredCheck = validateRequired(content, 'Content');
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }
  
  const lengthCheck = validateMaxLength(content, maxLength, 'Content');
  if (!lengthCheck.isValid) {
    return lengthCheck;
  }
  
  return {
    isValid: true,
    message: 'Content is valid',
  };
};

/**
 * Validate industry field
 * @param {string} industry - Industry value to validate
 * @param {boolean} required - Whether industry is required
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validateIndustry = (industry, required = true) => {
  if (required) {
    const requiredCheck = validateRequired(industry, 'Industry');
    if (!requiredCheck.isValid) {
      return requiredCheck;
    }
  }
  
  const lengthCheck = validateMaxLength(industry, 50, 'Industry');
  if (!lengthCheck.isValid) {
    return lengthCheck;
  }
  
  return {
    isValid: true,
    message: 'Industry is valid',
  };
};

/**
 * Validate thought type
 * @param {string} thoughtType - Thought type to validate
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validateThoughtType = (thoughtType) => {
  const requiredCheck = validateRequired(thoughtType, 'Thought type');
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }
  
  if (!['whatIf', 'whyNot'].includes(thoughtType)) {
    return {
      isValid: false,
      message: 'Invalid thought type. Must be "whatIf" or "whyNot".',
    };
  }
  
  return {
    isValid: true,
    message: 'Thought type is valid',
  };
};

/**
 * Validate post type
 * @param {string} postType - Post type to validate
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validatePostType = (postType) => {
  const requiredCheck = validateRequired(postType, 'Post type');
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }
  
  if (!['ideaSnap', 'marketGap', 'thought', 'observation'].includes(postType)) {
    return {
      isValid: false,
      message: 'Invalid post type. Must be "ideaSnap", "marketGap", "thought", or "observation".',
    };
  }
  
  return {
    isValid: true,
    message: 'Post type is valid',
  };
};

/**
 * Validate login form
 * @param {Object} formData - Form data with email and password
 * @returns {Object} - Validation result with isValid flag and errors object
 */
export const validateLoginForm = (formData) => {
  const { email, password } = formData;
  const errors = {};
  
  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (isEmpty(password)) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate registration form
 * @param {Object} formData - Form data with fullName, email, hiIdentityName, password, and confirmPassword
 * @returns {Object} - Validation result with isValid flag and errors object
 */
export const validateRegistrationForm = (formData) => {
  const { fullName, email, hiIdentityName, password, confirmPassword } = formData;
  const errors = {};
  
  const fullNameCheck = validateRequired(fullName, 'Full Name');
  if (!fullNameCheck.isValid) {
    errors.fullName = fullNameCheck.message;
  } else if (fullName.length > 50) {
    errors.fullName = 'Full Name cannot exceed 50 characters';
  }
  
  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  const hiIdentityCheck = validateHiIdentityName(hiIdentityName);
  if (!hiIdentityCheck.isValid) {
    errors.hiIdentityName = hiIdentityCheck.message;
  }
  
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.isValid) {
    errors.password = passwordCheck.message;
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate post creation form
 * @param {Object} formData - Form data with type, content, industry, and thoughtType
 * @returns {Object} - Validation result with isValid flag and errors object
 */
export const validatePostForm = (formData) => {
  const { type, content, industry, thoughtType } = formData;
  const errors = {};
  
  const typeCheck = validatePostType(type);
  if (!typeCheck.isValid) {
    errors.type = typeCheck.message;
  }
  
  const contentCheck = validatePostContent(content);
  if (!contentCheck.isValid) {
    errors.content = contentCheck.message;
  }
  
  // Industry is required for all types except observation
  const industryRequired = type !== 'observation';
  const industryCheck = validateIndustry(industry, industryRequired);
  if (!industryCheck.isValid) {
    errors.industry = industryCheck.message;
  }
  
  // Thought type is required for thought posts
  if (type === 'thought') {
    const thoughtTypeCheck = validateThoughtType(thoughtType);
    if (!thoughtTypeCheck.isValid) {
      errors.thoughtType = thoughtTypeCheck.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate engagement form (POV, Solution, Discussion, Debate)
 * @param {Object} formData - Form data with content
 * @returns {Object} - Validation result with isValid flag and errors object
 */
export const validateEngagementForm = (formData) => {
  const { content } = formData;
  const errors = {};
  
  const contentCheck = validatePostContent(content);
  if (!contentCheck.isValid) {
    errors.content = contentCheck.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate profile update form
 * @param {Object} formData - Form data with fullName, email, hiIdentityName, password, and currentPassword
 * @returns {Object} - Validation result with isValid flag and errors object
 */
export const validateProfileUpdateForm = (formData) => {
  const { fullName, email, hiIdentityName, password, currentPassword } = formData;
  const errors = {};
  
  // Full name validation
  if (fullName !== undefined && fullName !== null) {
    if (fullName.length > 50) {
      errors.fullName = 'Full Name cannot exceed 50 characters';
    }
  }
  
  // Email validation
  if (email !== undefined && email !== null && email !== '') {
    if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
  }
  
  // H.I. Identity Name validation
  if (hiIdentityName !== undefined && hiIdentityName !== null && hiIdentityName !== '') {
    const hiIdentityCheck = validateHiIdentityName(hiIdentityName);
    if (!hiIdentityCheck.isValid) {
      errors.hiIdentityName = hiIdentityCheck.message;
    }
  }
  
  // Password validation
  if (password !== undefined && password !== null && password !== '') {
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      errors.password = passwordCheck.message;
    }
    
    // Current password is required when changing password
    if (isEmpty(currentPassword)) {
      errors.currentPassword = 'Current password is required to set a new password';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  isEmpty,
  isValidEmail,
  validatePassword,
  validateHiIdentityName,
  validateRequired,
  validateMaxLength,
  validatePostContent,
  validateIndustry,
  validateThoughtType,
  validatePostType,
  validateLoginForm,
  validateRegistrationForm,
  validatePostForm,
  validateEngagementForm,
  validateProfileUpdateForm,
};
  