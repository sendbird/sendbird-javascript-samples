import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
import backgroundPush from './src/backgroundPush';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundPush);
