import { useContext, useEffect, useState, useCallback } from 'react';
import PostContext from '../contexts/PostContext';

/**
 * Custom hook for utilizing post data and actions
 * This encapsulates the PostContext and provides additional utility functions
 * 
 * @returns {Object} Post related data and functions
 */
const usePosts = () => {
  const context = useContext(PostContext);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  
  const { posts } = context;
  
  // Apply filters to posts
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPosts(posts);
    } else {
      let filtered = posts;
      
      // Filter by post type
      if (['ideaSnap', 'marketGap', 'thought'].includes(activeFilter)) {
        filtered = filtered.filter(post => post.type === activeFilter);
      }
      
      // Filter by thought type
      if (['whatIf', 'whyNot', 'observation'].includes(activeFilter)) {
        filtered = filtered.filter(
          post => post.type === 'thought' && post.thoughtType === activeFilter
        );
      }
      
      // Filter by industry (if implemented)
      // Filter by trending (if implemented)
      // Filter by date range (if implemented)
      
      setFilteredPosts(filtered);
    }
  }, [activeFilter, posts]);
  
  // Set the active filter
  const applyFilter = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);
  
  // Get posts by a specific user
  const getPostsByUser = useCallback((userId) => {
    return posts.filter(post => post.userId === userId);
  }, [posts]);
  
  // Get posts that a user has interacted with
  const getInteractionsByUser = useCallback((userId) => {
    return posts.filter(post => {
      // Check if user has commented or provided solutions
      const hasPOV = post.pointsOfView && 
        post.pointsOfView.some(pov => pov.userId === userId);
      
      const hasSolution = post.solutions && 
        post.solutions.some(solution => solution.userId === userId);
      
      return hasPOV || hasSolution;
    });
  }, [posts]);
  
  // Check if a post has been endorsed by a user
  const hasUserEndorsed = useCallback((postId, userId) => {
    // In a real implementation, this would check against a list of endorsements
    // For the MVP, we'll return false as endorsement tracking is not implemented
    return false;
  }, []);
  
  return {
    ...context, // All original context values and functions
    filteredPosts,
    activeFilter,
    applyFilter,
    getPostsByUser,
    getInteractionsByUser,
    hasUserEndorsed
  };
};

export default usePosts;