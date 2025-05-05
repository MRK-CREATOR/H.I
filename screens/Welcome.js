import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import theme from '../theme';

/**
 * Onboarding welcome screen
 * Displays app introduction and navigation options to register or login
 */
const WelcomeScreen = ({ navigation }) => {
  // Get device dimensions
  const { width } = Dimensions.get('window');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    // Start fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);
  
  // Navigate to registration screen
  const handleRegister = () => {
    navigation.navigate('Register');
  };
  
  // Navigate to login screen
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>H.I.</Text>
        </View>
        <Text style={styles.appName}>HUMAN INTELLIGENCE</Text>
        <Text style={styles.tagline}>Stay Curious. Stay Fearless.</Text>
      </View>
      
      <Animated.View 
        style={[
          styles.welcomeSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Text style={styles.welcomeTitle}>Welcome to H.I.</Text>
        
        <Text style={styles.welcomeDescription}>
          H.I. is a platform designed for intellectual sharing, where your ideas
          and thoughts can shape the future.
        </Text>
        
        <View style={styles.keyFeaturesContainer}>
          <Text style={styles.featuresTitle}>What you can do:</Text>
          
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Share quick idea snaps</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Identify market gaps and problems</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Post "what if" and "why not" thoughts</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Share interesting observations</Text>
          </View>
        </View>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.registerText}>Create Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.large,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxlarge,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
    ...theme.shadows.medium,
  },
  logo: {
    fontFamily: theme.fonts.bold,
    fontSize: 40,
    color: theme.colors.white,
  },
  appName: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.large,
    color: theme.colors.white,
    letterSpacing: 2,
    marginBottom: theme.spacing.small,
  },
  tagline: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
  },
  welcomeSection: {
    marginBottom: theme.spacing.xxlarge,
  },
  welcomeTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.xxlarge,
    color: theme.colors.white,
    marginBottom: theme.spacing.medium,
  },
  welcomeDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.large,
  },
  keyFeaturesContainer: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.large,
    marginBottom: theme.spacing.large,
  },
  featuresTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    marginBottom: theme.spacing.medium,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
    marginRight: theme.spacing.medium,
  },
  featureText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
  },
  buttonContainer: {
    width: '100%',
  },
  registerButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    alignItems: 'center',
    marginBottom: theme.spacing.large,
    ...theme.shadows.small,
  },
  registerText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
  },
  loginButton: {
    alignItems: 'center',
  },
  loginText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
  },
});

export default WelcomeScreen;