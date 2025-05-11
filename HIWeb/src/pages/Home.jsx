import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HomeScreen from '../components/home/HomeScreen';
import './Home.css';

const Home = () => {
  const { currentUser, loading } = useAuth();
  
  // If user is not logged in, redirect to auth page
  if (!loading && !currentUser) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="home-page">
      {currentUser && <HomeScreen />}
    </div>
  );
};

export default Home;