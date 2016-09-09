import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  Alert,
  StyleSheet
} from 'react-native'

import {APP_ID, PULLDOWN_DISTANCE} from '../consts';
import TopBar from '../components/topBar';
import moment from 'moment';
import SendBird from 'sendbird';
var sb = null;
var ds = null;

export default class GroupChannel extends Component {
  constructor(props) {
    super(props);
    sb = SendBird.getInstance();
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      channelList: [],
      dataSource: ds.cloneWithRows([]),
      listQuery: sb.GroupChannel.createMyGroupChannelListQuery(),
      editMode: false
    };
    this._getChannelList = this._getChannelList.bind(this);
    this._onHideChannel = this._onHideChannel.bind(this);
    this._refresh = this._refresh.bind(this);
    this._channelUpdate = this._channelUpdate.bind(this);
  }

  componentWillMount() {
    this._getChannelList();

    // channel handler
    var _SELF = this;
    var ChannelHandler = new sb.ChannelHandler();
    ChannelHandler.onMessageReceived = function(channel, message){
      _SELF._channelUpdate(channel);
    };
    sb.addChannelHandler('ListHandler', ChannelHandler);
  }

  _channelUpdate(channel) {
    var _SELF = this;
    var _exist = false;
    var _list = _SELF.state.channelList.map(function(ch) {
      if (channel.url == ch.url ) {
        _exist = true;
        return channel
      }
      return ch
    });
    if (!_exist) {
      _list.push(channel);
    }
    _SELF.setState({
      channelList: _list,
      dataSource: ds.cloneWithRows(_SELF.state.channelList)
    });
  }

  _refresh(channel) {
    this._channelUpdate(channel);
  }

  _channelTitle(members) {
    var _members = [];
    members.forEach(function(user) {
      if (user.userId != sb.currentUser.userId) {
        _members.push(user);
      }
    });
    var _title = _members.map(function(elem){
      if (elem.userId != sb.currentUser.userId) {
          return elem.nickname;
      }
    }).join(",");
    _title = _title.replace(',,', ',');
    return (_title.length > 15) ? _title.substring(0, 11) + '...' : _title;
  }

  _onChannelPress(channel) {
    var _SELF = this;
    if (_SELF.state.editMode) {
      Alert.alert(
        'Group Channel Edit',
        null,
        [
          {text: 'leave', onPress: () => {
            channel.leave(function(response, error) {
              if (error) {
                console.log(error);
                return;
              }
              _SELF._onHideChannel(channel);
            });
          }},
          {text: 'hide', onPress: () => {
            channel.hide(function(response, error) {
              if (error) {
                console.log(error);
                return;
              }
              _SELF._onHideChannel(channel);
            });
          }},
          {text: 'Cancel'}
        ]
      )
    } else {
      _SELF.props.navigator.push({name: 'chat', channel: channel, _onHideChannel: this._onHideChannel, refresh: this._refresh});
    }
  }

  _onHideChannel(channel) {
    this.setState({channelList: this.state.channelList.filter((ch) => {
      return channel.url !== ch.url
    })}, ()=> {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state.channelList)
      });
    });
  }

  _getChannelList() {
    var _SELF = this;
    _SELF.state.listQuery.next(function(channelList, error){
      if (error) {
        console.log(error);
        return;
      }
      _SELF.setState({channelList: _SELF.state.channelList.concat(channelList)}, () => {
        _SELF.setState({
          dataSource: _SELF.state.dataSource.cloneWithRows(_SELF.state.channelList)
        });
      });
    });
  }

  _onBackPress() {
    this.props.navigator.pop();
  }

  _onGroupChannel() {
    var _SELF = this;
    if (_SELF.state.editMode) {
      Alert.alert(
        'Group Channel Event',
        null,
        [
          {text: 'Done', onPress: () => {
            _SELF.setState({editMode: false});
          }}
        ]
      )
    } else{
      Alert.alert(
        'Group Channel Event',
        null,
        [
          {text: 'Edit', onPress: () => {
            _SELF.setState({editMode: true});
          }},
          {text: 'Invite', onPress: () => {
            _SELF.props.navigator.push({name: 'inviteUser', refresh: _SELF._refresh});
          }},
          {text: 'Cancel'}
        ]
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TopBar
          onBackPress={this._onBackPress.bind(this)}
          onGroupChannel={this._onGroupChannel.bind(this)}
          title='Group Channel'
           />

        <View style={styles.listContainer}>
          <ListView
            enableEmptySections={true}
            onEndReached={() => this._getChannelList()}
            onEndReachedThreshold={PULLDOWN_DISTANCE}
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <TouchableHighlight onPress={() => this._onChannelPress(rowData)}>
                <View style={styles.listItem}>
                  <View style={styles.listIcon}>
                    <Image style={styles.channelIcon} source={{uri: rowData.coverUrl.replace('http://', 'https://')}} />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.titleLabel}>{this._channelTitle(rowData.members)}</Text>
                    <Text style={styles.memberLabel}>{rowData.lastMessage ? ( rowData.lastMessage.message && rowData.lastMessage.message.length > 15 ? rowData.lastMessage.message.substring(0, 11) + '...' : rowData.lastMessage.message ) : '' }</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', marginRight: 10}}>
                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end', marginRight: 4}}>
                      <Text style={{color: '#861729'}}>{rowData.unreadMessageCount}</Text>
                    </View>
                     <View style={{flex: 1, alignItems: 'flex-end'}}>
                       <Text style={styles.descText}>{rowData.memberCount} members</Text>
                       <Text style={styles.descText}>{(!rowData.lastMessage || rowData.lastMessage.createdAt == 0) ? '-' : moment(rowData.lastMessage.createdAt).format('MM/DD HH:mm')}</Text>
                     </View>
                  </View>
                </View>
              </TouchableHighlight>
            }
          />
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
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fc',
    borderBottomWidth: 0.5,
    borderColor: '#D0DBE4',
    padding: 5
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15
  },
  channelIcon: {
    width: 30,
    height: 30
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  titleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60768b',
  },
  memberLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#abb8c4',
  },
  descText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#ababab'
  }
});
