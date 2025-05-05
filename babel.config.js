module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Enable React Native Reanimated plugin
    'react-native-reanimated/plugin',
    // Module resolver for clean import paths
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
        ],
        alias: {
          // Define aliases for cleaner imports
          '@components': './components',
          '@screens': './screens',
          '@navigation': './navigation',
          '@store': './store',
          '@services': './services',
          '@utils': './utils',
          '@assets': './assets',
          '@styles': './styles',
          '@models': './models',
          '@hooks': './hooks',
          '@config': './config',
          '@constants': './constants',
        },
      },
    ],
    // Optional transform for environment variables
    [
      'transform-inline-environment-variables',
      {
        include: [
          'NODE_ENV',
          'API_URL',
          'APP_VERSION',
        ],
      },
    ],
  ],
  env: {
    production: {
      plugins: [
        // Remove console logs in production
        'transform-remove-console',
      ],
    },
    development: {
      plugins: [
        // Development-only plugins
      ],
    },
    test: {
      plugins: [
        // Test-only plugins
      ],
    },
  },
};