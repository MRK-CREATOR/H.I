module.exports = {
  preset: 'react-native',
  // Transform files with metro-react-native-babel-preset
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // File extensions to look for
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  // Mock non-JS modules
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Module aliases from babel.config.js
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@screens/(.*)$': '<rootDir>/screens/$1',
    '^@navigation/(.*)$': '<rootDir>/navigation/$1',
    '^@store/(.*)$': '<rootDir>/store/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@constants/(.*)$': '<rootDir>/constants/$1',
  },
  // Test setup file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/?(*.)+(spec|test).{js,jsx,ts,tsx}',
  ],
  // What to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/coverage/',
  ],
  // Code coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'screens/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    'services/**/*.{js,jsx,ts,tsx}',
    'store/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/__tests__/**',
    '!**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // Transform paths for different platforms
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|@react-navigation|@react-native-community|react-native-reanimated|lottie-react-native)/)',
  ],
  // Test environment
  testEnvironment: 'node',
  // Global variables available in tests
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsconfig: 'tsconfig.jest.json',
    },
  },
  // Mock timers
  timers: 'fake',
  // Verbose output
  verbose: true,
};