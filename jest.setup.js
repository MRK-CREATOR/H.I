// Add jest-native matchers
import '@testing-library/jest-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve(null)),
    clear: jest.fn(() => Promise.resolve(null)),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve(null)),
    multiRemove: jest.fn(() => Promise.resolve(null)),
    multiMerge: jest.fn(() => Promise.resolve(null)),
  };
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock Lottie animations
jest.mock('lottie-react-native', () => 'Lottie');

// Mock react-native-svg components
jest.mock('react-native-svg', () => {
  return {
    __esModule: true,
    default: 'Svg',
    Circle: 'Circle',
    Rect: 'Rect',
    Path: 'Path',
    Defs: 'Defs',
    LinearGradient: 'LinearGradient',
    Stop: 'Stop',
    G: 'G',
    Text: 'Text',
    TSpan: 'TSpan',
  };
});

// Mock the navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Setup global navigation container mock for tests
global.navigationContainerMock = {
  navigate: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  getCurrentRoute: jest.fn(() => ({ name: 'MockedScreen' })),
  dangerouslyGetState: jest.fn(() => {
    return {
      index: 0,
      routes: [{ name: 'MockedScreen' }],
    };
  }),
};

// Mock the redux dispatch
global.mockDispatch = jest.fn();

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200,
    headers: {
      get: jest.fn(),
    },
  })
);

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock console methods for testing
global.originalConsoleError = console.error;
global.originalConsoleWarn = console.warn;
global.originalConsoleLog = console.log;

// You can silence specific console methods during tests
// console.error = jest.fn();
// console.warn = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  // Restore console methods if needed
  // console.error = global.originalConsoleError;
  // console.warn = global.originalConsoleWarn;
});