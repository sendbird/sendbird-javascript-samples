import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { sendbirdLogout, initMenu } from '../actions';
import { sbConnect, sbRegisterPushToken, sbUnregisterPushToken } from '../sendbirdActions';
import { NavigationActions, StackActions } from 'react-navigation';
import { Button, HR, Spinner } from '../components';

class Menu extends Component {
  static navigationOptions = {
    title: 'Sendbird'
  };

  constructor(props) {
    super(props);
    this.pushNotificationEnabled = false;
    this.state = {
      isLoading: false
    };
  }

  componentDidMount() {
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      sbRegisterPushToken()
        .then(res => {})
        .catch(err => {});
    });
    this.onMessageListener = firebase.messaging().onMessage(message => {
      if (Platform.OS === 'ios') {
        const text = message.data.message;
        const payload = JSON.parse(message.data.sendbird);
        const localNotification = new firebase.notifications.Notification({
          show_in_foreground: true
        })
          .setNotificationId(message.messageId)
          .setTitle('New message')
          .setSubtitle(`Unread message: ${payload.unread_message_count}`)
          .setBody(text)
          .setData(payload);
        firebase.notifications().displayNotification(localNotification);
      }
    });
    this.onPushNotificationOpened = firebase.notifications().onNotificationOpened(notif => {
      firebase.notifications().removeAllDeliveredNotifications();
      AsyncStorage.getItem('user', (err, result) => {
        if (result) {
          const user = JSON.parse(result);
          sbConnect(user.userId, user.nickname)
            .then(() => {
              let payload = notif.notification.data;
              if (!payload.hasOwnProperty('channel') && payload.hasOwnProperty('sendbird')) {
                payload = payload.sendbird;
              }
              const isOpenChannel = () => {
                return payload.channel_type !== 'group_messaging' && payload.channel_type !== 'messaging';
              };
              const channelType = isOpenChannel() ? 'OpenChannel' : 'GroupChannel';
              this.props.navigation.dispatch(
                StackActions.reset({
                  index: 2,
                  actions: [
                    NavigationActions.navigate({ routeName: 'Menu' }),
                    NavigationActions.navigate({ routeName: channelType }),
                    NavigationActions.navigate({
                      routeName: 'Chat',
                      params: {
                        channelUrl: payload.channel.channel_url,
                        newTitle: payload.channel.name,
                        isOpenChannel: isOpenChannel(),
                        isFromPayload: true
                      }
                    })
                  ]
                })
              );
            })
            .catch(err => {
              this.redirectTo('Login');
            });
        } else this.redirectTo('Login');
      });
    });
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.pushNotificationEnabled = true;
        } else {
          firebase
            .messaging()
            .requestPermission()
            .then(() => {
              this.pushNotificationEnabled = true;
            })
            .catch(error => {
              this.pushNotificationEnabled = false;
            });
        }
      });
    firebase.notifications().removeAllDeliveredNotifications();
    this.props.initMenu();
  }
  componentWillUnmount() {
    this.onTokenRefreshListener();
    this.onMessageListener();
    this.onPushNotificationOpened();
  }

  componentDidUpdate(prevProps) {
    AsyncStorage.getItem('user', (err, result) => {
      if (!result) {
        this.setState({ isLoading: false }, () => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })]
          });
          this.props.navigation.dispatch(resetAction);
        });
      }
    });
  }

  redirectTo(page, params) {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: page, params: params })]
      })
    );
  }

  _onProfileButtonPress = () => {
    this.props.navigation.navigate('Profile');
  };

  _onOpenChannelPress = () => {
    this.props.navigation.navigate('OpenChannel');
  };

  _onGroupChannelPress = () => {
    this.props.navigation.navigate('GroupChannel');
  };

  _onDisconnectButtonPress = () => {
    this.setState({ isLoading: true }, () => {
      sbUnregisterPushToken()
        .then(res => {
          this.props.sendbirdLogout();
        })
        .catch(err => {
          this.setState({ isLoading: false });
        });
    });
  };

  render() {
    return (
      <View style={styles.containerViewStyle}>
        <Spinner visible={this.state.isLoading} />
        <Button
          containerViewStyle={styles.menuViewStyle}
          buttonStyle={styles.buttonStyle}
          backgroundColor="#fff"
          color="#6e5baa"
          icon={{
            name: 'user',
            type: 'font-awesome',
            color: '#6e5baa',
            size: 16
          }}
          title="Profile"
          onPress={this._onProfileButtonPress}
        />
        <HR />
        <Button
          containerViewStyle={styles.menuViewStyle}
          buttonStyle={styles.buttonStyle}
          backgroundColor="#fff"
          color="#6e5baa"
          icon={{
            name: 'slack',
            type: 'font-awesome',
            color: '#6e5baa',
            size: 16
          }}
          title="Open Channel"
          onPress={this._onOpenChannelPress}
        />
        <HR />
        <Button
          containerViewStyle={styles.menuViewStyle}
          buttonStyle={styles.buttonStyle}
          backgroundColor="#fff"
          color="#6e5baa"
          icon={{
            name: 'users',
            type: 'font-awesome',
            color: '#6e5baa',
            size: 16
          }}
          title="Group Channel"
          onPress={this._onGroupChannelPress}
        />
        <HR />
        <Button
          containerViewStyle={styles.menuViewStyle}
          buttonStyle={styles.buttonStyle}
          backgroundColor="#fff"
          color="#7d62d9"
          color="#6e5baa"
          icon={{
            name: 'sign-out',
            type: 'font-awesome',
            color: '#6e5baa',
            size: 16
          }}
          title="Disconnect"
          onPress={this._onDisconnectButtonPress}
        />
        <HR />
      </View>
    );
  }
}

function mapStateToProps({ menu }) {
  const { isDisconnected } = menu;
  return { isDisconnected };
}

export default connect(
  mapStateToProps,
  { sendbirdLogout, initMenu }
)(Menu);

const styles = {
  containerViewStyle: {
    backgroundColor: '#fff',
    flex: 1
  },
  menuViewStyle: {
    marginLeft: 0,
    marginRight: 0
  },
  buttonStyle: {
    justifyContent: 'flex-start',
    paddingLeft: 14
  }
};
