import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { LogBox } from 'react-native';

// Ignore specific warnings for better development experience
LogBox.ignoreLogs([
  'Remote debugger',
  'Animated: `useNativeDriver`',
  'Non-serializable values were found in the navigation state',
]);

// Register the main component
AppRegistry.registerComponent(appName, () => App);