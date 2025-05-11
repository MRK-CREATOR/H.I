import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import MotivationalHeader from './MotivationalHeader';
import './Header.css';

const Header = ({ minimized = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogo, setShowLogo] = useState(!minimized);
  const [showBranding, setShowBranding] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
        setShowLogo(false);
        setShowBranding(true);
      } else {
        setIsScrolled(false);
        setShowLogo(!minimized);
        setShowBranding(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [minimized]);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <div className="header__left">
          {showLogo && (
            <Link to="/home" className="header__logo-link">
              <Logo className="header__logo" />
            </Link>
          )}
        </div>

        <div className="header__center">
          {showBranding && (
            <div className="header__branding">
              <h1 className="header__title">WHAT THE FUTURE!</h1>
              <MotivationalHeader />
            </div>
          )}
        </div>

        <div className="header__right">
          {/* Placeholder for profile icon or additional navigation */}
        </div>
      </div>
    </header>
  );
};

export default Header;