import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import './Registration.css';

const Registration = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [identity, setIdentity] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!identity.trim()) {
      newErrors.identity = 'H.I. Identity Name is required';
    } else if (identity.length < 3) {
      newErrors.identity = 'Identity must be at least 3 characters';
    } else if (identity.length > 20) {
      newErrors.identity = 'Identity must be less than 20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(identity)) {
      newErrors.identity = 'Identity can only contain letters, numbers, and underscores';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call register function from AuthContext
      await register(fullName, email, identity);
      
      // Navigate to welcome screen
      navigate('/welcome');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ form: 'An error occurred during registration. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="registration">
      <div className="registration__logo-container">
        <Logo className="registration__logo pulse" />
      </div>
      
      <h1 className="registration__title">Join H.I.</h1>
      
      <p className="registration__tagline">Stay Curious. Stay Fearless.</p>
      
      {errors.form && (
        <div className="registration__error registration__error--form">
          {errors.form}
        </div>
      )}
      
      <form className="registration__form" onSubmit={handleSubmit}>
        <div className="registration__form-group">
          <label htmlFor="fullName" className="registration__label">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className={`registration__input ${errors.fullName ? 'registration__input--error' : ''}`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <div className="registration__error">{errors.fullName}</div>
          )}
        </div>
        
        <div className="registration__form-group">
          <label htmlFor="email" className="registration__label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className={`registration__input ${errors.email ? 'registration__input--error' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <div className="registration__error">{errors.email}</div>
          )}
        </div>
        
        <div className="registration__form-group">
          <label htmlFor="identity" className="registration__label">
            H.I. Identity Name
          </label>
          <input
            type="text"
            id="identity"
            className={`registration__input ${errors.identity ? 'registration__input--error' : ''}`}
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            placeholder="Choose a unique screen name"
          />
          <div className="registration__hint">
            Alphanumeric characters only, no spaces
          </div>
          {errors.identity && (
            <div className="registration__error">{errors.identity}</div>
          )}
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </div>
  );
};

export default Registration;