import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as FilterIcon } from '../../assets/images/icons/filter.svg';
import './NavigationBar.css';

const NavigationBar = ({ onFilterClick }) => {
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
    if (onFilterClick) {
      onFilterClick(!isFilterOpen);
    }
  };
  
  return (
    <nav className="navigation-bar">
      <div className="navigation-bar__container">
        <Link 
          to="/home" 
          className={`navigation-bar__link ${location.pathname === '/home' ? 'navigation-bar__link--active' : ''}`}
        >
          WTF!
        </Link>
        
        <Link 
          to="/profile" 
          className={`navigation-bar__link ${location.pathname === '/profile' ? 'navigation-bar__link--active' : ''}`}
        >
          My Profile
        </Link>
        
        <button 
          className={`navigation-bar__filter-btn ${isFilterOpen ? 'navigation-bar__filter-btn--active' : ''}`}
          onClick={handleFilterClick}
          aria-label="Filter content"
        >
          <FilterIcon className="navigation-bar__filter-icon" />
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;