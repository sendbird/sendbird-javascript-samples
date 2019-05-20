
import React from 'react';
import {
  Alert,
	AsyncStorage,
	Platform,
  View
} from 'react-native';
import {
  Button
} from 'react-native-elements';
import { connect } from 'react-redux';

import { FlatList } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';

import SendBird from 'sendbird';
import SendBirdSyncManager from 'sendbird-syncmanager';

import { style } from '../style/main';
import Action from '../action/main';
import GroupChannelView from '../view/groupChannel';
import { navigator } from '../navigator';

class MainController extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'SendBird',
      headerRight: (
        <Button
          containerStyle={style.signoutButtonContainer}
          buttonStyle={style.signoutButton}
          icon={<Icon name="md-log-out" color="#7d62d9" size={28}></Icon>}
          onPress={() => {
            Alert.alert(
              'Sign out',
              'Do you want to sign out?',
              [
                { text: 'Cancel' },
                {
                  text: 'OK', onPress: () => {
                    AsyncStorage.removeItem('currentUser', err => {
                      SendBirdSyncManager.getInstance().reset();
                      const sb = SendBird.getInstance();
                      firebase.messaging().getToken()
                        .then(fcmToken => {
                          if (fcmToken) {
                            if (Platform.OS === 'ios') {
                              sb.unregisterAPNSPushTokenForCurrentUser(fcmToken, (result, err) => {
                                sb.disconnect(() => {
                                  navigation.replace('Signin', {});
                                });
                              });
                            } else {
                              sb.unregisterGCMPushTokenForCurrentUser(fcmToken, (result, err) => {
                                sb.disconnect(() => {
                                  navigation.replace('Signin', {});
                                });
                              });
                            }
                          } else {
                            sb.disconnect(() => {
                              navigation.replace('Signin', {});
                            });
                          }
                        });
                    });
                  }
                },
              ]
            );
          }}
        />
      )
    }
  };
  static getDerivedStateFromProps(props, state) {
    state.channels = props.channels;
    return state;
  }
	constructor(props) {
		super(props);
    this.collection = null;
		this.state = {
			channels: []
		};
	}
	componentDidMount() {
    const { navigation } = this.props;
    const userFromParams = navigation.getParam('user', null);
    if (!userFromParams) {
      AsyncStorage.getItem("currentUser", (err, result) => {
        if (result) {
          const user = JSON.parse(result);
          this.init(user.userId);
        } else {
          this.requireLogin();
        }
      });
    } else {
      this.init(userFromParams.userId);
    }
  }
  componentWillUnmount() {
    if (this.onTokenRefreshListener) {
      this.onTokenRefreshListener();
    }
    if (this.onPushNotificationListener) {
      this.onPushNotificationListener();
    }
    if (this.onPushNotificationOpened) {
      this.onPushNotificationOpened();
    }
		this.props.clearChannels();
    if (this.collection) {
      this.collection.remove();
      this.collection = null;
    }
	}
	init(userId) {
    const sb = SendBird.getInstance();
    sb.connect(userId, (_, err) => {
      if(!err) {
        firebase.messaging().getToken()
          .then(fcmToken => {
            if (fcmToken) {
              this.registerPushToken(fcmToken);
            }
          });
      }
    });

    firebase.messaging().hasPermission()
      .then(enabled => {
        if (!enabled) {
          firebase.messaging().requestPermission()
            .then(() => {
              this.addPushNotificationListener();
            })
            .catch(err => {
              console.log('Failed to get permission', err);
            });
        } else {
          this.addPushNotificationListener();
        }
      });
    this.addPushTokenRefreshListener();
    
		this.onPushNotificationOpened = firebase.notifications().onNotificationOpened(notificationOpen => {
      firebase.notifications().removeAllDeliveredNotifications();
      if(notificationOpen) {
        const notification = notificationOpen.notification;
        if(notification.data && notification.data.channel && notification.data.channel.channel_url) {
          sb.GroupChannel.getChannel(notification.data.channel.channel_url, (channel, err) => {
            if(!err) {
              this.openChat(channel);
            }
          });
        }
      }
    });
    firebase.notifications().removeAllDeliveredNotifications();
		
		SendBirdSyncManager.setup(userId, err => {
      if(!err) {
        firebase.notifications().getInitialNotification()
          .then(notificationOpen => {
            if (notificationOpen) {
              const notification = notificationOpen.notification;
              if(notification.data && notification.data.channel && notification.data.channel.channel_url) {
                sb.GroupChannel.getChannel(notification.data.channel.channel_url, (channel, err) => {
                  if(!err) {
                    this.openChat(channel);
                  }
                });
              }
            }
          });

        const query = sb.GroupChannel.createMyGroupChannelListQuery();
        query.limit = 50;
        query.includeEmpty = false;
        query.order = 'latest_last_message';
  
        this.collection = new SendBirdSyncManager.ChannelCollection(query);
        const collectionHandler = new SendBirdSyncManager.ChannelCollection.CollectionHandler();
        collectionHandler.onChannelEvent = (action, channels) => {
          switch (action) {
            case 'insert': {
              this.props.addChannels(channels);
              break;
            }
            case 'update': {
              this.props.updateChannels(channels);
              break;
            }
            case 'move': {
              this.props.moveChannels(channels);
              break;
            }
            case 'remove': {
              this.props.removeChannels(channels);
              break;
            }
            case 'clear': {
              this.props.clearChannels();
              break;
            }
          }
        };
        this.collection.setCollectionHandler(collectionHandler);
        this.next();
      } else {
        console.log(err);
      }
    });
	}
	addPushTokenRefreshListener() {
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      this.registerPushToken(fcmToken);
    });
  }
  addPushNotificationListener() {
    this.onPushNotificationListener = firebase.messaging().onMessage(message => {
      this.handlePushNotification(message);
    });
	}
	handlePushNotification(message) {
    // DO NOTHING FOR FOREGROUND PUSH NOTIFICATION
  }
	registerPushToken(fcmToken) {
		const sb = SendBird.getInstance();
    if (Platform.OS === 'ios') {
      // WARNING! FCM token doesn't work in request to APNs.
      // Use APNs token here instead.
      firebase.messaging().ios.getAPNSToken()
        .then(token => {
          sb.registerAPNSPushTokenForCurrentUser(token, (result, err) => {
            if(err) {
              console.log(err);
            }
          });
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      sb.registerGCMPushTokenForCurrentUser(fcmToken, (result, err) => {
        if(err) {
          console.log(err);
        }
      });
    }
	}
	requireLogin() {
    this.props.navigation.replace('Signin', {});
	}
	createChannel() {
    this.props.navigation.push('Invite', {});
	}
	openChat(channel) {
    if(navigator.top() !== channel.url) {
      this.props.navigation.push('Chat', { channel });
    }
	}
	next() {
    if (this.collection) {
      this.collection.fetch(err => {
        if(err) {
          console.log(err);
        }
      });
    }
  }
	render() {
		return (
			<View style={style.container}>
				<FlatList
          data={this.state.channels}
          keyExtractor={channel => channel.url}
          onEndReached={this.next.bind(this)}
          renderItem={bundle => {
						const channel = bundle.item;
            return <GroupChannelView channel={channel} onPress={this.openChat.bind(this)}></GroupChannelView>;
          }}
        />
        <ActionButton
          buttonColor='#6e5baa'
          degrees={0}
          shadowStyle={style.actionButtonShadow}
          fixNativeFeedbackRadius={true}
          onPress={this.createChannel.bind(this)}>
          <Icon name="md-create" style={style.actionButtonIcon} />
        </ActionButton>
			</View>
		);
	}
}

export default connect(previousState => {
	const { main } = previousState;
	return { ...main };
},
Action)(MainController);