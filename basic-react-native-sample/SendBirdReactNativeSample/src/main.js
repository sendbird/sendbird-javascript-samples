var React = require('react-native')
var {
  Navigator,
  StyleSheet
} = React;

var Signin = require('./components/authentication/signin');
var Index = require('./components/chat/index');
var Info = require('./components/chat/info');
var User = require('./components/chat/user');
var Messaging = require('./components/chat/messaging');
var OpenChat = require('./components/chat/openChat');
var Chat = require('./components/chat/chat');
var Members = require('./components/chat/members');

var ROUTES = {
  signin: Signin,
  index: Index,
  info: Info,
  user: User,
  messaging: Messaging,
  openChat: OpenChat,
  chat: Chat,
  members: Members,
};

module.exports = React.createClass({
  conponentWillMount: function() {
    // init code before call render
  },
  renderScene: function(route, navigator) {
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} />;
  },
  render: function() {
    return (
      <Navigator
        style={ styles.container }
        initialRoute={ {name: 'signin'} }
        renderScene={this.renderScene}
        configureScene={ () => { return Navigator.SceneConfigs.FloatFromRight; } }
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
