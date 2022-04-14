import React, { useContext, useLayoutEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { AppContext, withAppContext } from '../context';
import Login from './login';
import Channels from './channels';
import AuthManager from '../libs/AuthManager';
import { useNavigation } from '@react-navigation/native';

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

    const right = currentUser ? (
      <View style={style.headerRightContainer}>
        <TouchableOpacity activeOpacity={0.85} style={style.profileButton} onPress={startChat}>
          <Icon name="chat" color="#fff" size={28} />
        </TouchableOpacity>
      </View>
    ) : null;

    navigation.setOptions({
      headerShown: !!currentUser,
      headerTitle: () => title,
      headerRight: () => right,
    });
  }, [currentUser]);

  const login = async user => {
    await sendbird.connect(user.userId);
    await sendbird.updateCurrentUserInfo(user.nickname, '');
    await AuthManager.signIn(user);
    setCurrentUser(user);
  };

  const logout = async () => {
    await sendbird.disconnect();
    await AuthManager.signOut();
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
  headerRightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
  },
  logo: {
    width: 32,
    height: 32,
  },
  profileButton: {
    marginLeft: 10,
  },
};

export default withAppContext(Lobby);
