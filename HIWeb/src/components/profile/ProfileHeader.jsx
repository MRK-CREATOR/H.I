import React from 'react';
import Button from '../common/Button';
import './ProfileHeader.css';

const ProfileHeader = ({ currentUser, onLogout }) => {
  // Generate initials for avatar
  const getInitials = () => {
    if (!currentUser || !currentUser.fullName) return '?';
    
    const names = currentUser.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    
    return names[0].charAt(0).toUpperCase();
  };
  
  // Generate a consistent color based on user ID
  const getAvatarColor = () => {
    if (!currentUser || !currentUser.id) return '#3b82f6'; // Default accent color
    
    // Simple hash function to generate a color
    const hash = Array.from(currentUser.id)
      .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    
    // Generate a hue between 0 and 360
    const hue = Math.abs(hash % 360);
    
    // Use a fixed saturation and lightness for consistency
    return `hsl(${hue}, 70%, 60%)`;
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="profile-header">
      <div 
        className="profile-header__avatar"
        style={{ backgroundColor: getAvatarColor() }}
      >
        {getInitials()}
      </div>
      
      <div className="profile-header__info">
        <h1 className="profile-header__identity">{currentUser.identity}</h1>
        <p className="profile-header__name">{currentUser.fullName}</p>
        <p className="profile-header__joined">
          Joined {new Date(currentUser.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="profile-header__actions">
        <Button variant="text" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;