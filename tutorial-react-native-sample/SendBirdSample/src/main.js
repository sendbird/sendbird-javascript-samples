import React from 'react'
import {
  Navigator,
  StyleSheet
} from 'react-native'


import Login from './components/login'
import Channels from './components/channels'
import Chat from './components/chat'

let ROUTES = {
  login: Login,
  channels: Channels,
  chat: Chat
}

var Main = React.createClass({
  renderScene: function(route, navigator) {
    let Component = ROUTES[route.name]
    return <Component route={route} navigator={navigator} />
  },
  render: function() {
    return (
      <Navigator
        style={ styles.container }
        initialRoute={ {name: 'login'} }
        renderScene={this.renderScene}
        configureScene={ () => { return Navigator.SceneConfigs.FloatFromRight; } }
      />
    )
  }
})

let styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

module.exports = Main;