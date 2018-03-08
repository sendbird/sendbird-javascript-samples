import React, { Component } from 'react';
import { View, Text, ListView, TouchableHighlight, StyleSheet } from 'react-native';

import { CachedImage } from 'react-native-cached-image';
import { APP_ID, PULLDOWN_DISTANCE } from '../consts';
import TopBar from '../components/topBar';
import SendBird from 'sendbird';
var sb = null;
var ds = null;

export default class OpenChannel extends Component {
  constructor(props) {
    super(props);
    sb = SendBird.getInstance();
    ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      channelList: [],
      dataSource: ds.cloneWithRows([]),
      listQuery: sb.OpenChannel.createOpenChannelListQuery()
    };
    this._refresh = this._refresh.bind(this);
    this._channelUpdate = this._channelUpdate.bind(this);
    this._onChannelPress = this._onChannelPress.bind(this);
    this._getChannelList = this._getChannelList.bind(this);
    this._onBackPress = this._onBackPress.bind(this);
    this._onCreateOpenChannel = this._onCreateOpenChannel.bind(this);
    this._refreshChannelList = this._refreshChannelList.bind(this);
  }

  componentDidMount() {
    this._getChannelList();

    var _SELF = this;

    var ChannelHandler = new sb.ChannelHandler();
    sb.addChannelHandler('ChannelHandlerInList', ChannelHandler);

    var ConnectionHandler = new sb.ConnectionHandler();
    ConnectionHandler.onReconnectSucceeded = function() {
      _SELF._refreshChannelList();
    };
    sb.addConnectionHandler('ConnectionHandlerInList', ConnectionHandler);
  }

  componentWillUnmount() {
    sb.removeChannelHandler('ChannelHandlerInList');
    sb.removeChannelHandler('ConnectionHandlerInList');
  }

  _refreshChannelList() {
    var _SELF = this;
    var listQuery = sb.OpenChannel.createOpenChannelListQuery();
    listQuery.next(function(channelList, error) {
      if (error) {
        console.log(error);
        return;
      }
      _SELF.setState({ listQuery: listQuery, channelList: channelList, dataSource: ds.cloneWithRows(channelList) });
    });
  }

  _channelUpdate(channel) {
    var _SELF = this;
    var _list = _SELF.state.channelList.map(function(ch) {
      if (channel.url == ch.url) {
        return channel;
      }
      return ch;
    });
    _SELF.setState(
      {
        channelList: _list
      },
      () => {
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        _SELF.setState({ dataSource: ds.cloneWithRows(_SELF.state.channelList) });
      }
    );
  }

  _refresh(channel) {
    this._channelUpdate(channel);
  }

  _onChannelPress(channel) {
    var _SELF = this;
    channel.enter(function(response, error) {
      if (error) {
        if (error.code == 900100) {
          alert('Oops...You got banned out from this channel.');
        } else {
          alert('Enter openChannel Fail.');
        }
      }
      _SELF.props.navigator.push({ name: 'chat', channel: channel, refresh: _SELF._refreshChannelList });
    });
  }

  _getChannelList() {
    var _SELF = this;
    this.state.listQuery.next(function(response, error) {
      if (error) {
        if (response.length == 0) {
          return;
        }
        console.log('Get OpenChannel List Fail.', error);
        return;
      }

      _SELF.setState({ channelList: _SELF.state.channelList.concat(response) }, () => {
        _SELF.setState({
          dataSource: _SELF.state.dataSource.cloneWithRows(_SELF.state.channelList)
        });
      });
    });
  }

  _onBackPress() {
    this.props.navigator.pop();
  }

  _onCreateOpenChannel() {
    this.props.navigator.push({ name: 'createChannel', refresh: this._refreshChannelList });
  }

  render() {
    return (
      <View style={styles.container}>
        <TopBar onBackPress={this._onBackPress} onCreateOpenChannel={this._onCreateOpenChannel} title="Open Channel" />

        <View style={styles.listContainer}>
          <ListView
            removeClippedSubviews={false}
            enableEmptySections={true}
            onEndReached={() => this._getChannelList()}
            onEndReachedThreshold={PULLDOWN_DISTANCE}
            dataSource={this.state.dataSource}
            renderRow={rowData => (
              <TouchableHighlight onPress={() => this._onChannelPress(rowData)}>
                <View style={styles.listItem}>
                  <View style={styles.listIcon}>
                    <CachedImage
                      style={styles.channelIcon}
                      key={rowData.coverUrl}
                      source={{ uri: rowData.coverUrl.replace('http://', 'https://') }}
                    />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.titleLabel}># {rowData.name}</Text>
                    <Text style={styles.memberLabel}>{rowData.participantCount} participants</Text>
                  </View>
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
      </View>
    );
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
    color: '#60768b'
  },
  memberLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#abb8c4'
  }
});
