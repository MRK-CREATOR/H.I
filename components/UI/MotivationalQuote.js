import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Animated, Easing } from 'react-native';
import theme from '../../theme';

/**
 * Rotating motivational quote display component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.quotes - Array of quotes to rotate through (uses theme quotes if not provided)
 * @param {number} props.interval - Time interval in ms between quote changes
 * @param {Object} props.style - Additional styles for the quote text
 */
const MotivationalQuote = ({ 
  quotes = theme.motivationalQuotes, 
  interval = 15000, 
  style 
}) => {
  // State for current quote index
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(1))[0];
  
  // Function to change the quote
  const changeQuote = () => {
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // Change quote index
      setCurrentIndex(prevIndex => (prevIndex + 1) % quotes.length);
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };
  
  // Set up interval to change quote
  useEffect(() => {
    // Get a random starting index
    setCurrentIndex(Math.floor(Math.random() * quotes.length));
    
    // Set up interval to change quote
    const quoteInterval = setInterval(changeQuote, interval);
    
    // Clean up interval on unmount
    return () => clearInterval(quoteInterval);
  }, [quotes, interval]);
  
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={[styles.quoteText, style]}>
        {quotes[currentIndex]}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  quoteText: {
    fontFamily: theme.fonts.italic || theme.fonts.regular,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
});

export default MotivationalQuote;