import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  ListView,
  TouchableHighlight,
  StyleSheet,
  PixelRatio,
  Modal,
  Alert
} from 'react-native'

import {PULLDOWN_DISTANCE} from '../consts';
import TopBar from '../components/topBar';
import moment from 'moment';
import Button from 'react-native-button';

import SendBird from 'sendbird';
var sb = null;

export default class Chat extends Component {
  constructor(props) {
    super(props);
    sb = SendBird.getInstance();
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      channel: props.route.channel,
      name: props.route.name,
      dataSource: ds.cloneWithRows([]),
      messageQuery: props.route.channel.createPreviousMessageListQuery(),
      messages: [],
      text: '',
      disabled: true,
      show: false,
      lastMessage: null,
      hasRendered: false,
    };
    this._onBackPress = this._onBackPress.bind(this);
    this._onSend = this._onSend.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this._onPressParticipants = this._onPressParticipants.bind(this);
    this._onPressBlockList = this._onPressBlockList.bind(this);
    this._onPressExitChannel = this._onPressExitChannel.bind(this);
  }

  componentWillUnmount() {
    sb.removeChannelHandler('ChatView');
    sb.removeConnectionHandler('ChatView')
  }

  componentDidMount() {
    console.log("componentDidMount");      
    var _SELF = this;
    if (!_SELF.state.hasRendered){
      _SELF.state.hasRendered = true;
      _SELF._getChannelMessage(false);    
      if (_SELF.state.channel.channelType == 'group') {
          _SELF.state.channel.markAsRead();
      }

      // channel handler
      var ChannelHandler = new sb.ChannelHandler();
      ChannelHandler.onMessageReceived = function(channel, message){
        if (channel.url == _SELF.state.channel.url) {
          var _messages = [];
          if (message.sender.userId == _SELF.state.lastMessage.sender.userId) {
            message.sender.isDisplay = false;
            _messages.push(message);
          } else {
            _messages.push(message);
          }
          var _newMessageList = _messages.concat(_SELF.state.messages);
          _SELF.setState({
            messages: _newMessageList,
            dataSource: _SELF.state.dataSource.cloneWithRows(_newMessageList)
          });
          _SELF.state.lastMessage = message;
          if (_SELF.state.channel.channelType == 'group') {
            _SELF.state.channel.markAsRead();
            _SELF.state.channel.lastMessage = message;
          }        
        }
      };

      ChannelHandler.onUserJoined = function(channel, user) {
        _SELF.props.route.refresh(_SELF.state.channel);
      };
      ChannelHandler.onUserLeft = function(channel, user) {
        _SELF.props.route.refresh(_SELF.state.channel);
      };
      sb.addChannelHandler('ChatView', ChannelHandler);

      var ConnectionHandler = new sb.ConnectionHandler();
      ConnectionHandler.onReconnectSucceeded = function(){
        _SELF._getChannelMessage(true);
      }
      sb.addConnectionHandler('ChatView', ConnectionHandler);
    }
  }
  
  _getChannelMessage(refresh) {
    var _SELF = this;

    if(refresh){
      _SELF.state.messageQuery = _SELF.props.route.channel.createPreviousMessageListQuery();
      _SELF.state.messages = [];      
    }
    
    if (!this.state.messageQuery.hasMore) {
      return;
    }
    this.state.messageQuery.load(30, false, function(response, error){
      if (error) {
        console.log('Get Message List Fail.', error);
        return;
      }

      var _messages = [];
      for (var i = 0 ; i < response.length ; i++) {
        var _curr = response[i];
        if (i != 0) {
          var _prev = response[i - 1];
          if (_curr.sender.userId == _prev.sender.userId) {
            _curr.sender.isDisplay = false;
          }

          if (_curr.createdAt - _prev.createdAt > (1000 * 60 * 60)) {
            if (i > 1 && !_messages[i-2].hasOwnProperty('isDate')) {
              _messages[i-1].sender.isDisplay = true;
                _messages.splice((i-1), 0, {isDate: true, createdAt: _prev.createdAt});
            }
          }
        }
        _messages.push(_curr);
        _SELF.state.lastMessage = _curr;
      }

      var _newMessageList = _SELF.state.messages.concat(_messages.reverse());
      _SELF.setState({
        messages: _newMessageList,
        dataSource: _SELF.state.dataSource.cloneWithRows(_newMessageList)
      });
    });
  }

  _onSend() {
    var _SELF = this;
    _SELF.state.channel.sendUserMessage(_SELF.state.text, '', function(message, error) {
      if (error) {
        console.log(error);
        return;
      }

      var _messages = [];
      if (_SELF.state.lastMessage && message.createdAt - _SELF.state.lastMessage.createdAt  > (1000 * 60 * 60)) {
        _messages.push(message);
        _messages.push({isDate: true, createdAt: message.createdAt});
      } else if (_SELF.state.lastMessage && message.sender.userId == _SELF.state.lastMessage.sender.userId) {
        message.sender.isDisplay = false;
        _messages.push(message);
      } else {
        _messages.push(message);
      }

      var _newMessageList = _messages.concat(_SELF.state.messages);
      _SELF.setState({
        messages: _newMessageList,
        dataSource: _SELF.state.dataSource.cloneWithRows(_newMessageList)
      });
      _SELF.state.lastMessage = message;
      _SELF.state.channel.lastMessage = message;
      _SELF.setState({text: ''})
    });
  }

  _onBackPress() {
    this.props.route.refresh(this.state.channel);
    this.props.navigator.pop();
  }

  _onOpenMenu() {
    if (this.state.channel.channelType == 'open') {
      Alert.alert(
        'Open Channel',
        null,
        [
          {text: 'Participant list', onPress: () => {this._onPressParticipants();}},
          {text: 'Blocked user list', onPress: () => {this._onPressBlockList();}},
          {text: 'Exit this channel', onPress: () => {this._onPressExitChannel();}},
          {text: 'Close'}
        ]
      )
    } else {
      var _SELF = this;
      Alert.alert(
        'Group Channel Event',
        null,
        [
          {text: 'Invite users to this channel', onPress: () => {
            this.props.navigator.push({name: 'inviteUser', channel: this.state.channel});
          }},
          {text: 'Leave this channel', onPress: () => {
            this.state.channel.leave(function(response, error) {
              if (error) {
                console.log(error);
                return;
              }
              _SELF.props.navigator.pop();
              setTimeout(function() {_SELF.props.route._onHideChannel(_SELF.state.channel);}, 500);
            });
          }},
          {text: 'Hide this channel', onPress: () => {
            this.state.channel.hide(function(response, error) {
              if (error) {
                console.log(error);
                return;
              }
              _SELF.props.navigator.pop();
              setTimeout(function() {_SELF.props.route._onHideChannel(_SELF.state.channel);}, 500);
            });
          }},
          {text: 'Member list', onPress: () => {
            _SELF.props.navigator.push({name: 'members', channel: _SELF.state.channel});
          }},
          {text: 'Close'}
        ]
      )
    }
  }

  _onUserPress(obj) {
    Alert.alert(
      'Block User',
      null,
      [
        {text: 'Block', onPress: () => {
          sb.blockUser(obj, function(response, error) {
            if(error) {
              console.log(error);
              return;
            }
          })
        }},
        {text: 'Cancel'}
      ]
    )
  }

  _onChangeText(text) {
    this.setState({
      text: text,
      disabled: (text.trim().length > 0) ? false : true
    })
  }

  _onPressParticipants() {
    this.setState({show: false});
    this.props.navigator.push({name: 'participants', channel: this.state.channel});
  }
  _onPressBlockList() {
    this.setState({show: false});
    this.props.navigator.push({name: 'blockList', channel: this.state.channel});
  }
  _onPressExitChannel() {
    var _SELF = this;
    _SELF.setState({show: false});
    _SELF.state.channel.exit(function(response, error){
      if (error) {
        return;
      }
      _SELF.props.navigator.pop();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TopBar
          onBackPress={this._onBackPress.bind(this)}
          onOpenMenu={this._onOpenMenu.bind(this)}
          title={this.state.channel.name}
        />
        <View style={[styles.chatContainer, {transform: [{ scaleY: -1 }]}]}>
          <ListView
            enableEmptySections={true}
            onEndReached={() => this._getChannelMessage(false)}
            onEndReachedThreshold={PULLDOWN_DISTANCE}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => {
              if (rowData.hasOwnProperty('isDate')) {
                return (
                  <View style={[styles.listItem, {transform: [{ scaleY: -1 }]}, {flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}]}>
                    <Text style={styles.dateText}>{moment(rowData.createdAt).calendar()}</Text>
                  </View>
                )
              } else if (rowData.sender.isDisplay == false) {
                if (rowData.constructor.name == 'UserMessage') {
                  return (
                    <View style={[styles.listItem, {transform: [{ scaleY: -1 }]}, {marginLeft: 55}]}>
                      <View style={styles.senderContainer}>
                        <Text style={[styles.senderText, {color: '#343434', fontWeight: 'bold'}]}>{rowData.message}</Text>
                      </View>
                    </View>
                  )
                } else if (rowData.constructor.name == 'FileMessage') {
                  return (
                    <View style={[styles.listItem, {transform: [{ scaleY: -1 }]}, {marginLeft: 55}]}>
                      <View style={styles.senderContainer}>
                        <Image style={{width: 100, height: 70}} source={{uri: rowData.url.replace('http://', 'https://')}} />
                      </View>
                    </View>
                  )
                }
              } else {
                if (rowData.constructor.name == 'UserMessage') {
                  return (
                    <TouchableHighlight underlayColor='#f7f8fc' onPress={() => this._onUserPress(rowData.sender)}>
                      <View style={[styles.listItem, {transform: [{ scaleY: -1 }]}]}>
                        <View style={styles.listIcon}>
                          <Image style={styles.senderIcon} source={{uri: rowData.sender.profileUrl.replace('http://', 'https://')}} />
                        </View>
                        <View style={styles.senderContainer}>
                          <Text style={[styles.senderText, {color: '#3e3e55'}]}>{rowData.sender.nickname}</Text>
                          <Text style={[styles.senderText, {color: '#343434', fontWeight: 'bold'}]}>{rowData.message}</Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  )
                } else if (rowData.constructor.name == 'FileMessage') {
                  return (
                    <TouchableHighlight underlayColor='#f7f8fc' onPress={() => this._onUserPress(rowData.sender)}>
                      <View style={[styles.listItem, {transform: [{ scaleY: -1 }]}]}>
                        <View style={styles.listIcon}>
                          <Image style={styles.senderIcon} source={{uri: rowData.sender.profileUrl.replace('http://', 'https://')}} />
                        </View>
                        <View style={styles.senderContainer}>
                          <Text style={[styles.senderText, {color: '#3e3e55'}]}>{rowData.sender.nickname}</Text>
                          <Image style={{width: 100, height: 70}} source={{uri: rowData.url.replace('http://', 'https://')}} />
                        </View>
                      </View>
                    </TouchableHighlight>
                  )
                }
              }
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={'Please type mesasge...'}
            ref='textInput'
            onChangeText={this._onChangeText}
            value={this.state.text}
            autoFocus={true}
            blurOnSubmit={false}
          />
          <Button
            style={styles.sendButton}
            onPress={this._onSend}
            disabled={this.state.disabled}
          >{'send'}</Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  chatContainer: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#f7f8fc'
  },
  inputContainer: {
    height: 44,
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: '#b2b2b2',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    alignSelf: 'center',
    height: 30,
    width: 100,
    backgroundColor: '#FFF',
    flex: 1,
    padding: 0,
    margin: 0,
    fontSize: 15,
  },
  sendButton: {
    marginTop: 11,
    marginLeft: 10,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f7f8fc',
    padding: 5,
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15
  },
  senderIcon: {
    width: 30,
    height: 30
  },
  senderContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  senderText: {
    fontSize: 12,
    color: '#ababab'
  },
  dateText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#ababab',
    fontWeight: 'bold'
  }
});
