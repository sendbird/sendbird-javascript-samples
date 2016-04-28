var React = require('react-native');
var {
  View,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  StyleSheet
} = React;
import Popup from 'react-native-popup';

var TopBar = require('../common/topBar');
var sendbird = require('sendbird');
var tempIcon = 'https://s3-ap-northeast-1.amazonaws.com/sendbird-logo-social/120x120symbol_SendBird_positive.png';
var inviteOffIcon = require('../../img/btn-invite-off.png');
var inviteOnIcon = require('../../img/btn-invite-on.png');
var PULLDOWN_DISTANCE = 40;

module.exports = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      channel: null,
      user: null,
      userList: [],
      dataSource: ds.cloneWithRows([]),
      next: 0,
      token: ''
    };
  },
  componentWillMount: function() {
    sendbird.getChannelInfo((data) => {
      this.setState({channel: data});
    });
    sendbird.getUserInfo((data) => {
      this.setState({user: data}, () => {
        this.getUserList(1, '');
      });
    });
  },
  render: function() {
    return (
      <View style={styles.container}>
        <TopBar
          onBackPress={this.onBackPress}
          onInvitePress={this.onInvitePress}
          title='User List'
        />

        <View style={styles.listItem}>
          <View style={styles.listIcon}>
            <Image style={styles.memberIcon} source={{uri: this.state.user.image_url ? this.state.user.image_url : tempIcon}} />
          </View>
          <View style={styles.listInfo}>
            <Text style={styles.nameLabel}>{this.state.user.nickname}</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => {
                if (rowData.guest_id === this.state.user.guest_id) {
                  return <View></View>;
                } else {
                  var _inviteIcon = inviteOffIcon;
                  if (rowData.invite) {
                    _inviteIcon = inviteOnIcon;
                  }
                  return (
                    <TouchableHighlight onPress={() => this.onUserPress(rowData.guest_id)}>
                      <View style={styles.listItem}>
                        <View style={styles.listIcon}>
                          <Image style={styles.memberIcon} source={{uri: rowData.picture}} />
                        </View>
                        <View style={styles.listInfo}>
                          <Text style={styles.nameLabel}>{rowData.nickname}</Text>
                          <Image source={{uri: rowData.picture}} />
                        </View>
                        <View style={styles.inviteIcon}>
                          <Image style={styles.inviteIconImage} source={_inviteIcon} />
                        </View>
                      </View>
                    </TouchableHighlight>
                  );
                }
              }
            }
            onEndReached={() => this.getUserList(this.state.next, this.state.token)}
            onEndReachedThreshold={PULLDOWN_DISTANCE}
          />
        </View>

        <Popup ref={(popup) => {this.popup = popup}} />
      </View>
    );
  },
  onInvitePress: function() {
    var guestIds = [];
    this.state.userList.forEach((user, index) => {
      if (user.invite) {
        guestIds.push(user.guest_id);
      }
    });

    if (guestIds.length == 0) {
    	this.popup.tip({
  			title: 'Invite User',
        content: 'Please select more than one',
  		});
    }

    if (this.state.channel.channel_url) {
      sendbird.inviteMessaging(
        guestIds,
        {
          successFunc: (data) => {
            sendbird.joinMessagingChannel(
              data.channel.channel_url,
              {
                successFunc : (data) => {
                  sendbird.connect({
                    successFunc: (data) => {
                      this.props.navigator.immediatelyResetRouteStack([{name: 'index'}, {name: 'messaging'}, {name: 'chat'}]);
                    },
                    errorFunc: (status, error) => {
                      console.log(status, error);
                    }
                  });
                },
                errorFunc: (status, error) => {
                  console.log(status, error);
                }
              }
            );
          },
          errorFunc: (status, error) => {
            console.log(status, error);
          }
        }
      );
    } else {
      sendbird.startMessaging(
        guestIds,
        {
          successFunc: (data) => {
            sendbird.joinMessagingChannel(
              data.channel.channel_url,
              {
                successFunc : (data) => {
                  sendbird.connect({
                    successFunc: (data) => {
                      this.props.navigator.immediatelyResetRouteStack([{name: 'index'}, {name: 'messaging'}, {name: 'chat'}]);
                    },
                    errorFunc: (status, error) => {
                      console.log(status, error);
                    }
                  });
                },
                errorFunc: (status, error) => {
                  console.log(status, error);
                }
              }
            );
          },
          errorFunc: (status, error) => {
            console.log(status, error);
          }
        }
      );
    }
  },
  onUserPress: function(guestId) {
    var _userList = this.state.userList.map((user) => {
      if (user.guest_id == guestId) {
        user.invite = user.invite ? false : true;
      }
      return user
    });

    this.setState({userList: _userList}, () => {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({dataSource: ds.cloneWithRows(this.state.userList)});
    });
  },
  getUserList: function(_page, _token) {
    sendbird.getUserList({
      token: _token,
      page: _page,
      successFunc : (data) => {
        var users = data.users.map((user) => {
          user["invite"] = false;
          return user;
        });

        this.setState({userList: this.state.userList.concat(users)}, () => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.userList),
            next: data.next
          });
        });
      },
      errorFunc: (status, error) => {
        console.log(status, error);
      }
    });
  },
  onBackPress: function() {
    this.props.navigator.pop();
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 5
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
  memberIcon: {
    width: 30,
    height: 30,
    borderRadius: 18
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  nameLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60768b',
  },
  inviteLabel: {
    fontSize: 12,
    color: '#C0CBD4'
  },
  memberLabel: {
    flex: 1,
    fontSize: 14,
    color: '#555555'
  },
  inviteTile: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 15
  },
  inviteContainer: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  inviteIcon: {
    justifyContent: 'flex-end',
    marginRight: 10
  },
  inviteIconImage: {
    width: 25,
    height: 25,
  }
});
