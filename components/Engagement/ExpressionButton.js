import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';

/**
 * ExpressionButton component
 * Like/expression button for different post types
 * 
 * @param {Object} props - Component props
 * @param {string} props.postType - Type of post (ideaSnap, marketGap, thought, observation)
 * @param {number} props.count - Current expression count
 * @param {boolean} props.active - Whether the expression is active (user has liked)
 * @param {Function} props.onPress - Function to handle expression press
 */
const ExpressionButton = ({ postType, count = 0, active = false, onPress }) => {
  // Animation value for button press
  const [scale] = useState(new Animated.Value(1));
  
  // Get icon name based on post type
  const getIconName = () => {
    switch (postType) {
      case 'ideaSnap':
        return active ? 'bulb' : 'bulb-outline';
      case 'marketGap':
        return active ? 'alert-circle' : 'alert-circle-outline';
      case 'thought':
        return active ? 'help-circle' : 'help-circle-outline';
      case 'observation':
        return active ? 'eye' : 'eye-outline';
      default:
        return active ? 'heart' : 'heart-outline';
    }
  };
  
  // Get icon color based on post type
  const getIconColor = () => {
    if (!active) return theme.colors.textSecondary;
    
    switch (postType) {
      case 'ideaSnap':
        return theme.colors.success;
      case 'marketGap':
        return theme.colors.error;
      case 'thought':
        return theme.colors.info;
      case 'observation':
        return theme.colors.warning;
      default:
        return theme.colors.accent;
    }
  };
  
  // Get background color for active state
  const getActiveBackgroundColor = () => {
    switch (postType) {
      case 'ideaSnap':
        return 'rgba(78, 204, 163, 0.1)'; // success color with opacity
      case 'marketGap':
        return 'rgba(255, 104, 104, 0.1)'; // error color with opacity
      case 'thought':
        return 'rgba(100, 193, 255, 0.1)'; // info color with opacity
      case 'observation':
        return 'rgba(255, 211, 105, 0.1)'; // warning color with opacity
      default:
        return 'rgba(91, 110, 247, 0.1)'; // accent color with opacity
    }
  };
  
  // Handle button press
  const handlePress = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Call onPress prop
    onPress && onPress();
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        active && styles.activeContainer,
        active && { backgroundColor: getActiveBackgroundColor() }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.content,
          { transform: [{ scale }] }
        ]}
      >
        <Icon
          name={getIconName()}
          size={20}
          color={getIconColor()}
        />
        
        <Text
          style={[
            styles.count,
            { color: getIconColor() }
          ]}
        >
          {count > 0 && count}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    borderRadius: theme.borderRadius.small,
  },
  activeContainer: {
    // Background color will be set dynamically
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    marginLeft: theme.spacing.small,
  },
});

export default ExpressionButton;