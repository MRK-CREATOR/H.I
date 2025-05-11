import { useState, useCallback } from 'react';

/**
 * A custom hook for managing form state and validation
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function that returns an object with errors
 * @returns {Object} Form handling utilities
 */
const useForm = (initialValues = {}, validate = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  }, [errors]);

  // Handle blur events for field validation
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Validate on blur
    const validationErrors = validate(values);
    setErrors(prevErrors => ({
      ...prevErrors,
      ...validationErrors
    }));
  }, [validate, values]);

  // Get direct access to a value
  const getValue = useCallback((name) => values[name], [values]);
  
  // Set a specific value programmatically
  const setValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // Mark all fields as touched on submit
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        // Allow custom error handling from outside
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validate, values]);

  // Reset the form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getValue,
    setValue,
    resetForm
  };
};

export default useForm;