import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Automatically navigate to home screen after 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="welcome-screen">
      <div className="welcome-screen__content">
        <Logo className="welcome-screen__logo pulse" />
        <h1 className="welcome-screen__tagline">Stay Curious. Stay Fearless.</h1>
        <div className="welcome-screen__message">
          <p>Thanks for accepting the request to be part of the beta version to test the future sensation app H.I. Enjoy your time!</p>
        </div>
      </div>
    </div>
  )
}