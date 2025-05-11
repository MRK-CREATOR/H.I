import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { useAuth } from './contexts/AuthContext';

const AppRoutes = () => {
  const { currentUser, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to="/home" /> : <Auth />}>
        <Route path="/welcome" element={<Auth />} />
      </Route>
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;