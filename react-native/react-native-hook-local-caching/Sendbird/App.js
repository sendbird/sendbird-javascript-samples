import React, { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet } from 'react-native';
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
import AuthManager from './src/libs/AuthManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const appId = '9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23';
const sendbird = new SendBird({ appId, localCacheEnabled: true });
sendbird.useAsyncStorageAsDatabase(AsyncStorage);

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    AuthManager.getUserForAutoSignIn()
      .then(async user => {
        if (user) {
          // Even if an error occurs, you still need to sign-in. Because you can make a connection request offline.
          try {
            await sendbird.connect(user.userId);
          } finally {
            setCurrentUser(user);
          }
        }
      })
      .finally(() => setLoading(false));

    const unsubscribes = [
      AppState.addEventListener('change', appState => {
        if (appState === 'active') {
          sendbird.getConnectionState() === 'CLOSED' && sendbird.setForegroundState();
        } else {
          sendbird.getConnectionState() === 'OPEN' && sendbird.setBackgroundState();
        }
      }).remove,
      messaging().onMessage(onRemoteMessage),
    ];
    return () => {
      unsubscribes.forEach(fn => fn());
    };
  }, []);

  if (loading) return <ActivityIndicator style={StyleSheet.absoluteFill} color={'#742ddd'} size={'large'} />;
  return <AppContext.Provider value={{ sendbird, currentUser, setCurrentUser }}>{children}</AppContext.Provider>;
};

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Lobby" component={Lobby} options={{ ...defaultHeaderOptions }} />
          <Stack.Screen name="Chat" component={Chat} options={{ ...defaultHeaderOptions }} />
          <Stack.Screen name="Member" component={Member} options={{ ...defaultHeaderOptions }} />
          <Stack.Screen name="Invite" component={Invite} options={{ ...defaultHeaderOptions }} />
          <Stack.Screen name="Profile" component={Profile} options={{ ...defaultHeaderOptions }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

const defaultHeaderOptions = {
  headerStyle: {
    backgroundColor: '#742ddd',
  },
  headerTintColor: '#fff',
};

export default App;
