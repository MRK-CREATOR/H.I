/**
 * Global theme configuration for the H.I. application
 * Contains colors, typography, spacing, and other design variables
 * Used throughout the app for consistent styling
 */
const theme = {
    // Color palette - Cosmic blue theme as specified in documentation
    colors: {
      // Primary brand colors
      primary: '#0A1A40', // Deep cosmic blue - main brand color
      primaryLight: '#1E3A7B', // Lighter cosmic blue for highlights
      primaryDark: '#050E24', // Darker cosmic blue for shadows
      
      // Secondary colors
      accent: '#5B6EF7', // Vibrant blue for accents and highlights
      accentLight: '#8496FF', // Lighter accent for hover states
      accentDark: '#4051DB', // Darker accent for active states
      
      // Background colors
      background: '#060D20', // Dark background
      backgroundLight: '#0E172D', // Lighter background for cards
      backgroundDark: '#030812', // Darker background for modals
      
      // Text colors
      text: '#FFFFFF', // Primary text color
      textSecondary: '#A9B5D9', // Secondary text color for subtitles
      textDisabled: '#5A6F9F', // Disabled text color
      
      // UI colors
      border: '#1B2949', // Border color
      divider: '#141F3C', // Divider color
      placeholder: '#3F4E73', // Placeholder text color
      
      // Status colors
      success: '#4ECCA3', // Success messages
      warning: '#FFD369', // Warning messages
      error: '#FF6868', // Error messages
      info: '#64C1FF', // Information messages
      
      // Common colors
      white: '#FFFFFF',
      black: '#000000',
      transparent: 'transparent',
    },
    
    // Typography
    fonts: {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
      light: 'Poppins-Light',
    },
    
    // Font sizes
    fontSizes: {
      tiny: 10,
      small: 12,
      regular: 14,
      medium: 16,
      large: 18,
      xlarge: 20,
      xxlarge: 24,
      xxxlarge: 32,
    },
    
    // Spacing
    spacing: {
      tiny: 4,
      small: 8,
      medium: 16,
      large: 24,
      xlarge: 32,
      xxlarge: 48,
    },
    
    // Border radius
    borderRadius: {
      small: 4,
      medium: 8,
      large: 16,
      round: 999, // Fully rounded (for buttons, avatars)
    },
    
    // Shadows
    shadows: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
      },
    },
    
    // Animation durations
    animation: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    
    // Z-index levels
    zIndex: {
      base: 1,
      menu: 10,
      modal: 100,
      tooltip: 1000,
    },
    
    // Screen sizes (for responsive design)
    screenSize: {
      xs: 320,
      sm: 375,
      md: 414,
      lg: 768,
      xl: 1024,
    },
    
    // Motivational quotes for rotating header
    motivationalQuotes: [
      "Stay Hungry. Stay Foolish.",
      "Ideas shape the world.",
      "What if… you're the one?",
      "Stay Curious. Stay Fearless.",
      "Connect dots others don't see.",
      "The future belongs to the fearless.",
      "Think without limits.",
      "Disruption starts with a question.",
      "Your idea could change everything.",
      "Observe. Question. Create."
    ],
  };
  
  export default theme;