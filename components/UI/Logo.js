import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import theme from '../../theme';

/**
 * Animated H.I logo component
 * 
 * @param {Object} props - Component props
 * @param {number} props.size - Size of the logo (width and height)
 * @param {boolean} props.animated - Whether to animate the logo
 * @param {Function} props.onPress - Function to handle logo press
 */
const Logo = ({ size = 60, animated = true, onPress }) => {
  // Animation values
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (animated) {
      // Start the pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Start the subtle rotation animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnimation, {
            toValue: 1,
            duration: 7000,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnimation, {
            toValue: 0,
            duration: 7000,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Start the glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [animated, pulseAnimation, rotateAnimation, glowAnimation]);
  
  // Interpolate rotation value
  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });
  
  // Interpolate shadow opacity
  const shadowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });
  
  // Calculate styles based on size
  const fontSize = Math.max(size / 2.5, 16);
  const borderRadius = size / 2;
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: borderRadius,
          transform: [
            { scale: animated ? pulseAnimation : 1 },
            { rotate: animated ? rotation : '0deg' },
          ],
          shadowOpacity: animated ? shadowOpacity : 0.3,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>H.I.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    letterSpacing: 1,
  },
});

export default Logo;