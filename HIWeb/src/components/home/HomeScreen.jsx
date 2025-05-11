import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import NavigationBar from '../common/NavigationBar';
import PostingTabs from './PostingTabs';
import PostFeed from './PostFeed';
import { usePosts } from '../../contexts/PostContext';
import './HomeScreen.css';

const HomeScreen = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const { filterPosts } = usePosts();
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  const handleFilterClick = (isOpen) => {
    setShowFilters(isOpen);
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setShowFilters(false);
  };
  
  useEffect(() => {
    // Update filtered posts when active filter changes
    const posts = filterPosts(activeFilter);
    setFilteredPosts(posts);
  }, [activeFilter, filterPosts]);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="home-screen">
      <Header />
      
      <main className="home-screen__content">
        <div className="home-screen__container">
          <PostingTabs />
          
          {showFilters && (
            <div className="home-screen__filters">
              <h3 className="home-screen__filters-title">Filter by type</h3>
              <div className="home-screen__filters-options">
                <button 
                  className={`home-screen__filter-btn ${activeFilter === 'all' ? 'home-screen__filter-btn--active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  All Posts
                </button>
                <button 
                  className={`home-screen__filter-btn ${activeFilter === 'ideaSnap' ? 'home-screen__filter-btn--active' : ''}`}
                  onClick={() => handleFilterChange('ideaSnap')}
                >
                  Idea Snaps
                </button>
                <button 
                  className={`home-screen__filter-btn ${activeFilter === 'marketGap' ? 'home-screen__filter-btn--active' : ''}`}
                  onClick={() => handleFilterChange('marketGap')}
                >
                  Market Gaps
                </button>
                <button 
                  className={`home-screen__filter-btn ${activeFilter === 'thought' ? 'home-screen__filter-btn--active' : ''}`}
                  onClick={() => handleFilterChange('thought')}
                >
                  Thoughts
                </button>
              </div>
            </div>
          )}
          
          <PostFeed posts={filteredPosts} />
        </div>
      </main>
      
      <NavigationBar onFilterClick={handleFilterClick} />
    </div>
  );
};

export default HomeScreen;