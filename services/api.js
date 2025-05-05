/**
 * API service for H.I. application
 * Handles all communication with the backend API
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// API configuration
const API_CONFIG = {
  // Base URL of the API
  BASE_URL: process.env.API_URL || 'https://api.hi-app.com/api/v1',
  
  // Request timeout in milliseconds
  TIMEOUT: 15000,
  
  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Set token in async storage and memory
 * @param {string} token - JWT token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<void>}
 */
export const setAuthTokens = async (token, refreshToken) => {
  try {
    if (token) {
      await AsyncStorage.setItem('userToken', token);
    }
    
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken);
    }
  } catch (error) {
    console.error('Error setting auth tokens:', error);
    throw error;
  }
};

/**
 * Clear tokens from async storage
 * @returns {Promise<void>}
 */
export const clearAuthTokens = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Error clearing auth tokens:', error);
    throw error;
  }
};

/**
 * Get auth token from async storage
 * @returns {Promise<string|null>} - JWT token or null if not found
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Get refresh token from async storage
 * @returns {Promise<string|null>} - Refresh token or null if not found
 */
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem('refreshToken');
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Create request headers with authentication token if available
 * @returns {Promise<Object>} - Headers object
 */
export const createHeaders = async () => {
  const headers = { ...API_CONFIG.HEADERS };
  const token = await getAuthToken();
  
  if (token) {
    headers['x-auth-token'] = token;
  }
  
  return headers;
};

/**
 * Handle API response
 * @param {Response} response - Fetch API response
 * @returns {Promise<any>} - Parsed response data
 * @throws {Error} - If response is not ok
 */
export const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();
  
  if (!response.ok) {
    // Handle token expiration
    if (response.status === 401 && data.error && data.error.isExpired) {
      // Try to refresh token
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        // Retry the request with new token
        return {
          retry: true,
        };
      }
    }
    
    // Throw error with response data
    const error = new Error(data.error?.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

/**
 * Refresh auth token using refresh token
 * @returns {Promise<boolean>} - True if token was refreshed successfully
 */
export const refreshAuthToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      // If refresh token is invalid, clear tokens and return false
      await clearAuthTokens();
      return false;
    }
    
    const data = await response.json();
    
    // Set new token
    await setAuthTokens(data.token, null);
    
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

/**
 * Make API request with automatic token refresh
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch API options
 * @returns {Promise<any>} - Parsed response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    // Create request URL
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_CONFIG.BASE_URL}/${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`;
    
    // Create request headers
    const headers = await createHeaders();
    
    // Create request options
    const requestOptions = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };
    
    // Set request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    requestOptions.signal = controller.signal;
    
    // Make request
    const response = await fetch(url, requestOptions);
    clearTimeout(timeoutId);
    
    // Handle response
    const result = await handleResponse(response);
    
    // Retry request if token was refreshed
    if (result && result.retry) {
      // Create new headers with fresh token
      requestOptions.headers = await createHeaders();
      
      // Make request again
      const retryResponse = await fetch(url, requestOptions);
      return await handleResponse(retryResponse);
    }
    
    return result;
  } catch (error) {
    // Handle abort error
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${API_CONFIG.TIMEOUT}ms`);
    }
    
    throw error;
  }
};

/**
 * Convenience methods for common HTTP methods
 */

/**
 * Make GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Parsed response data
 */
export const get = (endpoint, options = {}) => {
  return apiRequest(endpoint, {
    method: 'GET',
    ...options,
  });
};

/**
 * Make POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Parsed response data
 */
export const post = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * Make PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Parsed response data
 */
export const put = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * Make DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Parsed response data
 */
export const del = (endpoint, options = {}) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
    ...options,
  });
};

/**
 * API methods for authentication
 */
export const auth = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Registration response
   */
  register: (userData) => {
    return post('auth/register', userData);
  },
  
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Login response
   */
  login: (email, password) => {
    return post('auth/login', { email, password });
  },
  
  /**
   * Logout user
   * @returns {Promise<Object>} - Logout response
   */
  logout: async () => {
    try {
      const response = await post('auth/logout');
      await clearAuthTokens();
      return response;
    } catch (error) {
      // Clear tokens even if API request fails
      await clearAuthTokens();
      throw error;
    }
  },
  
  /**
   * Verify user token
   * @returns {Promise<Object>} - Verification response
   */
  verify: () => {
    return get('auth/verify');
  },
};

/**
 * API methods for posts
 */
