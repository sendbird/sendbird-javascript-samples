var React = require('react-native');
var {
  View,
  Text,
  Image,
  TextInput,
  ListView,
  TouchableHighlight,
  StyleSheet
} = React;
import Popup from 'react-native-popup';

var TopBar = require('../common/topBar');
var ChatBox = require('../common/chatBox');
var sendbird = require('sendbird');

module.exports = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      channel: null
    };
  },
  componentWillMount: function() {
    sendbird.getChannelInfo((data) => {
      this.setState({channel: data});
    });
  },
  render: function() {
    if (!this.state.channel) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyLabel}>Loading......</Text>
        </View>
      );
    }
    if (this.state.channel.isMessaging) {
      return (
        <View style={styles.container}>
          <TopBar
            onBackPress={this.onBackPress}
            messaging={{
              onMemberInvitePress: this.onMemberInvitePress,
              onMemberListPress: this.onMemberListPress,
              onLeaveChannelPress: this.onLeaveChannelPress
            }}
            title={this.state.channel.name}
          />

          <View style={styles.chatContainer}>
            <ChatBox />
          </View>

          <Popup ref={(popup) => {this.popup = popup}} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <TopBar
            onBackPress={this.onBackPress}
            openChat={{
              onMemberListPress: this.onMemberListPress,
              onLeaveChannelPress: this.onLeaveChannelPress
            }}
            title={this.state.channel.name}
          />

          <View style={styles.chatContainer}>
            <ChatBox />
          </View>

          <Popup ref={(popup) => {this.popup = popup}} />
        </View>
      );
    }
  },
  onMemberInvitePress: function() {
    this.props.navigator.push({name: 'user'});
  },
  onMemberListPress: function() {
    this.props.navigator.push({name: 'members'});
  },
  onLeaveChannelPress: function() {
    this.popup.confirm({
      title: 'Are you Sure?',
      content: ['Do you want to leave this channel?'],
      ok: {
        text: 'Yes',
        callback: () => {
          sendbird.leaveChannel(
            this.state.channel.channel_url,
            {
              successFunc: (data) => {
                sendbird.disconnect();
                this.props.navigator.pop();
              },
              errorFunc: (status, error) => {
                console.log(status, error);
              }
            }
          );
        }
      },
      cancel: {
        text: 'No',
        callback: () => { return; }
      }
    });
  },
  onBackPress: function() {
    if (this.state.channel.isMessaging) {
      this.props.navigator.immediatelyResetRouteStack([{name: 'index'}, {name: 'messaging'}]);
    } else {
      this.props.navigator.pop();
    }
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  emptyLabel: {
    fontSize: 18,
    color: '#555555'
  },
  chatContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#f7f8fc'
  }
});
