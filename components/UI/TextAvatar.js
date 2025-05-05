import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../theme';

/**
 * TextAvatar component
 * Text-based user avatar to maintain anonymity
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - Text to display (typically initials)
 * @param {number} props.size - Size of the avatar (width and height)
 * @param {string} props.backgroundColor - Background color of the avatar
 * @param {Object} props.style - Additional style for the avatar container
 * @param {Object} props.textStyle - Additional style for the text
 */
const TextAvatar = ({ 
  text, 
  size = 40, 
  backgroundColor = theme.colors.accent, 
  style,
  textStyle
}) => {
  // Calculate font size based on avatar size
  const fontSize = useMemo(() => {
    return Math.floor(size * 0.45); // 45% of size
  }, [size]);
  
  // Calculate border radius (circle)
  const borderRadius = useMemo(() => {
    return size / 2;
  }, [size]);
  
  // Ensure text is uppercase and limited to 2 characters
  const formattedText = useMemo(() => {
    if (!text) return '';
    return text.substring(0, 2).toUpperCase();
  }, [text]);
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor,
          width: size,
          height: size,
          borderRadius: borderRadius,
        },
        style
      ]}
    >
      <Text 
        style={[
          styles.text, 
          { fontSize },
          textStyle
        ]}
      >
        {formattedText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  text: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    textAlign: 'center',
  },
});

export default TextAvatar;