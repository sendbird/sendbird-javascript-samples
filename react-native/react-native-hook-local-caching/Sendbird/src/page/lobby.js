import React, { useContext, useLayoutEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { AppContext } from '../context';
import Login from './login';
import Channels from './channels';
import AuthManager from '../libs/AuthManager';
import { useNavigation } from '@react-navigation/native';
import NotificationManager from '../libs/NotificationManager';

async function safeRunForOffline(callback) {
  try {
    await callback();
  } catch {}
}

const Lobby = () => {
  const navigation = useNavigation();
  const { sendbird, currentUser, setCurrentUser } = useContext(AppContext);

  useLayoutEffect(() => {
    const title = currentUser ? (
      <View style={style.headerLeftContainer}>
        <Image source={require('../asset/logo-icon-white.png')} style={style.logo} />
        <Text style={style.headerTitle}>Channels</Text>
      </View>
    ) : null;

    const left = currentUser ? (
      <TouchableOpacity activeOpacity={0.85} onPress={logout}>
        <Icon name="logout" color="#fff" size={28} />
      </TouchableOpacity>
    ) : null;

    const right = currentUser ? (
      <TouchableOpacity activeOpacity={0.85} onPress={startChat}>
        <Icon name="chat" color="#fff" size={28} />
      </TouchableOpacity>
    ) : null;

    navigation.setOptions({
      headerShown: !!currentUser,
      headerTitle: () => title,
      headerLeft: () => left,
      headerRight: () => right,
    });
  }, [currentUser]);

  const login = async signUser => {
    return new Promise((resolve, reject) => {
      const cacheStrictCodes = [400300, 400301, 400302, 400310];

      sendbird.connect(signUser.userId, async (sendbirdUser, error) => {
        // Cache strict errors - https://sendbird.com/docs/chat/v3/javascript/guides/authentication#2-connect-to-sendbird-server-with-a-user-id
        if (error && sendbird.isCacheEnabled && cacheStrictCodes.some(c => error.code === c)) {
          await sendbird.clearCachedData().catch(e => console.log('clear cache failure', e));
          return reject(error);
        }

        if (sendbirdUser) {
          await AuthManager.signIn(signUser);
          let _user = sendbirdUser;

          await safeRunForOffline(async () => {
            _user = await sendbird.updateCurrentUserInfo(signUser.nickname, _user.profileUrl);
          });
          await safeRunForOffline(async () => {
            await NotificationManager.setPushToken(sendbird);
          });

          setCurrentUser(_user);
          return resolve(_user);
        }

        if (error) {
          return reject(error);
        }
      });
    });
  };

  const logout = async () => {
    await NotificationManager.clearPushToken(sendbird);
    await AuthManager.signOut();
    await sendbird.disconnect();
    setCurrentUser(null);
  };

  const startChat = () => {
    if (currentUser) {
      navigation.navigate('Invite', { currentUser });
    }
  };
  const profile = () => {
    if (currentUser) {
      navigation.navigate('Profile', { currentUser });
    }
  };

  return <>{currentUser ? <Channels /> : <Login onLogin={login} />}</>;
};

const style = {
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
  },
  logo: {
    width: 32,
    height: 32,
  },
};

export default Lobby;
