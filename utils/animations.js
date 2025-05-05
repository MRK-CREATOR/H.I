/**
 * Animation utility functions for H.I. application
 * Contains reusable animation configurations for React Native Animated API
 */
import { Animated, Easing } from 'react-native';

/**
 * Create a timing animation with default configuration
 * @param {Animated.Value} value - The animated value to animate
 * @param {Object} config - Animation configuration
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const createTiming = (value, {
  toValue,
  duration = 300,
  easing = Easing.inOut(Easing.ease),
  delay = 0,
  useNativeDriver = true,
}) => {
  return Animated.timing(value, {
    toValue,
    duration,
    easing,
    delay,
    useNativeDriver,
  });
};

/**
 * Create a spring animation with default configuration
 * @param {Animated.Value} value - The animated value to animate
 * @param {Object} config - Animation configuration
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const createSpring = (value, {
  toValue,
  friction = 7,
  tension = 40,
  delay = 0,
  useNativeDriver = true,
}) => {
  return Animated.spring(value, {
    toValue,
    friction,
    tension,
    delay,
    useNativeDriver,
  });
};

/**
 * Fade in animation
 * @param {Animated.Value} opacity - The opacity animated value
 * @param {Object} config - Animation configuration
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const fadeIn = (opacity, {
  duration = 300,
  delay = 0,
  useNativeDriver = true,
} = {}) => {
  return createTiming(opacity, {
    toValue: 1,
    duration,
    delay,
    useNativeDriver,
  });
};

/**
 * Fade out animation
 * @param {Animated.Value} opacity - The opacity animated value
 * @param {Object} config - Animation configuration
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const fadeOut = (opacity, {
  duration = 300,
  delay = 0,
  useNativeDriver = true,
} = {}) => {
  return createTiming(opacity, {
    toValue: 0,
    duration,
    delay,
    useNativeDriver,
  });
};

/**
 * Slide in from bottom animation
 * @param {Animated.Value} translateY - The translateY animated value
 * @param {Object} config - Animation configuration
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const slideInFromBottom = (translateY, {
  distance = 100,
  duration = 300,
  delay = 0,
  useNativeDriver = true,
} = {}) => {
  translateY.setValue(distance);
  return createTiming(translateY, {
    toValue: 0,
    duration,
    delay,
    useNativeDriver,
  });
};

/**
 * Slide out to bottom animation
 * @param {Animated.Value} translateY - The translateY animated value
 * @param {Object} config - Animation configuration
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const slideOutToBottom = (translateY, {
  distance = 100,
  duration = 300,
  delay = 0,
  useNativeDriver = true,
} = {}) => {
  return createTiming(translateY, {
    toValue: distance,
    duration,
    delay,
    useNativeDriver,
  });
};

/**
 * Scale in animation
 * @param {Animated.Value} scale - The scale animated value
 * @param {Object} config - Animation configuration
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const scaleIn = (scale, {
  duration = 300,
  delay = 0,
  useNativeDriver = true,
} = {}) => {
  scale.setValue(0.8);
  return createSpring(scale, {
    toValue: 1,
    delay,
    useNativeDriver,
  });
};

/**
 * Scale out animation
 * @param {Animated.Value} scale - The scale animated value
 * @param {Object} config - Animation configuration
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const scaleOut = (scale, {
  duration = 300,
  delay = 0,
  useNativeDriver = true,
} = {}) => {
  return createTiming(scale, {
    toValue: 0.8,
    duration,
    delay,
    useNativeDriver,
  });
};

/**
 * Pulse animation
 * @param {Animated.Value} scale - The scale animated value
 * @param {Object} config - Animation configuration
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const pulse = (scale, {
  minScale = 0.95,
  maxScale = 1.05,
  duration = 1000,
  useNativeDriver = true,
} = {}) => {
  scale.setValue(1);
  return Animated.loop(
    Animated.sequence([
      createTiming(scale, {
        toValue: maxScale,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver,
      }),
      createTiming(scale, {
        toValue: minScale,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver,
      }),
    ])
  );
};

/**
 * Rotate animation
 * @param {Animated.Value} rotation - The rotation animated value
 * @param {Object} config - Animation configuration
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const rotate = (rotation, {
  duration = 2000,
  useNativeDriver = true,
} = {}) => {
  rotation.setValue(0);
  return Animated.loop(
    createTiming(rotation, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver,
    })
  );
};

/**
 * Sequence animation (run animations one after another)
 * @param {Array} animations - Array of animations
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const sequence = (animations) => {
  return Animated.sequence(animations);
};

/**
 * Parallel animation (run animations at the same time)
 * @param {Array} animations - Array of animations
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const parallel = (animations) => {
  return Animated.parallel(animations);
};

/**
 * Stagger animation (run animations with staggered delays)
 * @param {Array} animations - Array of animations
 * @param {number} staggerDelay - Delay between animations
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const stagger = (animations, staggerDelay = 100) => {
  return Animated.stagger(staggerDelay, animations);
};

/**
 * Create interpolation for rotation transform
 * @param {Animated.Value} rotation - The rotation animated value
 * @param {Array} outputRange - Output range in degrees
 * @returns {Animated.AnimatedInterpolation} - The interpolated value
 */
export const interpolateRotation = (rotation, outputRange = ['0deg', '360deg']) => {
  return rotation.interpolate({
    inputRange: [0, 1],
    outputRange,
  });
};

/**
 * Logo animation for splash screen
 * @param {Object} animatedValues - Object containing animated values
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const logoAnimation = ({ opacity, scale, rotation }) => {
  opacity.setValue(0);
  scale.setValue(0.5);
  rotation.setValue(0);
  
  return parallel([
    fadeIn(opacity, { duration: 800 }),
    createSpring(scale, { toValue: 1, tension: 50 }),
    createTiming(rotation, { 
      toValue: 1, 
      duration: 1000, 
      easing: Easing.out(Easing.ease) 
    }),
  ]);
};

/**
 * Welcome screen animation
 * @param {Object} animatedValues - Object containing animated values
 * @returns {Animated.CompositeAnimation} - The animation object
 */
export const welcomeScreenAnimation = ({ logoOpacity, titleOpacity, contentTranslateY }) => {
  logoOpacity.setValue(0);
  titleOpacity.setValue(0);
  contentTranslateY.setValue(50);
  
  return sequence([
    fadeIn(logoOpacity, { duration: 800 }),
    parallel([
      fadeIn(titleOpacity, { duration: 800, delay: 200 }),
      createTiming(contentTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 200,
        easing: Easing.out(Easing.ease),
      }),
    ]),
  ]);
};

export default {
  createTiming,
  createSpring,
  fadeIn,
  fadeOut,
  slideInFromBottom,
  slideOutToBottom,
  scaleIn,
  scaleOut,
  pulse,
  rotate,
  sequence,
  parallel,
  stagger,
  interpolateRotation,
  logoAnimation,
  welcomeScreenAnimation,
};