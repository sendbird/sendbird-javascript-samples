import { AppRegistry } from 'react-native';
import App from './App';
import backgroundPush from './src/backgroundPush';

AppRegistry.registerComponent('ReactNativeWithSendBird', () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundPush);