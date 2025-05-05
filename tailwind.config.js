/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: '#0A1A40',
        'primary-light': '#1E3A7B',
        'primary-dark': '#050E24',
        
        // Secondary colors
        accent: '#5B6EF7',
        'accent-light': '#8496FF',
        'accent-dark': '#4051DB',
        
        // Background colors
        background: '#060D20',
        'background-light': '#0E172D',
        'background-dark': '#030812',
        
        // Text colors
        text: '#FFFFFF',
        'text-secondary': '#A9B5D9',
        'text-disabled': '#5A6F9F',
        
        // UI colors
        border: '#1B2949',
        divider: '#141F3C',
        placeholder: '#3F4E73',
        
        // Status colors
        success: '#4ECCA3',
        warning: '#FFD369',
        error: '#FF6868',
        info: '#64C1FF',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'tiny': '0.625rem',      // 10px
        'xs': '0.75rem',         // 12px
        'sm': '0.875rem',        // 14px
        'base': '1rem',          // 16px
        'lg': '1.125rem',        // 18px
        'xl': '1.25rem',         // 20px
        '2xl': '1.5rem',         // 24px
        '3xl': '2rem',           // 32px
      },
      spacing: {
        'tiny': '0.25rem',       // 4px
        'xs': '0.5rem',          // 8px
        'sm': '1rem',            // 16px
        'md': '1.5rem',          // 24px
        'lg': '2rem',            // 32px
        'xl': '3rem',            // 48px
      },
      borderRadius: {
        'sm': '0.25rem',         // 4px
        'md': '0.5rem',          // 8px
        'lg': '1rem',            // 16px
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  // Use CSS variables from the global.css for consistency
  corePlugins: {
    // Disable Tailwind's reset to use our own
    preflight: false,
  },
};