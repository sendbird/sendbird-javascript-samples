import SendBird from 'sendbird';
import {
    Platform,
    AsyncStorage
} from 'react-native';

// const APP_ID = '078105E7-BD8C-43C9-A583-59E334353965'; // test
const APP_ID = '9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23'; // sample

export const sbConnect = (userId, nickname) => {
    return new Promise((resolve, reject) => {
        if (!userId) {
            reject('UserID is required.');
            return;
        }
        if (!nickname) {
            reject('Nickname is required.');
            return;
        }
        const sb = new SendBird({'appId': APP_ID});
        sb.connect(userId, (user, error) => {
            if (error) {
                reject('SendBird Login Failed.');
            } else {
                const PushNotification = require('react-native-push-notification');
                PushNotification.configure({
                    // (optional) Called when Token is generated (iOS and Android)
                    onRegister: function(token) {
                        if (Platform.OS === 'ios') {
                            sb.registerAPNSPushTokenForCurrentUser(token['token'], function(result, error){
                                console.log("registerAPNSPushTokenForCurrentUser");
                                console.log(result);
                            });
                        } else {
                            sb.registerGCMPushTokenForCurrentUser(token['token'], function(result, error){
                                console.log("registerAPNSPushTokenForCurrentUser");
                                console.log(result);
                            });
                        }
                    },

                    // (required) Called when a remote or local notification is opened or received
                    onNotification: function(notification) {
                        if(notification.sendbird) {
                            const sendbirdNotification = JSON.parse(notification.sendbird);
                            console.log(sendbirdNotification);
                            AsyncStorage.setItem('payload',
                                JSON.stringify({
                                    "channelType" : sendbirdNotification.channel_type,
                                    "channel" : sendbirdNotification.channel
                                }),
                                () => {});
                        }
                        
                        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
                        if(PushNotificationIOS)
                            notification.finish(PushNotificationIOS.FetchResult.NoData);
                    },

                    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
                    senderID: "984140644677",

                    // IOS ONLY (optional): default: all - Permissions to register.
                    permissions: {
                        alert: true,
                        badge: true,
                        sound: true
                    },

                    // Should the initial notification be popped automatically
                    // default: true
                    popInitialNotification: true,

                    /**
                     * (optional) default: true
                     * - Specified if permissions (ios) and token (android and ios) will requested or not,
                     * - if not, you must call PushNotificationsHandler.requestPermissions() later
                     */
                    requestPermissions: true,
                });
                resolve(sbUpdateProfile(nickname));
            }
        })
    })
};

export const sbUpdateProfile = (nickname) => {
    return new Promise((resolve, reject) => {
        if (!nickname) {
            reject('Nickname is required.');
            return;
        }
        let sb = SendBird.getInstance();
        if(!sb) sb = new SendBird({'appId': APP_ID});
        sb.updateCurrentUserInfo(nickname, null, (user, error) => {
            if (error) {
                reject('Update profile failed.')
            } else {
                AsyncStorage.setItem('user', JSON.stringify(user), () => {
                    resolve(user);
                });
            }
        })
    })
}

export const sbDisconnect = () => {
    return new Promise((resolve, reject) => {
        const sb = SendBird.getInstance();
        if (sb) {
            AsyncStorage.removeItem('user', () => {
                sb.disconnect(() => {
                    resolve(null);
                });
            });
        } else {
            resolve(null);
        }
    })
}

export const sbGetCurrentInfo = () => {
    const sb = SendBird.getInstance();
    if(sb.currentUser) {
        return {
            profileUrl: sb.currentUser.profileUrl,
            nickname: sb.currentUser.nickname
        }
    }
    return {};
}

export const sbUserBlock = (blockUserId) => {
    return new Promise((resolve, reject) => {
        const sb = SendBird.getInstance();
        sb.blockUserWithUserId(blockUserId, (user, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        })
    });
}

export const sbUserUnblock = (unblockUserId) => {
    return new Promise((resolve, reject) => {
        const sb = SendBird.getInstance();
        sb.unblockUserWithUserId(unblockUserId, (user, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        })
    });
}

export const sbCreateBlockedUserListQuery = () => {
    const sb = SendBird.getInstance();
    return sb.createBlockedUserListQuery();
}

export const sbGetBlockUserList = (blockedUserListQuery) => {
    return new Promise((resolve, reject) => {
        blockedUserListQuery.next((blockedUsers, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(blockedUsers);
            }
        });
    });
}
