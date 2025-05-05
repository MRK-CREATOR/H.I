import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for profile actions
export const fetchUserPosts = createAsyncThunk(
  'profile/fetchUserPosts',
  async (username, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for MVP
      const mockPosts = [
        {
          id: '1',
          type: 'ideaSnap',
          author: username,
          content: 'An AI co-founder for solopreneurs that can plan, market, and launch products.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          industry: 'Technology',
          expressions: 128,
          povCount: 14,
        },
        {
          id: '3',
          type: 'thought',
          thoughtType: 'whatIf',
          author: username,
          content: 'What if city architecture was designed by AI using happiness metrics as success criteria?',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          industry: 'Urban Planning',
          expressions: 92,
          discussionCount: 21,
        },
        {
          id: '7',
          type: 'marketGap',
          author: username,
          content: 'There\'s no easy way for novice developers to contribute to open source. An onboarding path is needed.',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          industry: 'Software Development',
          expressions: 75,
          povCount: 12,
          solutionCount: 8,
        },
      ];
      
      return mockPosts;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user posts');
    }
  }
);

export const fetchUserInteractions = createAsyncThunk(
  'profile/fetchUserInteractions',
  async (username, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for MVP
      const mockInteractions = [
        {
          id: '1',
          type: 'pov',
          content: 'This could be revolutionary if paired with data analytics to predict customer needs.',
          parentPost: {
            id: '5',
            type: 'ideaSnap',
            author: 'InnovationGuru',
            content: 'A marketplace where corporations can invest in indie creators to develop products.',
            timestamp: new Date(Date.now() - 21600000).toISOString(),
            industry: 'Business',
          },
          timestamp: new Date(Date.now() - 18000000).toISOString(),
        },
        {
          id: '2',
          type: 'solution',
          content: 'Implement micro-credentials with real-world projects throughout courses. Smaller wins keep people motivated.',
          parentPost: {
            id: '6',
            type: 'marketGap',
            author: 'MindHacker',
            content: 'So many people buy online courses but never finish them. What\'s the missing link?',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            industry: 'Education',
          },
          timestamp: new Date(Date.now() - 5400000).toISOString(),
        },
        {
          id: '3',
          type: 'debate',
          content: 'It could create bias toward different kinds of thinkers. Not everyone performs well in sprint conditions.',
          parentPost: {
            id: '7',
            type: 'thought',
            thoughtType: 'whyNot',
            author: 'CriticalThinker',
            content: 'Why not replace resume screening with 5-minute idea tests?',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            industry: 'Human Resources',
          },
          timestamp: new Date(Date.now() - 10800000).toISOString(),
        },
      ];
      
      return mockInteractions;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user interactions');
    }
  }
);

export const fetchUserEndorsements = createAsyncThunk(
  'profile/fetchUserEndorsements',
  async (username, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for MVP
      const mockEndorsements = [
        {
          id: '8',
          type: 'ideaSnap',
          author: 'TechVisionary',
          content: 'A platform that creates personalized nutrition plans based on your DNA, gut biome, and fitness goals.',
          timestamp: new Date(Date.now() - 36000000).toISOString(),
          industry: 'Health',
          expressions: 156,
          povCount: 23,
        },
        {
          id: '9',
          type: 'observation',
          author: 'TrendSpotter',
          content: 'Gen Z isn\'t abandoning email—they\'re just using it differently, primarily for official communications.',
          timestamp: new Date(Date.now() - 28800000).toISOString(),
          industry: 'Digital Trends',
          expressions: 87,
          povCount: 14,
        },
      ];
      
      return mockEndorsements;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user endorsements');
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  'profile/updateUserSettings',
  async (settings, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return the updated settings
      return settings;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user settings');
    }
  }
);

// Initial state
const initialState = {
  userPosts: {
    items: [],
    loading: false,
    error: null,
  },
  userInteractions: {
    items: [],
    loading: false,
    error: null,
  },
  userEndorsements: {
    items: [],
    loading: false,
    error: null,
  },
  settings: {
    data: {},
    loading: false,
    error: null,
  },
  activeTab: 'contributions', // 'contributions', 'interactions', or 'endorsements'
};

// Create slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearProfileError: (state) => {
      state.userPosts.error = null;
      state.userInteractions.error = null;
      state.userEndorsements.error = null;
      state.settings.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user posts cases
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.userPosts.loading = true;
        state.userPosts.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts.loading = false;
        state.userPosts.items = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.userPosts.loading = false;
        state.userPosts.error = action.payload || 'Failed to fetch user posts';
      });
    
    // Fetch user interactions cases
    builder
      .addCase(fetchUserInteractions.pending, (state) => {
        state.userInteractions.loading = true;
        state.userInteractions.error = null;
      })
      .addCase(fetchUserInteractions.fulfilled, (state, action) => {
        state.userInteractions.loading = false;
        state.userInteractions.items = action.payload;
      })
      .addCase(fetchUserInteractions.rejected, (state, action) => {
        state.userInteractions.loading = false;
        state.userInteractions.error = action.payload || 'Failed to fetch user interactions';
      });
    
    // Fetch user endorsements cases
    builder
      .addCase(fetchUserEndorsements.pending, (state) => {
        state.userEndorsements.loading = true;
        state.userEndorsements.error = null;
      })
      .addCase(fetchUserEndorsements.fulfilled, (state, action) => {
        state.userEndorsements.loading = false;
        state.userEndorsements.items = action.payload;
      })
      .addCase(fetchUserEndorsements.rejected, (state, action) => {
        state.userEndorsements.loading = false;
        state.userEndorsements.error = action.payload || 'Failed to fetch user endorsements';
      });
    
    // Update user settings cases
    builder
      .addCase(updateUserSettings.pending, (state) => {
        state.settings.loading = true;
        state.settings.error = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.settings.loading = false;
        state.settings.data = { ...state.settings.data, ...action.payload };
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.settings.loading = false;
        state.settings.error = action.payload || 'Failed to update user settings';
      });
  },
});

// Export actions
export const { setActiveTab, clearProfileError } = profileSlice.actions;

// Export reducer
export default profileSlice.reducer;