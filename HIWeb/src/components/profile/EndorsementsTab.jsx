import React, { useState, useEffect } from 'react';
import PostCard from '../common/PostCard';
import { usePosts } from '../../contexts/PostContext';
import './ProfileTabs.css';

const EndorsementsTab = ({ userId }) => {
  // For the MVP, we'll just show a placeholder as we don't track endorsements by user
  // In a real app, this would fetch posts the user has endorsed
  
  return (
    <div className="profile-tab profile-tab--empty">
      <div className="profile-tab__empty-state">
        <h3>Endorsements coming soon</h3>
        <p>This feature will be available in the next update!</p>
      </div>
    </div>
  );
};

export default EndorsementsTab;