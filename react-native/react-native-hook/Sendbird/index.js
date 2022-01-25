/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import App from './App';
import { name as appName } from './app.json';
import { onRemoteMessage } from './src/utils';

if (Platform.OS !== 'ios') {
  messaging().setBackgroundMessageHandler(onRemoteMessage);
}

AppRegistry.registerComponent(appName, () => App);
