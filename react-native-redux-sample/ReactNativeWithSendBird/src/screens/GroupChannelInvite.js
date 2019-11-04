import React, { Component } from 'react';
import { View, Text, FlatList, TouchableHighlight, Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  initInvite,
  getUserList,
  createGroupChannel,
  inviteGroupChannel,
  groupChannelProgress,
  addGroupChannelItem,
  onGroupChannelPress,
  getChannelTitle
} from '../actions';
import { Button, Spinner, ListItem, Avatar, Icon } from '../components';
import { sbCreateUserListQuery } from '../sendbirdActions';

class GroupChannelInvite extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: `${params.title}`,
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
          buttonStyle={{ paddingRight: 14 }}
          color={'#7d62d9'}
          title={params.channelUrl ? 'add' : 'create'}
          backgroundColor="transparent"
          onPress={() => {
            params.handleHeaderRight();
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userListQuery: null,
      selectedList: []
    };
  }

  componentDidMount() {
    this._initInvite();
    this.props.navigation.setParams({
      handleHeaderRight: this._onCreateButtonPress
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { channel, list } = this.props;

    if (list !== prevProps.list) {
      this.setState({ isLoading: false });
    }

    if (channel && prevProps.channel !== this.props.channel) {
      const { channelUrl } = this.props.navigation.state.params;
      if (channelUrl) {
        this.setState({ isLoading: false }, () => {
          const isOpenChannel = false;
          this.props.getChannelTitle(channelUrl, isOpenChannel);
          this.props.navigation.goBack();
        });
      } else {
        this.props.groupChannelProgress(true);
        this.setState({ isLoading: false }, () => {
          this.props.addGroupChannelItem(channel);
          this.props.navigation.goBack();
          this.props.onGroupChannelPress(channel.url);
        });
      }
    }
  }

  _initInvite = () => {
    this.props.initInvite();
    this._getUserList(true);
  };

  _onCreateButtonPress = () => {
    const { channelUrl } = this.props.navigation.state.params;

    const inviteUserIdList = this.state.selectedList.map(user => {
      return user.userId;
    });

    if (channelUrl) {
      this.props.inviteGroupChannel(inviteUserIdList, channelUrl);
    } else {
      Alert.alert('Create Group Channel', 'Please select distinct option.', [
        {
          text: 'Distinct',
          onPress: () => {
            const isDistinct = true;
            this.props.createGroupChannel(inviteUserIdList, isDistinct);
          }
        },
        {
          text: 'Non-Distinct',
          onPress: () => {
            const isDistinct = false;
            this.props.createGroupChannel(inviteUserIdList, isDistinct);
          }
        },
        { text: 'Cancel' }
      ]);
    }
  };

  _getUserList = init => {
    if (!init && !this.props.list) {
      return;
    }
    this.setState({ isLoading: true }, () => {
      const { channelUrl } = this.props.navigation.state.params;
      if (init) {
        const userListQuery = sbCreateUserListQuery();
        userListQuery.limit = 30;
        this.setState({ userListQuery }, () => {
          this.props.getUserList(this.state.userListQuery, channelUrl);
        });
      } else {
        this.props.getUserList(this.state.userListQuery, channelUrl);
      }
    });
  };

  _removeSelectedList = removeUser => {
    const newSelectedList = this.state.selectedList.filter(user => {
      return user.userId !== removeUser.userId;
    });
    this.setState({
      selectedList: newSelectedList
    });
  };

  _addSelectedList = addUser => {
    const newSelectedList = [...this.state.selectedList, ...[addUser]];
    this.setState({
      selectedList: newSelectedList
    });
  };

  _onListItemPress = selectedUser => {
    this.props.list.map(user => {
      if (user.userId === selectedUser.userId) {
        if (user.isSelected) {
          user.isSelected = false;
          this._removeSelectedList(user);
        } else {
          user.isSelected = true;
          this._addSelectedList(user);
        }
      }
      return user;
    });
  };

  _renderList = ({ item }) => {
    const user = item;
    return (
      <ListItem
        component={TouchableHighlight}
        containerStyle={{ backgroundColor: '#fff' }}
        key={user.userId}
        avatar={
          <Avatar rounded source={user.profileUrl ? { uri: user.profileUrl } : require('../img/icon_sb_68.png')} />
        }
        title={user.nickname}
        titleStyle={{ fontWeight: '500', fontSize: 16, marginLeft: 8 }}
        leftIcon={
          <Icon
            containerStyle={{
              padding: 0,
              margin: 0,
              marginLeft: 4,
              marginRight: 8
            }}
            iconStyle={{ padding: 0, margin: 0 }}
            name="check-circle-o"
            type="font-awesome"
            color={user.isSelected ? '#6741D9' : '#e3e3e3'}
            size={18}
          />
        }
        rightIcon={<Text></Text>}
        onPress={() => this._onListItemPress(user)}
      />
    );
  };

  _renderSelectedUserList = ({ item }) => {
    return (
      <View style={styles.selectedUserListViewStyle}>
        <Avatar source={{ uri: item.profileUrl }} />
        <Text>{item.nickname.length > 5 ? item.nickname.substring(0, 3) + '...' : item.nickname}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.containerStyle}>
        <Spinner visible={this.props.isLoading} />

        <View style={{ height: 64 }}>
          <FlatList
            renderItem={this._renderSelectedUserList}
            data={this.state.selectedList}
            style={{ flex: 1, marginLeft: 14, marginRight: 14 }}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <View style={styles.listTitleViewStyle}>
          <Text style={styles.listTitleTextStyle}>User List</Text>
        </View>

        <View style={{}}>
          <FlatList
            renderItem={this._renderList}
            initialNumToRender={30}
            data={this.props.list}
            keyExtractor={item => item.userId + ''}
            onEndReached={() => this._getUserList(false)}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps({ groupChannelInvite }) {
  const { list, channel } = groupChannelInvite;
  return { list, channel };
}

export default connect(
  mapStateToProps,
  {
    initInvite,
    getUserList,
    createGroupChannel,
    inviteGroupChannel,
    groupChannelProgress,
    addGroupChannelItem,
    onGroupChannelPress,
    getChannelTitle
  }
)(GroupChannelInvite);

const styles = {
  selectedUserListViewStyle: {
    flexDirection: 'column',
    width: 40,
    height: 40,
    paddingTop: 6,
    marginRight: 8
  },
  containerStyle: {
    backgroundColor: '#fff',
    flex: 1
  },
  listTitleViewStyle: {
    backgroundColor: '#DEE1E6',
    paddingLeft: 14,
    paddingTop: 4,
    paddingBottom: 4
  },
  listTitleTextStyle: {
    color: '#494E57',
    fontSize: 12
  }
};
