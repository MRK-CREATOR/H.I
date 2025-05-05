import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for post actions
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ filter = 'all' }, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for MVP
      const mockPosts = [
        {
          id: '1',
          type: 'ideaSnap',
          author: 'AlienX',
          content: 'An AI co-founder for solopreneurs that can plan, market, and launch products.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          industry: 'Technology',
          expressions: 128,
          povCount: 14,
        },
        {
          id: '2',
          type: 'marketGap',
          author: 'MindHacker',
          content: 'So many people buy online courses but never finish them. What\'s the missing link?',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          industry: 'Education',
          expressions: 85,
          povCount: 22,
          solutionCount: 17,
        },
        {
          id: '3',
          type: 'thought',
          thoughtType: 'whatIf',
          author: 'FutureNaut',
          content: 'What if we could subscribe to public transportation like we do to Netflix?',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          industry: 'Transportation',
          expressions: 56,
          discussionCount: 19,
        },
        {
          id: '4',
          type: 'thought',
          thoughtType: 'whyNot',
          author: 'CriticalThinker',
          content: 'Why not replace resume screening with 5-minute idea tests?',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          industry: 'Human Resources',
          expressions: 73,
          debateCount: 31,
        },
        {
          id: '5',
          type: 'observation',
          author: 'TrendSpotter',
          content: 'Burger King ran a campaign where they roasted their own failed ads. Viral and honest.',
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          industry: 'Marketing',
          expressions: 95,
          povCount: 27,
        },
        {
          id: '6',
          type: 'ideaSnap',
          author: 'InnovationGuru',
          content: 'A marketplace where corporations can invest in indie creators to develop products.',
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          industry: 'Business',
          expressions: 112,
          povCount: 8,
        },
      ];
      
      // Filter posts based on type if needed
      let filteredPosts = [...mockPosts];
      
      if (filter !== 'all') {
        switch (filter) {
          case 'ideas':
            filteredPosts = mockPosts.filter(post => post.type === 'ideaSnap');
            break;
          case 'marketGaps':
            filteredPosts = mockPosts.filter(post => post.type === 'marketGap');
            break;
          case 'thoughts':
            filteredPosts = mockPosts.filter(post => post.type === 'thought');
            break;
          case 'observations':
            filteredPosts = mockPosts.filter(post => post.type === 'observation');
            break;
          default:
            break;
        }
      }
      
      return filteredPosts;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch posts');
    }
  }
);

export const fetchTrendingPosts = createAsyncThunk(
  'posts/fetchTrendingPosts',
  async ({ filter = 'all' }, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock trending data for MVP
      const mockTrending = [
        {
          id: '1',
          type: 'ideaSnap',
          author: 'InnovationGuru',
          content: 'A marketplace where corporations can invest in indie creators to develop products.',
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          industry: 'Business',
          expressions: 235,
          povCount: 42,
          trending: true,
        },
        {
          id: '2',
          type: 'marketGap',
          author: 'TechVisionary',
          content: 'There\'s no effective way to visually compare and contrast NFT collections for potential investment.',
          timestamp: new Date(Date.now() - 36000000).toISOString(),
          industry: 'Crypto/Blockchain',
          expressions: 188,
          povCount: 31,
          solutionCount: 27,
          trending: true,
        },
        {
          id: '3',
          type: 'thought',
          thoughtType: 'whatIf',
          author: 'FutureNaut',
          content: 'What if we could subscribe to public transportation like we do to Netflix?',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          industry: 'Transportation',
          expressions: 176,
          discussionCount: 39,
          trending: true,
        },
        {
          id: '4',
          type: 'observation',
          author: 'TrendSpotter',
          content: 'Burger King ran a campaign where they roasted their own failed ads. Viral and honest.',
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          industry: 'Marketing',
          expressions: 155,
          povCount: 27,
          trending: true,
        },
      ];
      
      // Filter posts based on type if needed
      let filteredPosts = [...mockTrending];
      
      if (filter !== 'all') {
        switch (filter) {
          case 'ideas':
            filteredPosts = mockTrending.filter(post => post.type === 'ideaSnap');
            break;
          case 'marketGaps':
            filteredPosts = mockTrending.filter(post => post.type === 'marketGap');
            break;
          case 'thoughts':
            filteredPosts = mockTrending.filter(post => post.type === 'thought');
            break;
          case 'observations':
            filteredPosts = mockTrending.filter(post => post.type === 'observation');
            break;
          default:
            break;
        }
      }
      
      return filteredPosts;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch trending posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a unique ID for the post
      const id = 'post-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
      
      // Create new post with ID and timestamp
      const newPost = {
        ...postData,
        id,
        timestamp: new Date().toISOString(),
        expressions: 0,
        povCount: 0,
      };
      
      // Add additional post type specific fields
      switch (newPost.type) {
        case 'marketGap':
          newPost.solutionCount = 0;
          break;
        case 'thought':
          if (newPost.thoughtType === 'whatIf') {
            newPost.discussionCount = 0;
          } else if (newPost.thoughtType === 'whyNot') {
            newPost.debateCount = 0;
          }
          break;
        default:
          break;
      }
      
      return newPost;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create post');
    }
  }
);

export const addEngagement = createAsyncThunk(
  'posts/addEngagement',
  async ({ postId, engagementType, content, author }, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a unique ID for the engagement
      const id = 'eng-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
      
      // Create new engagement with ID and timestamp
      const newEngagement = {
        id,
        postId,
        type: engagementType,
        content,
        author,
        timestamp: new Date().toISOString(),
      };
      
      return { postId, engagementType, engagement: newEngagement };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add engagement');
    }
  }
);

