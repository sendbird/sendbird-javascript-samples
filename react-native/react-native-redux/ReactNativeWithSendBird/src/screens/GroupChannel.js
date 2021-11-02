import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  initGroupChannel,
  groupChannelProgress,
  getGroupChannelList,
  onGroupChannelPress,
  onLeaveChannelPress,
  onHideChannelPress,
  clearSelectedGroupChannel,
  createGroupChannelListHandler
} from '../actions';
import { Button, ListItem, Avatar, Spinner } from '../components';
import Swipeout from 'react-native-swipeout';
import { sbCreateGroupChannelListQuery, sbUnixTimestampToDate, sbGetChannelTitle } from '../sendbirdActions';
import appStateChangeHandler from '../appStateChangeHandler';

class GroupChannel extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: 'Group Channel',
      headerLeft: (
        <Button
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          buttonStyle={{ paddingLeft: 14 }}
          icon={{
            name: 'chevron-left',
            type: 'font-awesome',
            color: '#7d62d9',
            size: 18
          }}
          backgroundColor="transparent"
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: (
        <Button
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          buttonStyle={{ paddingLeft: 0, paddingRight: 14 }}
          iconRight={{
            name: 'user-plus',
            type: 'font-awesome',
            color: '#7d62d9',
            size: 18
          }}
          backgroundColor="transparent"
          onPress={() => {
            navigation.navigate('GroupChannelInvite', {
              title: 'Group Channel Create',
              channelUrl: null
            });
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      joinChannel: false,
      groupChannelListQuery: null
    };
    this.lastMessage = null;
  }

  componentDidMount() {
    this.willFocusSubsription = this.props.navigation.addListener('willFocus', () => {
      this._initGroupChannelList();
    });
    this.appStateHandler = appStateChangeHandler.getInstance().addCallback('GROUP_CHANNEL', () => {
      this._initGroupChannelList();
    });
  }

  componentWillUnmount() {
    this.willFocusSubsription.remove();
    this.appStateHandler();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { channel } = this.props;

    if (channel && this.props.channel !== prevProps.channel) {
      this.props.clearSelectedGroupChannel();
      this.props.navigation.navigate('Chat', {
        channelUrl: channel.url,
        title: sbGetChannelTitle(channel),
        memberCount: channel.memberCount,
        isOpenChannel: channel.isOpenChannel(),
        _initListState: this._initJoinState
      });
    }
  }

  _initJoinState = () => {
    this.setState({ joinChannel: false });
  };

  _initGroupChannelList = () => {
    this.props.initGroupChannel();
    this.props.createGroupChannelListHandler();
    this._getGroupChannelList(true);
  };

  _getGroupChannelList = init => {
    this.props.groupChannelProgress(true);
    if (init) {
      const groupChannelListQuery = sbCreateGroupChannelListQuery();
      this.setState({ groupChannelListQuery }, () => {
        this.props.getGroupChannelList(this.state.groupChannelListQuery);
      });
    } else {
      this.props.getGroupChannelList(this.state.groupChannelListQuery);
    }
  };

  _onListItemPress = channelUrl => {
    if (!this.state.joinChannel) {
      this.setState({ joinChannel: true }, () => {
        this.props.onGroupChannelPress(channelUrl);
      });
    }
  };

  _handleScroll = e => {
    if (e.nativeEvent.contentOffset.y < -100 && !this.props.isLoading && !this.state.groupChannelListQuery.isLoading) {
      this._initGroupChannelList();
    }
  };

  _renderLastMessageTime = message => {
    return message ? sbUnixTimestampToDate(message.createdAt) : null;
  };

  _renderTitle = channel => {
    const { lastMessage } = channel;
    return (
      <View style={styles.renderTitleViewStyle}>
        <View style={{ flexDirection: 'row' }}>
          <Text>{sbGetChannelTitle(channel)}</Text>
          <View style={styles.renderTitleMemberCountViewStyle}>
            <Text style={styles.renderTitleTextStyle}>{channel.memberCount}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.renderTitleTextStyle}>{this._renderLastMessageTime(lastMessage)}</Text>
        </View>
      </View>
    );
  };

  _renderMessage = message => {
    if (message) {
      const lastMessage = message.isFileMessage() ? message.name : message.message;
      if (lastMessage.length > 30) {
        return lastMessage.substring(0, 27) + '...';
      } else {
        return lastMessage;
      }
    } else {
      return null;
    }
  };

  _renderUnreadCount = count => {
    if (count > 0) {
      count = count > 9 ? '+9' : count.toString();
    } else {
      count = null;
    }

    return count ? (
      <View style={styles.unreadCountViewStyle}>
        <Text style={styles.unreadCountTextStyle}>{count}</Text>
      </View>
    ) : null;
  };

  _renderLastMessage = channel => {
    const { lastMessage, unreadMessageCount } = channel;
    return (
      <View style={styles.renderLastMessageViewStyle}>
        <Text style={styles.renderLastMessageTextStyle}>{this._renderMessage(lastMessage)}</Text>
        {this._renderUnreadCount(unreadMessageCount)}
      </View>
    );
  };

  _onChannelLeave = channelUrl => {
    Alert.alert('Leave', 'Are you sure want to leave channel?', [
      { text: 'Cancel' },
      { text: 'OK', onPress: () => this.props.onLeaveChannelPress(channelUrl) }
    ]);
  };

  _onChannelHide = channelUrl => {
    Alert.alert('Hide', 'Are you sure want to hide channel?', [
      { text: 'Cancel' },
      { text: 'OK', onPress: () => this.props.onHideChannelPress(channelUrl) }
    ]);
  };

  _renderList = rowData => {
    const channel = rowData.item;
    let swipeoutBtns = [
      {
        text: 'Leave',
        type: 'delete',
        onPress: () => {
          this._onChannelLeave(channel.url);
        }
      },
      {
        text: 'Hide',
        type: 'default',
        onPress: () => {
          this._onChannelHide(channel.url);
        }
      }
    ];
    // if(! channel || ! channel.coverUrl) {
    //   return null
    // }
    let avatar = <Avatar />;
    if (channel.coverUrl) {
      avatar = <Avatar source={{ uri: channel.coverUrl }} />;
    }
    return (
      <Swipeout right={swipeoutBtns} autoClose={true}>
        <ListItem
          component={TouchableHighlight}
          containerStyle={{ backgroundColor: '#fff' }}
          key={channel.url}
          avatar={avatar}
          title={this._renderTitle(channel)}
          titleStyle={{ fontWeight: '500', fontSize: 16 }}
          subtitle={this._renderLastMessage(channel)}
          subtitleStyle={{ fontWeight: '300', fontSize: 11 }}
          onPress={() => this._onListItemPress(channel.url)}
        />
      </Swipeout>
    );
  };

  render() {
    return (
      <View>
        <Spinner visible={this.props.isLoading} />
        <FlatList
          renderItem={this._renderList}
          data={this.props.list}
          extraData={this.state}
          keyExtractor={(item, index) => item.url}
          onEndReached={() => this._getGroupChannelList(false)}
          onEndReachedThreshold={0}
          onScroll={this._handleScroll}
        />
      </View>
    );
  }
}

function mapStateToProps({ groupChannel }) {
  const { isLoading, list, channel } = groupChannel;
  return { isLoading, list, channel };
}

export default connect(
  mapStateToProps,
  {
    initGroupChannel,
    groupChannelProgress,
    getGroupChannelList,
    onGroupChannelPress,
    onLeaveChannelPress,
    onHideChannelPress,
    clearSelectedGroupChannel,
    createGroupChannelListHandler
  }
)(GroupChannel);

const styles = {
  renderTitleViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10
  },
  renderTitleMemberCountViewStyle: {
    backgroundColor: '#e3e3e3',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4,
    marginLeft: 4
  },
  renderTitleTextStyle: {
    fontSize: 10,
    color: '#878D99'
  },
  unreadCountViewStyle: {
    width: 18,
    height: 18,
    padding: 3,
    backgroundColor: '#e03131',
    borderRadius: 9,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  unreadCountTextStyle: {
    fontSize: 8,
    fontWeight: '500',
    color: '#fff'
  },
  renderLastMessageViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10
  },
  renderLastMessageTextStyle: {
    fontSize: 12,
    color: '#878D99',
    marginTop: 3
  }
};
