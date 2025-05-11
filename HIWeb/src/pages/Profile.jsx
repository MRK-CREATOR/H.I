import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileScreen from '../components/profile/ProfileScreen';
import './Profile.css';

const Profile = () => {
  const { currentUser, loading } = useAuth();
  
  // If user is not logged in, redirect to auth page
  if (!loading && !currentUser) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="profile-page">
      {currentUser && <ProfileScreen />}
    </div>
  );
};

export default Profile;