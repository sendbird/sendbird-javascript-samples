import React, { Component } from 'react';
import { Platform, AppState } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import SendBird from 'sendbird';
import firebase from 'react-native-firebase';

import store from './src/store';

import Start from './src/screens/Start';
import Login from './src/screens/Login';
import Menu from './src/screens/Menu';
import Profile from './src/screens/Profile';
import OpenChannel from './src/screens/OpenChannel';
import OpenChannelCreate from './src/screens/OpenChannelCreate';
import Chat from './src/screens/Chat';
import Member from './src/screens/Member';
import BlockUser from './src/screens/BlockUser';
import GroupChannel from './src/screens/GroupChannel';
import GroupChannelInvite from './src/screens/GroupChannelInvite';
import appStateChangeHandler from './src/appStateChangeHandler';

let AppNavigator;
let AppContainer;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.appStateHandler = appStateChangeHandler.getInstance();
    AppNavigator = createStackNavigator(
      {
        Start: { screen: Start },
        Login: { screen: Login },
        Menu: { screen: Menu },
        Profile: { screen: Profile },
        OpenChannel: { screen: OpenChannel },
        OpenChannelCreate: { screen: OpenChannelCreate },
        Chat: { screen: Chat },
        Member: { screen: Member },
        BlockUser: { screen: BlockUser },
        GroupChannel: { screen: GroupChannel },
        GroupChannelInvite: { screen: GroupChannelInvite }
      },
      {
        initialRouteName: 'Start',
        navigationOptions: ({ navigation }) => ({
          headerTitleStyle: { fontWeight: '500' }
        })
      }
    );
    AppContainer = createAppContainer(AppNavigator);
  }

  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      'com.reactnativewithsendbird.default_channel_id',
      'React Native Redux sample',
      firebase.notifications.Android.Importance.Max
    ).setDescription('React Native Redux sample notification channel');
    firebase.notifications().android.createChannel(channel);

    console.disableYellowBox = true;
    console.log('app is launched');
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    console.log('app is killed');
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }

  _handleAppStateChange = nextAppState => {
    const sb = SendBird.getInstance();
    if (sb) {
      if (nextAppState === 'active') {
        if (Platform.OS === 'ios') {
          PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
        console.log('app is into foreground');
        sb.setForegroundState();
        this.appStateHandler.notify();
      } else if (nextAppState === 'background') {
        console.log('app is into background');
        sb.setBackgroundState();
      }
    }
  };
}
