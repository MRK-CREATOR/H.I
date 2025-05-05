import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useDispatch } from 'react-redux';
import theme from '../theme';

/**
 * Initial loading screen with animation
 * Displays when the app is first launched
 * Automatically navigates to Welcome or Home screen based on auth status
 */
const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Animation values
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.8);
  const taglineOpacity = new Animated.Value(0);
  const welcomeOpacity = new Animated.Value(0);
  
  useEffect(() => {
    // Start animations in sequence
    Animated.sequence([
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]),
      
      // Fade in tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      
      // Fade in welcome note
      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Check if user is logged in and navigate accordingly after splash duration
    const checkAuthStatus = async () => {
      try {
        // Simulate token check (replace with actual auth check)
        // const token = await AsyncStorage.getItem('userToken');
        const token = null; // For demo purposes
        
        // Wait for splash screen animations (2.5 seconds as per requirements)
        setTimeout(() => {
          if (token) {
            // User is logged in, navigate to Home
            dispatch({ type: 'SET_TOKEN', payload: token });
            navigation.replace('Main');
          } else {
            // User is not logged in, navigate to Welcome
            navigation.replace('Welcome');
          }
        }, 2500);
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigation.replace('Welcome');
      }
    };
    
    checkAuthStatus();
  }, [dispatch, navigation]);
  
  return (
    <View style={styles.container}>
      {/* Animated logo */}
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            opacity: logoOpacity,
            transform: [{ scale: logoScale }]
          }
        ]}
      >
        <Text style={styles.logo}>H.I.</Text>
      </Animated.View>
      
      {/* Animated tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Stay Curious. Stay Fearless.
      </Animated.Text>
      
      {/* Animated welcome note */}
      <Animated.Text style={[styles.welcomeNote, { opacity: welcomeOpacity }]}>
        Thanks for accepting the request to be part of the beta version to test the future sensation app H.I. Enjoy your time!
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.large,
    ...theme.shadows.large,
  },
  logo: {
    fontFamily: theme.fonts.bold,
    fontSize: 48,
    color: theme.colors.white,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.large,
    color: theme.colors.white,
    marginBottom: theme.spacing.large,
    letterSpacing: 0.5,
  },
  welcomeNote: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 22,
  },
});

export default SplashScreen;