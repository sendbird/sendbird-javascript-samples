import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  StyleSheet
} from 'react-native';

import Login from './pages/login';
import OpenChannel from './pages/openChannel';
import CreateChannel from './pages/createChannel';
import Chat from './pages/chat';
import Participants from './pages/participants';
import BlockList from './pages/blockList';
import GroupChannel from './pages/groupChannel';
import InviteUser from './pages/inviteUser';
import Members from './pages/members'

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
  render() {
    return (
      <Navigator
        initialRoute={{name: 'login'}}
        renderScene={this._renderScene}
        configureScene={() => {return Navigator.SceneConfigs.FloatFromRight;}}
        style={styles.container}
      />
    )
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
