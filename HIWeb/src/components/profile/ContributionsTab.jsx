import React, { useState, useEffect } from 'react';
import PostCard from '../common/PostCard';
import { usePosts } from '../../contexts/PostContext';
import './ProfileTabs.css';

const ContributionsTab = ({ userId }) => {
  const [userPosts, setUserPosts] = useState([]);
  const { posts } = usePosts();
  
  useEffect(() => {
    // Filter posts by user ID
    const filteredPosts = posts.filter(post => post.userId === userId);
    setUserPosts(filteredPosts);
  }, [posts, userId]);
  
  if (userPosts.length === 0) {
    return (
      <div className="profile-tab profile-tab--empty">
        <div className="profile-tab__empty-state">
          <h3>No contributions yet</h3>
          <p>Share your ideas, thoughts, or observations to see them here!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-tab">
      <div className="profile-tab__count">
        {userPosts.length} {userPosts.length === 1 ? 'contribution' : 'contributions'}
      </div>
      
      <div className="profile-tab__posts">
        {userPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ContributionsTab;