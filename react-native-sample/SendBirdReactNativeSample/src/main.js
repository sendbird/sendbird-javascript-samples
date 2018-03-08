import React, { Component } from 'react';
import { StyleSheet, AppState, Platform } from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';
import Login from './pages/login';
import OpenChannel from './pages/openChannel';
import CreateChannel from './pages/createChannel';
import Chat from './pages/chat';
import Participants from './pages/participants';
import BlockList from './pages/blockList';
import GroupChannel from './pages/groupChannel';
import InviteUser from './pages/inviteUser';
import Members from './pages/members';

import { APP_ID } from './consts';
import SendBird from 'sendbird';
var sb = null;

var ROUTES = {
  login: Login,
  openChannel: OpenChannel,
  createChannel: CreateChannel,
  chat: Chat,
  participants: Participants,
  blockList: BlockList,
  groupChannel: GroupChannel,
  inviteUser: InviteUser,
  members: Members
};

export default class Main extends Component {
  _handleAppStateChange = currentAppState => {
    if (currentAppState === 'active') {
      console.log('appstate - foreground');
      if (sb) {
        sb.setForegroundState();
      }
    } else if (currentAppState === 'background') {
      console.log('appstate - background');
      if (sb) {
        sb.setBackgroundState();
      }
    }
  };

  componentDidMount() {
    sb = new SendBird({ appId: APP_ID });

    AppState.addEventListener('change', this._handleAppStateChange);
    var Notifications = require('react-native-push-notification');
    Notifications.configure({
      onRegister: function(token) {
        if (Platform.OS === 'ios') {
          sb.registerAPNSPushTokenForCurrentUser(token['token'], function(result, error) {
            console.log('registerAPNSPushTokenForCurrentUser');
            console.log(result);
          });
        } else {
          sb.registerGCMPushTokenForCurrentUser(token['token'], function(result, error) {
            console.log('registerAPNSPushTokenForCurrentUser');
            console.log(result);
          });
        }
      },

      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
      },

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: '984140644677',

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    return (
      <NavigationExperimental.Navigator
        initialRoute={{ name: 'login' }}
        renderScene={this._renderScene}
        configureScene={() => {
          return NavigationExperimental.Navigator.SceneConfigs.FloatFromRight;
        }}
        style={styles.container}
      />
    );
  }

  _renderScene(route, navigator) {
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
