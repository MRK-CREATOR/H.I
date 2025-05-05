import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useDispatch } from 'react-redux';
import RegistrationForm from '../components/Authentication/RegistrationForm';
import theme from '../theme';

/**
 * User registration screen
 * Allows new users to create an account
 */
const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  // Handle registration form submission
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      
      // Simulate API call (replace with actual registration API)
      console.log('Registering with data:', userData);
      
      // Simulating a successful registration
      setTimeout(() => {
        // In real app, save token to AsyncStorage and dispatch SET_TOKEN action
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
      console.error('Registration error:', error);
      setLoading(false);
      // In real app, display error message to user
    }
  };
  
  // Navigate back to welcome screen
  const handleBack = () => {
    navigation.goBack();
  };
  
  // Navigate to login screen
  const navigateToLogin = () => {
    navigation.navigate('Login');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join the H.I. community and start sharing your ideas
            </Text>
          </View>
          
          {/* Registration form component */}
          <RegistrationForm 
            onSubmit={handleRegister} 
            loading={loading}
          />
          
          {/* Already have account link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    marginBottom: theme.spacing.large,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.large,
  },
  footerText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.accent,
  },
});

export default RegisterScreen;