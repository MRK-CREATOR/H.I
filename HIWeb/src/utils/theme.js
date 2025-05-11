// This file is a reference for the application theme
// The actual styles are implemented in CSS variables (in assets/styles/variables.css)

const theme = {
  colors: {
    primary: '#0a1845', // Deep blue (main background)
    secondary: '#1e3a8a', // Medium blue (component backgrounds)
    accent: '#3b82f6', // Bright blue (buttons, highlights)
    highlight: '#60a5fa', // Light blue (hover states, secondary highlights)
    light: '#e0e7ff', // Very light blue (subtle backgrounds)
    white: '#ffffff', // White (text on dark backgrounds)
    dark: '#020617', // Very dark blue (text on light backgrounds)
    
    text: {
      primary: '#ffffff', // White text
      secondary: '#e0e7ff', // Light blue text
      muted: '#94a3b8', // Gray blue text (less emphasis)
    },
    
    status: {
      success: '#10b981', // Green for success states
      error: '#ef4444', // Red for error states
      warning: '#f59e0b', // Amber for warning states
      info: '#3b82f6', // Blue for information
    },
  },
  
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    xxl: '3rem', // 48px
  },
  
  typography: {
    fontFamily: {
      primary: "'Poppins', sans-serif",
      secondary: "'Space Grotesk', sans-serif",
    },
    
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '1rem', // 16px
    full: '9999px', // Circular
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  
  transitions: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s',
  },
  
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },
};

export default theme;