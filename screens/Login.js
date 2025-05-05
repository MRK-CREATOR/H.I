import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useDispatch } from 'react-redux';
import theme from '../theme';

/**
 * Login screen for returning users
 * Allows users to sign in with their email and password
 */
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form validation
  const validateForm = () => {
    // Reset error
    setError('');
    
    // Simple email validation
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password validation
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    
    return true;
  };
  
  // Handle login submission
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Simulate API call (replace with actual login API)
      console.log('Logging in with:', { email, password });
      
      // Simulating a successful login after delay
      setTimeout(() => {
        // In real app, save token to AsyncStorage
        const fakeToken = 'fake-jwt-token-123456';
        dispatch({ type: 'SET_TOKEN', payload: fakeToken });
        
        setLoading(false);
        // Navigate to Home screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      setError('Failed to login. Please check your credentials and try again.');
    }
  };
  
  // Navigate back to welcome screen
  const handleBack = () => {
    navigation.goBack();
  };
  
  // Navigate to registration screen
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your intellectual journey
            </Text>
          </View>
          
          {/* Login form */}
          <View style={styles.formContainer}>
            {/* Error message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            {/* Email input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            {/* Password input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            {/* Login button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Register link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: theme.spacing.large,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.large,
  },
  backButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
  },
  header: {
    marginBottom: theme.spacing.xlarge,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.xxxlarge,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: theme.spacing.xlarge,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 104, 104, 0.1)',
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  errorText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.small,
    color: theme.colors.error,
  },
  inputContainer: {
    marginBottom: theme.spacing.large,
  },
  inputLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  input: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  loginButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    alignItems: 'center',
    marginTop: theme.spacing.medium,
    ...theme.shadows.small,
  },
  loginButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
  },
  registerLink: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.accent,
  },
});

export default LoginScreen;