import React, { Component } from 'react';
import { View, FlatList, Text, TouchableHighlight, Alert } from 'react-native';
import { connect } from 'react-redux';
import { initBlockUser, getBlockUserList, onUnblockUserPress } from '../actions';
import { Button, Spinner, ListItem, Avatar } from '../components';
import { sbCreateBlockedUserListQuery } from '../sendbirdActions';

class BlockUser extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: 'Block Users',
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
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      blockedUserListQuery: null,
      list: []
    };
  }

  componentDidMount() {
    this._initBlockUser();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { list, unblockedUserId } = this.props;

    if (list !== prevProps.list) {
      const newList = [...this.state.list, ...list];
      this.setState({
        isLoading: false,
        list: newList
      });
    }

    if (unblockedUserId !== prevProps.unblockedUserId) {
      const newList = this.state.list.filter(user => {
        return user.userId !== unblockedUserId;
      });
      this.setState({
        isLoading: false,
        list: newList
      });
    }
  }

  _initBlockUser = () => {
    this.props.initBlockUser();
    this._getBlockUserList(true);
  };

  _onUnblockUserPress = unblockUserId => {
    Alert.alert('User Unblock', 'Are you sure want to unblock user?', [
      { text: 'Cancel' },
      {
        text: 'OK',
        onPress: () => {
          this.setState({ isLoading: true });
          this.props.onUnblockUserPress(unblockUserId);
        }
      }
    ]);
  };

  _getBlockUserList = init => {
    if (!init && !this.props.blockedUserListQuery) {
      return;
    }
    this.setState({ isLoading: true }, () => {
      if (init) {
        const blockedUserListQuery = sbCreateBlockedUserListQuery();
        this.setState({ blockedUserListQuery }, () => {
          this.props.getBlockUserList(this.state.blockedUserListQuery);
        });
      } else {
        this.props.getBlockUserList(this.state.blockedUserListQuery);
      }
    });
  };

  _renderList = ({ item }) => {
    return (
      <ListItem
        key={item.userId}
        component={TouchableHighlight}
        containerStyle={{ backgroundColor: '#fff' }}
        avatar={
          <Avatar rounded source={item.profileUrl ? { uri: item.profileUrl } : require('../img/icon_sb_68.png')} />
        }
        title={item.nickname}
        titleStyle={{ fontWeight: '500', fontSize: 16 }}
        rightTitle={item.isOnline}
        rightTitleStyle={{ color: '#37b24d' }}
        rightIcon={<Text></Text>}
        onPress={() => this._onUnblockUserPress(item.userId)}
      />
    );
  };

  render() {
    return (
      <View>
        <Spinner visible={this.state.isLoading} />
        <FlatList
          renderItem={this._renderList}
          data={this.state.list}
          onEndReached={() => this._getBlockUserList(false)}
          onEndReachedThreshold={-100}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

function mapStateToProps({ blockUser }) {
  const { list, unblockedUserId } = blockUser;
  return { list, unblockedUserId };
}

export default connect(
  mapStateToProps,
  { initBlockUser, getBlockUserList, onUnblockUserPress }
)(BlockUser);
