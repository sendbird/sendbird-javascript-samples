import React, { Component } from "react";
import { Platform, AppState, StyleSheet, AsyncStorage, Text, View } from "react-native";
import { StackNavigator } from "react-navigation";
import { Provider } from "react-redux";
import FCM, {
  FCMEvent,
  NotificationType,
  NotificationActionType,
  RemoteNotificationResult,
  WillPresentNotificationResult
} from "react-native-fcm";
import SendBird from 'sendbird';

import store from "./src/store";

import Start from "./src/screens/Start";
import Login from "./src/screens/Login";
import Menu from "./src/screens/Menu";
import Profile from "./src/screens/Profile";
import OpenChannel from "./src/screens/OpenChannel";
import OpenChannelCreate from "./src/screens/OpenChannelCreate";
import Chat from "./src/screens/Chat";
import Member from "./src/screens/Member";
import BlockUser from "./src/screens/BlockUser";
import GroupChannel from "./src/screens/GroupChannel";
import GroupChannelInvite from "./src/screens/GroupChannelInvite";

const MainNavigator = StackNavigator(
  {
    Start: { screen: Start },
    Login: { screen: Login },
    Menu: { screen: Menu },
    Profile: { screen: Profile },
    OpenChannel: { screen: OpenChannel },
    OpenChannelCreate: { screen: OpenChannelCreate },
    Chat: { screen: Chat },
    Member: { screen: Member },
    BlockUser: { screen: BlockUser },
    GroupChannel: { screen: GroupChannel },
    GroupChannelInvite: { screen: GroupChannelInvite }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerTitleStyle: { fontWeight: "500" }
    })
  }
);
let sb = null;

function showLocalNotificationWithAction(notif) {
  const data = JSON.parse(notif.sendbird);
  FCM.presentLocalNotification({
    title: data.sender ? data.sender.name : 'SendBird',
    body: data.message,
    priority: "high",
    show_in_foreground: true,
    click_action: "org.reactjs.native.example.ReactNativeWithSendBird" // for ios
  });
}
function registerPushToken(token) {
  if(sb) {
    if(Platform.OS === 'ios') {
      sb.registerAPNSPushTokenForCurrentUser(token, (result, error) => {
          console.log("registerAPNSPushTokenForCurrentUser");
          console.log(result);
      });
    } else {
      sb.registerGCMPushTokenForCurrentUser(token, (result, error) => {
          console.log("registerAPNSPushTokenForCurrentUser");
          console.log(result);
      });
    }
  }
}

// these callback will be triggered even when app is killed
FCM.on(FCMEvent.Notification, notif => {
  console.log('background notif', notif);
  try {
    const sendbirdNotification = JSON.parse(notif.sendbird);
    if(sendbirdNotification) {
      AsyncStorage.setItem('payload',
        JSON.stringify({
            "channelType" : sendbirdNotification.channel_type,
            "channel" : sendbirdNotification.channel
        }),
        () => {});
      showLocalNotificationWithAction(notif);
    }
  } catch(e) {
    console.log(e);
  }
});

class App extends Component {
  constructor(props) {
    super(props);
  }
  _handleAppStateChange = currentAppState => {
    sb = SendBird.getInstance();
    if (currentAppState === "active") {
      if (sb) {
        console.log("appstate - foreground");
        sb.setForegroundState();
      }
    } else if (currentAppState === "background") {
      if (sb) {
        console.log("appstate - background");
        sb.setBackgroundState();
      }
    }
  };
  componentDidMount() {
    FCM.requestPermissions();
    FCM.on(FCMEvent.Notification, notif => {
      console.log('foreground notif', notif);
      if (Platform.OS === "ios") {
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData);
            break;

          case NotificationType.NotificationResponse:
            notif.finish();
            break;

          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All);
            break;
        }
      }
      try {
        const sendbirdNotification = JSON.parse(notif.sendbird);
        if(sendbirdNotification) {
          AsyncStorage.setItem('payload',
            JSON.stringify({
                "channelType" : sendbirdNotification.channel_type,
                "channel" : sendbirdNotification.channel
            }),
            () => {});
          showLocalNotificationWithAction(notif);
        }
      } catch(e) {
        console.log(e);
      }
    });

    FCM.on(FCMEvent.RefreshToken, token => {
      sb = SendBird.getInstance();
      const user = AsyncStorage.getItem('user');
      if(user) {
        registerPushToken(token);
      } else {
        AsyncStorage.setItem('pushToken', token);
      }
    });

    const pushToken = AsyncStorage.getItem('pushToken');
    if(pushToken) {
      registerPushToken(pushToken);
      AsyncStorage.removeItem('pushToken');
    }
    AppState.addEventListener("change", this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }
  render() {
    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}
export default App;
