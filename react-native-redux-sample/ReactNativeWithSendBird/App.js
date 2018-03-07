
import React, { Component } from 'react';
import {
  Platform,
  AppState,
  StyleSheet,
  AsyncStorage,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';

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

const MainNavigator = StackNavigator({
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
  GroupChannelInvite: { screen: GroupChannelInvite },
},
{
  navigationOptions: ({ navigation }) => ({
      headerTitleStyle: { fontWeight: '500' }
  })
});
const sb = null;

class App extends Component {
  _handleAppStateChange = (currentAppState) => {
    if (currentAppState === 'active') {
        console.log('appstate - foreground');
        if(sb) {
            sb.setForegroundState();
        }
    } else if (currentAppState === 'background') {
        console.log('appstate - background');
        if(sb) {
          sb.setBackgroundState();
        }
    }
  }
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  render() {
    return (
      <Provider store={store}>
          <MainNavigator />
      </Provider>
    );
  }
}
export default App;
