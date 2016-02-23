var React = require('react-native');
var {
  LinkingIOS,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  StyleSheet
} = React;

var Button = require('react-native-button');
var GiftedSpinner = require('react-native-gifted-spinner');

var sendbird = require('sendbird');
var LOAD_MESSAGE_COUNT = 50;

var GiftedMessenger = require('react-native-gifted-messenger');

module.exports = React.createClass({
  listHeight: 0,
  footerY: 0,
  loadMoreY: 0,
  firstDisplay: true,

  getInitialState: function() {
    return {
      channel: null,
      user: null,
      message: '',
      messageList: [],
      reloadMessage: true,
      isLoading: false
    };
  },
  componentWillMount: function() {
    sendbird.getUserInfo((data) => {
      this.setState({user: data});
    });
    sendbird.getChannelInfo((data) => {
      this.setState({channel: data}, () => {
        if (this.state.channel.isMessaging) {
          sendbird.markAsRead(this.state.channel.channel_url);
        }
      });
    });

    sendbird.events.onMessageReceived = (obj) => {
      var _position = 'left';
      if (obj.user && obj.user.guest_id == this.state.user.guest_id) {
        _position = 'right';
      }
      var newMessage = {
        text: obj.message,
        name: obj.user.name,
        image: {uri: obj.user.image},
        position: _position,
        date: new Date(obj.ts)
      }
      this.setState({messageList: this.state.messageList.concat([newMessage])}, () => {
        if (!this.firstDisplay && obj.user.guest_id == this.state.user.guest_id) {
          setTimeout(()=>{
            this.scrollToBottom();
          }, 500);
        }
      });

      if (this.state.channel.isMessaging) {
        sendbird.markAsRead(this.state.channel.channel_url);
      }
    };
    sendbird.events.onSystemMessageReceived = (obj) => {
      console.log(obj);
    };
    sendbird.events.onFileMessageReceived = (obj) => {
      var _position = 'left';
      if (obj.user && obj.user.guest_id == this.state.user.guest_id) {
        _position = 'right';
      }
      var newMessage = {
        text: obj.name,
        name: obj.user.name,
        image: {uri: obj.user.image},
        position: _position,
        date: new Date(obj.ts)
      }
      this.setState({messageList: this.state.messageList.concat([newMessage])}, () => {
        if (!this.firstDisplay && obj.user.guest_id == this.state.user.guest_id) {
          setTimeout(()=>{
            this.scrollToBottom();
          }, 500);
        }
      });
    };
    sendbird.events.onBroadcastMessageReceived = (obj) => {
      console.log(obj);
    };
    sendbird.events.onMessageDelivery = (obj) => {
      console.log(obj);
    };
    sendbird.events.onTypeStartReceived = (obj) => {
      if (this.state.channel.isMessaging) {
        console.log(obj);
      }
    };
    sendbird.events.onTypeEndReceived = (obj) => {
      if (this.state.channel.isMessaging) {
        console.log(obj);
      }
    };
    sendbird.events.onReadReceived = (obj) => {
      console.log(obj);
    };

  },
  componentDidMount: function() {
    this.getMessages();
  },
  render: function() {
    if (!this.state.channel.channel_url || !this.state.user.guest_id) {
      return (
          <View style={styles.loadMoreMessages}>
            <GiftedSpinner />
          </View>
      );
    }

    return (
      <GiftedMessenger
        ref={(c) => this._GiftedMessenger = c}

        styles={{
          bubbleRight: {
            marginLeft: 70,
            backgroundColor: '#007aff',
          },
        }}

        messages={this.state.messageList}
        handleSend={ (message = {}, rowID = null) => {} }
        maxHeight={Dimensions.get('window').height - 80}
        senderName={this.state.user.nickname}
        senderImage={{uri: this.state.user.image_url}}
        displayNames={true}
        submitOnReturn={true}
        loadEarlierMessagesButton={false}

        onCustomSend={(message) => {
          this._GiftedMessenger.onChangeText('');
          sendbird.message(message.text);
        }}

        onLayout={(event) => {
          var layout = event.nativeEvent.layout;
          this.listHeight = layout.height;
        }}

        renderFooter={() => {
          return <View onLayout={(event)=>{
            var layout = event.nativeEvent.layout;
            this.footerY = layout.y;
          }}></View>
        }}

        renderHeader={() => {

          if (this.state.isLoading) {
            return (
              <View style={styles.loadMoreMessages}>
                <GiftedSpinner />
              </View>
            );
          } else {
            return (
              <View style={styles.loadMoreMessages}>
                <Button
                  style={styles.loadMoreMessagesButton}
                  onPress={() => {
                    this.getMessages();
                  }}
                >
                  Load More Messages
                </Button>
              </View>
            );
          }
        }}
      />
    );
  },
  onSendPress: function(msg) {
    sendbird.message(msg);
    this.setState({message: ''});
  },
  userNameStyle: function(_user) {
    var _color = _user.guest_id == this.state.user.guest_id ? '#4f398f' : '#333e4a';
    return {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: _color
    }
  },
  getMessages: function() {
    this.loadMoreY = this.footerY;
    this.setState({isLoading: true}, () => {
      sendbird.getMessageLoadMore({
        limit: LOAD_MESSAGE_COUNT,
        successFunc: (data) => {
          var _messageList = [];
          data.messages.reverse().forEach((msg, index) => {
            var _position = 'left';
            if (msg.payload.user && msg.payload.user.guest_id == this.state.user.guest_id) {
              _position = 'right';
            }
            if(sendbird.isMessage(msg.cmd)) {
              _messageList.push({
                text: msg.payload.message,
                name: msg.payload.user.name,
                image: {uri: msg.payload.user.image},
                position: _position,
                date: new Date(msg.payload.ts)
              });
            } else if (sendbird.isFileMessage(msg.cmd)) {
              _messageList.push({
                text: msg.payload.name,
                name: msg.payload.user.name,
                image: {uri: msg.payload.user.image},
                position: _position,
                date: new Date(msg.payload.ts)
              });
            }
          });

          this.setState({ messageList: _messageList.concat(this.state.messageList) }, () => {
            this.setState({isLoading: false}, () => {
              if (this.firstDisplay) {
                this.firstDisplay = false;
                setTimeout(() => {this.scrollWithoutAnimationToBottom()}, 500);
              } else {
                setTimeout(() => {this._GiftedMessenger.scrollResponder.scrollTo(this.footerY - this.loadMoreY);}, 500)
              }
            });
          });
        },
        errorFunc: (status, error) => {
          console.log(status, error);
        }
      });
    });
  },
  scrollWithoutAnimationToBottom: function() {
    if (this.listHeight && this.footerY && this.footerY > this.listHeight) {
      var scrollDistance = this.listHeight - this.footerY;
      this._GiftedMessenger.scrollResponder.scrollWithoutAnimationTo(0, -scrollDistance);
    }
  },
  scrollToBottom: function() {
    if (this.listHeight && this.footerY && this.footerY > this.listHeight) {
      var scrollDistance = this.listHeight - this.footerY;
      this._GiftedMessenger.scrollResponder.scrollTo(-scrollDistance);
    }
  }
});

var styles = StyleSheet.create({
  loadMoreMessages: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreMessagesButton: {
    fontSize: 14,
    fontWeight: '200'
  },
});