export const posts = {
  /**
   * Get posts with filtering
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Posts response
   */
  getPosts: (params = {}) => {
    // Convert params object to query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return get(`posts${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Get trending posts
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Trending posts response
   */
  getTrending: (params = {}) => {
    // Convert params object to query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return get(`posts/trending${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Get post by ID
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} - Post response
   */
  getPostById: (postId) => {
    return get(`posts/${postId}`);
  },
  
  /**
   * Create generic post
   * @param {Object} postData - Post data
   * @returns {Promise<Object>} - Created post response
   */
  createPost: (postData) => {
    return post('posts', postData);
  },
  
  /**
   * Create idea snap post
   * @param {Object} postData - Idea snap data
   * @returns {Promise<Object>} - Created post response
   */
  createIdeaSnap: (postData) => {
    return post('posts/ideaSnap', postData);
  },
  
  /**
   * Create market gap post
   * @param {Object} postData - Market gap data
   * @returns {Promise<Object>} - Created post response
   */
  createMarketGap: (postData) => {
    return post('posts/marketGap', postData);
  },
  
  /**
   * Create thought post
   * @param {Object} postData - Thought data
   * @returns {Promise<Object>} - Created post response
   */
  createThought: (postData) => {
    return post('posts/thought', postData);
  },
  
  /**
   * Create observation post
   * @param {Object} postData - Observation data
   * @returns {Promise<Object>} - Created post response
   */
  createObservation: (postData) => {
    return post('posts/observation', postData);
  },
  
  /**
   * Delete post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} - Delete response
   */
  deletePost: (postId) => {
    return del(`posts/${postId}`);
  },
};

/**
 * API methods for user profile
 */
export const users = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} - User profile response
   */
  getProfile: () => {
    return get('users/profile');
  },
  
  /**
   * Get user by H.I. Identity name
   * @param {string} hiIdentityName - H.I. Identity name
   * @returns {Promise<Object>} - User response
   */
  getUserByIdentity: (hiIdentityName) => {
    return get(`users/${hiIdentityName}`);
  },
  
  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Updated profile response
   */
  updateProfile: (profileData) => {
    return put('users/profile', profileData);
  },
  
  /**
   * Get current user posts
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - User posts response
   */
  getUserPosts: (params = {}) => {
    // Convert params object to query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return get(`users/posts${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Get posts by H.I. Identity name
   * @param {string} hiIdentityName - H.I. Identity name
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - User posts response
   */
  getPostsByIdentity: (hiIdentityName, params = {}) => {
    // Convert params object to query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return get(`users/${hiIdentityName}/posts${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Get current user interactions
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - User interactions response
   */
  getUserInteractions: (params = {}) => {
    // Convert params object to query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return get(`users/interactions${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Get current user endorsements
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - User endorsements response
   */
  getUserEndorsements: (params = {}) => {
    // Convert params object to query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return get(`users/endorsements${queryString ? `?${queryString}` : ''}`);
  },
};

/**
 * API methods for engagement
 */
export const engagement = {
  /**
   * Get engagements for a post
   * @param {string} postId - Post ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Engagements response
   */
  getPostEngagements: (postId, params = {}) => {
    // Convert params object to query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return get(`engagement/post/${postId}${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Add Point of View (POV) to a post
   * @param {string} postId - Post ID
   * @param {string} content - POV content
   * @returns {Promise<Object>} - POV response
   */
  addPOV: (postId, content) => {
    return post(`engagement/pov/${postId}`, { content });
  },
  
  /**
   * Add Solution to a Market Gap post
   * @param {string} postId - Post ID
   * @param {string} content - Solution content
   * @returns {Promise<Object>} - Solution response
   */
  addSolution: (postId, content) => {
    return post(`engagement/solution/${postId}`, { content });
  },
  
  /**
   * Join discussion on a What If thought
   * @param {string} postId - Post ID
   * @param {string} content - Discussion content
   * @returns {Promise<Object>} - Discussion response
   */
  joinDiscussion: (postId, content) => {
    return post(`engagement/discussion/${postId}`, { content });
  },
  
  /**
   * Join debate on a Why Not thought
   * @param {string} postId - Post ID
   * @param {string} content - Debate content
   * @returns {Promise<Object>} - Debate response
   */
  joinDebate: (postId, content) => {
    return post(`engagement/debate/${postId}`, { content });
  },
  
  /**
   * Toggle expression (like) on a post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} - Expression response
   */
  toggleExpression: (postId) => {
    return post(`engagement/expression/${postId}`, {});
  },
  
  /**
   * Toggle endorsement on a post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} - Endorsement response
   */
  toggleEndorsement: (postId) => {
    return post(`engagement/endorse/${postId}`, {});
  },
  
  /**
   * Delete engagement
   * @param {string} engagementId - Engagement ID
   * @returns {Promise<Object>} - Delete response
   */
  deleteEngagement: (engagementId) => {
    return del(`engagement/${engagementId}`);
  },
};

// Export all API methods
export default {
  setAuthTokens,
  clearAuthTokens,
  getAuthToken,
  getRefreshToken,
  refreshAuthToken,
  auth,
  posts,
  users,
  engagement,
};