
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import push from './src/push';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => push);
