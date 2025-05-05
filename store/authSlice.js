import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunks for authentication actions
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // For MVP, simulating a successful login response
      // In a real app, this would be an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const user = {
        fullName: 'Elon Musk', // Example name - would come from API in real app
        hiIdentityName: 'AlienX', // Example identity name
        email,
      };
      
      // Mock token - would come from API in real app
      const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15);
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ fullName, email, hiIdentityName, password }, { rejectWithValue }) => {
    try {
      // For MVP, simulating a successful registration response
      // In a real app, this would be an API call to register
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data - would come from API in real app
      const user = {
        fullName,
        hiIdentityName,
        email,
      };
      
      // Mock token - would come from API in real app
      const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15);
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      return null;
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Check if token exists in AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        return null;
      }
      
      // In a real app, you would validate the token with your API here
      // For MVP, we'll just assume the token is valid
      
      // Mock user data - in a real app, you would fetch this from your API
      const user = {
        fullName: 'Elon Musk', // Example name
        hiIdentityName: 'AlienX', // Example identity name
        email: 'elon@example.com',
      };
      
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Auth check failed');
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear any error message
    clearError: (state) => {
      state.error = null;
    },
    
    // Update user profile
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    
    // Manual set token (for development/testing)
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
    
    // Registration cases
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
    
    // Logout cases
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      });
    
    // Check auth cases
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Auth check failed';
      });
  },
});

// Export actions
export const { clearError, updateUserProfile, setToken } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
