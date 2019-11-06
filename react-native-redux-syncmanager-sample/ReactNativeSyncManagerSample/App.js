import React from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import firebase from 'react-native-firebase';

import SendBird from 'sendbird';
import SendBirdSyncManager from 'sendbird-syncmanager';

import Config from './src/config';
import { store } from './src/store';

import MainController from './src/controller/main';
import ChatController from './src/controller/chat';
import SigninController from './src/controller/signin';
import MemberController from './src/controller/member';
import InviteController from './src/controller/invite';
import NotFoundController from './src/controller/notfound';

const AppNavigator = createStackNavigator(
  {
    Main: { screen: MainController },
    Chat: { screen: ChatController },
    Signin: { screen: SigninController },
    Member: { screen: MemberController },
    Invite: { screen: InviteController },
    NotFound: { screen: NotFoundController }
  },
  {
    initialRouteName: 'Main'
  }
);
const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    SendBirdSyncManager.sendBird = new SendBird({ appId: Config.appId });
    SendBirdSyncManager.useReactNative(AsyncStorage);
  }
  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      'com.reactnativesyncmanagersample.default_channel_id',
      'React Native SyncManager sample',
      firebase.notifications.Android.Importance.Max
    ).setDescription('React Native SyncManager sample notification channel');
    firebase.notifications().android.createChannel(channel);
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  handleAppStateChange = nextAppState => {
    const sb = SendBird.getInstance();
    if (sb) {
      const manager = SendBirdSyncManager.getInstance();
      if (manager) {
        if (nextAppState === 'active') {
          manager.resumeSync();
          sb.setForegroundState();
        } else if (nextAppState === 'background') {
          manager.pauseSync();
          sb.setBackgroundState();
        } else {
          manager.pauseSync();
        }
      }
    }
  };
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
