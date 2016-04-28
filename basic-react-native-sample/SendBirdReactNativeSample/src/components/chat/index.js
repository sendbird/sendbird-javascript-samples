var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;
import Popup from 'react-native-popup';

var Button = require('../common/button');
var TopBar = require('../common/topBar');
var sendbird = require('sendbird');

module.exports = React.createClass({
  componentWillMount: function() {
    sendbird.setDebugMessage(false);
  },
  render: function() {
    return (
      <View style={styles.container}>

        <TopBar
          onBackPress={this.onBackPress}
          onInfoPress={this.onInfoPress}
          title='SendBird'
        />

        <View style={styles.buttonContainer}>
          <Button
            text={'User List'}
            backgroundColor={'#fafcff'}
            underlayColor={'#abb8c4'}
            borderColor={'#6742d6'}
            textColor={'#6742d6'}
            onPress={this.onUserListPress}
          />
          <Button
            text={'Messaging'}
            backgroundColor={'#32c5e6'}
            underlayColor={'#328FE6'}
            borderColor={'#328FE6'}
            textColor={'#ffffff'}
            onPress={this.onMessagingPress}
          />
          <Button
            text={'Open Chat'}
            backgroundColor={'#329fe6'}
            underlayColor={'#0e6bc4'}
            borderColor={'#0e6bc4'}
            textColor={'#ffffff'}
            onPress={this.onOpenChatPress}
          />
        </View>

        <Popup ref={(popup) => {this.popup = popup}} />
      </View>
    );
  },
  onUserListPress: function() {
    this.props.navigator.push({ name: 'user' });
  },
  onMessagingPress: function() {
    this.props.navigator.push({ name: 'messaging' });
  },
  onOpenChatPress: function() {
    this.props.navigator.push({ name: 'openChat' });
  },
  onInfoPress: function() {
    this.props.navigator.push({ name: 'info' });
  },
  onBackPress: function() {
    this.popup.confirm({
      title: 'Are you Sure?',
      content: ['Do you want to logout?'],
      ok: {
        text: 'Yes',
        callback: () => {
          sendbird.disconnect();
          this.props.navigator.immediatelyResetRouteStack([{ name: 'signin' }]);
        }
      },
      cancel: {
        text: 'No',
        callback: () => { return; }
      }
    });
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#6E5BAA'
  },
  buttonContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
