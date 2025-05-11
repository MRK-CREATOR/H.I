// App configurations
export const APP_NAME = 'H.I.';
export const APP_TAGLINE = 'Stay Curious. Stay Fearless.';
export const APP_VERSION = '1.0.0';

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'hiUser',
  POSTS: 'hiPosts',
};

// Motivational messages for header rotation
export const MOTIVATIONAL_MESSAGES = [
  "Stay Hungry. Stay Foolish.",
  "Ideas shape the world.",
  "What if… you're the one?",
  "Be curious about everything.",
  "Ideas worth sharing.",
  "Dream big. Start small.",
  "Question the ordinary.",
  "Challenge conventional wisdom.",
  "Think differently.",
  "Genius is seeing what others don't.",
  "Innovation begins with curiosity.",
  "The future belongs to the bold.",
  "Create what doesn't exist yet.",
];

// Post types
export const POST_TYPES = {
  IDEA_SNAP: 'ideaSnap',
  MARKET_GAP: 'marketGap',
  THOUGHT: 'thought',
};

// Thought types
export const THOUGHT_TYPES = {
  WHAT_IF: 'whatIf',
  WHY_NOT: 'whyNot',
  OBSERVATION: 'observation',
};

// API endpoints (for future implementation)
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.h-i.app',
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  POSTS: {
    GET_ALL: '/posts',
    CREATE: '/posts',
    GET_BY_ID: (id) => `/posts/${id}`,
    LIKE: (id) => `/posts/${id}/like`,
    COMMENT: (id) => `/posts/${id}/comment`,
    SOLUTION: (id) => `/posts/${id}/solution`,
  },
  USER: {
    PROFILE: (id) => `/users/${id}`,
    POSTS: (id) => `/users/${id}/posts`,
    INTERACTIONS: (id) => `/users/${id}/interactions`,
    LIKES: (id) => `/users/${id}/likes`,
  },
};

// Industry options
export const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Entertainment',
  'Retail',
  'Manufacturing',
  'Transportation',
  'Energy',
  'Agriculture',
  'Real Estate',
  'Food & Beverage',
  'Artificial Intelligence',
  'Sustainability',
  'Media',
  'Sports',
  'Fashion',
  'Art & Culture',
  'Travel & Tourism',
  'Other',
];