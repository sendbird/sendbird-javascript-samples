import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import SendBird from 'sendbird';

import { AppContext } from './src/context';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Lobby from './src/page/lobby';
import Chat from './src/page/chat';
import Member from './src/page/member';
import Invite from './src/page/invite';
import Profile from './src/page/profile';

import { onRemoteMessage } from './src/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const appId = '9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23';
const sendbird = new SendBird({ appId });
sendbird.setErrorFirstCallback(true);

const initialState = {
  sendbird,
};

const defaultHeaderOptions = {
  headerStyle: {
    backgroundColor: '#742ddd',
  },
  headerTintColor: '#fff',
};

const App = () => {
  const savedUserKey = 'savedUser';

  useEffect(() => {
    AsyncStorage.getItem(savedUserKey)
      .then(async user => {
        try {
          if (user) {
            const authorizationStatus = await messaging().requestPermission();
            if (
              authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
            ) {
              if (Platform.OS === 'ios') {
                const token = await messaging().getAPNSToken();
                sendbird.registerAPNSPushTokenForCurrentUser(token);
              } else {
                const token = await messaging().getToken();
                sendbird.registerGCMPushTokenForCurrentUser(token);
              }
            }
          }
        } catch (err) {
          console.error(err);
        }
      })
      .catch(err => console.error(err));

    if (Platform.OS !== 'ios') {
      const unsubscribeHandler = messaging().onMessage(onRemoteMessage);
      return unsubscribeHandler;
    }
  }, []);

  return (
    <NavigationContainer>
      <AppContext.Provider value={initialState}>
        <Stack.Navigator>
          <Stack.Screen name="Lobby" component={Lobby} options={{ ...defaultHeaderOptions }} />
          <Stack.Screen name="Chat" component={Chat} options={{ ...defaultHeaderOptions }} />
          <Stack.Screen name="Member" component={Member} options={{ ...defaultHeaderOptions }} />
          <Stack.Screen name="Invite" component={Invite} options={{ ...defaultHeaderOptions }} />
          <Stack.Screen name="Profile" component={Profile} options={{ ...defaultHeaderOptions }} />
        </Stack.Navigator>
      </AppContext.Provider>
    </NavigationContainer>
  );
};

export default App;
