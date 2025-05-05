import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import theme from '../../theme';

/**
 * Registration form component
 * Collects user information for account creation
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {boolean} props.loading - Loading state for the form
 */
const RegistrationForm = ({ onSubmit, loading }) => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    hiIdentityName: '',
    password: '',
    confirmPassword: '',
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear field error when typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Validate Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    
    // Validate Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    // Validate H.I. Identity Name
    if (!formData.hiIdentityName.trim()) {
      newErrors.hiIdentityName = 'H.I. Identity Name is required';
    } else