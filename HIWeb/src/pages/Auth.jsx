import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Registration from '../components/auth/Registration';
import WelcomeScreen from '../components/auth/WelcomeScreen';
import './Auth.css';

const Auth = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to home
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);
  
  if (currentUser) {
    return <Navigate to="/home" />;
  }
  
  return (
    <div className="auth-page">
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default Auth;