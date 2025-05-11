import React, { useState, useEffect } from 'react';
import PostCard from '../common/PostCard';
import { usePosts } from '../../contexts/PostContext';
import './ProfileTabs.css';

const InteractionsTab = ({ userId }) => {
  const [interactedPosts, setInteractedPosts] = useState([]);
  const { posts } = usePosts();
  
  useEffect(() => {
    // Find posts where user has commented or provided solutions
    const filtered = posts.filter(post => {
      // Check if user has added point of view
      const hasPOV = post.pointsOfView && 
        post.pointsOfView.some(pov => pov.userId === userId);
      
      // Check if user has added solution
      const hasSolution = post.solutions && 
        post.solutions.some(solution => solution.userId === userId);
      
      return hasPOV || hasSolution;
    });
    
    setInteractedPosts(filtered);
  }, [posts, userId]);
  
  if (interactedPosts.length === 0) {
    return (
      <div className="profile-tab profile-tab--empty">
        <div className="profile-tab__empty-state">
          <h3>No interactions yet</h3>
          <p>Comment on posts or propose solutions to see them here!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-tab">
      <div className="profile-tab__count">
        {interactedPosts.length} {interactedPosts.length === 1 ? 'interaction' : 'interactions'}
      </div>
      
      <div className="profile-tab__posts">
        {interactedPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default InteractionsTab;