export const toggleExpression = createAsyncThunk(
  'posts/toggleExpression',
  async ({ postId, active }, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return the toggle result
      return { postId, active };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle expression');
    }
  }
);

// Initial state
const initialState = {
  feed: {
    items: [],
    loading: false,
    error: null,
    filter: 'all',
  },
  trending: {
    items: [],
    loading: false,
    error: null,
  },
  engagements: {
    items: {},
    loading: false,
    error: null,
  },
  creatingPost: {
    loading: false,
    error: null,
  },
};

// Create slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.feed.filter = action.payload;
    },
    clearPostsError: (state) => {
      state.feed.error = null;
      state.trending.error = null;
      state.creatingPost.error = null;
      state.engagements.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch posts cases
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.feed.loading = true;
        state.feed.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.feed.loading = false;
        state.feed.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.feed.loading = false;
        state.feed.error = action.payload || 'Failed to fetch posts';
      });
    
    // Fetch trending posts cases
    builder
      .addCase(fetchTrendingPosts.pending, (state) => {
        state.trending.loading = true;
        state.trending.error = null;
      })
      .addCase(fetchTrendingPosts.fulfilled, (state, action) => {
        state.trending.loading = false;
        state.trending.items = action.payload;
      })
      .addCase(fetchTrendingPosts.rejected, (state, action) => {
        state.trending.loading = false;
        state.trending.error = action.payload || 'Failed to fetch trending posts';
      });
    
    // Create post cases
    builder
      .addCase(createPost.pending, (state) => {
        state.creatingPost.loading = true;
        state.creatingPost.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.creatingPost.loading = false;
        state.feed.items = [action.payload, ...state.feed.items];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creatingPost.loading = false;
        state.creatingPost.error = action.payload || 'Failed to create post';
      });
    
    // Add engagement cases
    builder
      .addCase(addEngagement.pending, (state) => {
        state.engagements.loading = true;
        state.engagements.error = null;
      })
      .addCase(addEngagement.fulfilled, (state, action) => {
        state.engagements.loading = false;
        
        const { postId, engagementType, engagement } = action.payload;
        
        // Initialize engagement array for post if it doesn't exist
        if (!state.engagements.items[postId]) {
          state.engagements.items[postId] = [];
        }
        
        // Add the new engagement
        state.engagements.items[postId].push(engagement);
        
        // Update the post in the feed
        const feedPostIndex = state.feed.items.findIndex(post => post.id === postId);
        if (feedPostIndex !== -1) {
          switch (engagementType) {
            case 'pov':
              state.feed.items[feedPostIndex].povCount = (state.feed.items[feedPostIndex].povCount || 0) + 1;
              break;
            case 'solution':
              state.feed.items[feedPostIndex].solutionCount = (state.feed.items[feedPostIndex].solutionCount || 0) + 1;
              break;
            case 'discussion':
              state.feed.items[feedPostIndex].discussionCount = (state.feed.items[feedPostIndex].discussionCount || 0) + 1;
              break;
            case 'debate':
              state.feed.items[feedPostIndex].debateCount = (state.feed.items[feedPostIndex].debateCount || 0) + 1;
              break;
            default:
              break;
          }
        }
        
        // Update the post in trending if it exists there too
        const trendingPostIndex = state.trending.items.findIndex(post => post.id === postId);
        if (trendingPostIndex !== -1) {
          switch (engagementType) {
            case 'pov':
              state.trending.items[trendingPostIndex].povCount = (state.trending.items[trendingPostIndex].povCount || 0) + 1;
              break;
            case 'solution':
              state.trending.items[trendingPostIndex].solutionCount = (state.trending.items[trendingPostIndex].solutionCount || 0) + 1;
              break;
            case 'discussion':
              state.trending.items[trendingPostIndex].discussionCount = (state.trending.items[trendingPostIndex].discussionCount || 0) + 1;
              break;
            case 'debate':
              state.trending.items[trendingPostIndex].debateCount = (state.trending.items[trendingPostIndex].debateCount || 0) + 1;
              break;
            default:
              break;
          }
        }
      })
      .addCase(addEngagement.rejected, (state, action) => {
        state.engagements.loading = false;
        state.engagements.error = action.payload || 'Failed to add engagement';
      });
    
    // Toggle expression cases
    builder
      .addCase(toggleExpression.fulfilled, (state, action) => {
        const { postId, active } = action.payload;
        
        // Update the post in the feed
        const feedPostIndex = state.feed.items.findIndex(post => post.id === postId);
        if (feedPostIndex !== -1) {
          state.feed.items[feedPostIndex].expressions = 
            active 
              ? state.feed.items[feedPostIndex].expressions + 1 
              : state.feed.items[feedPostIndex].expressions - 1;
        }
        
        // Update the post in trending if it exists there too
        const trendingPostIndex = state.trending.items.findIndex(post => post.id === postId);
        if (trendingPostIndex !== -1) {
          state.trending.items[trendingPostIndex].expressions = 
            active 
              ? state.trending.items[trendingPostIndex].expressions + 1 
              : state.trending.items[trendingPostIndex].expressions - 1;
        }
      });
  },
});

// Export actions
export const { setFilter, clearPostsError } = postsSlice.actions;

// Export reducer
export default postsSlice.reducer;
