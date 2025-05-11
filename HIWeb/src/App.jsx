import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import AppRoutes from './routes';
import './assets/styles/global.css';

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <AppRoutes />
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;