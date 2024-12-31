/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './src/app/app';
// import App from './App';
import { name as appName } from './app.json';
import 'moment/locale/vi';

LogBox.ignoreLogs([
  'Cannot update during an existing state transition',
  'Warning: Cannot update a component from inside the function body of a different component',
  'TypeError: JSON.stringify cannot serialize cyclic structures',
  'RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks'
]);

AppRegistry.registerComponent(appName, () => App);
