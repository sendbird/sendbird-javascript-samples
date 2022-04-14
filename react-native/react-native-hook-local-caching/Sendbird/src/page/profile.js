import React, { useReducer } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { withAppContext } from '../context';
import { profileReducer } from '../reducer/profile';

const Profile = props => {
  const { route, sendbird } = props;
  const { currentUser } = route.params;

  const [state, dispatch] = useReducer(profileReducer, {
    nickname: currentUser.nickname,
    error: '',
    updating: false,
  });

  const showErrorFadeDuration = 200;
  const showErrorDuration = 3500;

  const fade = new Animated.Value(0);
  const showError = message => {
    dispatch({ type: 'error', payload: { error: message } });
    Animated.sequence([
      Animated.timing(fade, {
        toValue: 1,
        duration: showErrorFadeDuration,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 0,
        delay: showErrorDuration,
        duration: showErrorFadeDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const saveNickname = () => {
    if (!state.updating) {
      if (state.nickname && sendbird.currentUser.nickname !== state.nickname) {
        dispatch({ type: 'start-update' });
        Keyboard.dismiss();
        sendbird.updateCurrentUserInfo(state.nickname, '', (user, err) => {
          dispatch({ type: 'end-update' });
          if (!err) {
            currentUser.nickname = user.nickname;
          } else {
            showError(err.message);
          }
        });
      } else {
        showError('Please put your user ID and nickname.');
      }
    }
  };
  return (
    <>
      <StatusBar backgroundColor="#742ddd" barStyle="light-content" />
      <SafeAreaView style={style.container}>
        <ActivityIndicator animating={state.updating} size="large" color="#6e5baa" />
        <View style={[style.loginForm]}>
          <Animated.View style={{ opacity: fade }}>
            <Text style={style.loginError}>{state.error}</Text>
          </Animated.View>
          <TextInput
            placeholder={'Nickname'}
            editable={!state.updating}
            onChangeText={content => dispatch({ type: 'edit-nickname', payload: { content } })}
            style={style.loginInput}
            defaultValue={currentUser.nickname}
          />
          <TouchableOpacity
            disabled={state.updating}
            activeOpacity={0.85}
            style={[style.loginButton, { backgroundColor: state.updating ? '#dbcfff' : '#742ddd' }]}
            onPress={saveNickname}
          >
            <Text style={style.loginButtonLabel}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const style = {
  container: {
    flex: 1,
  },
};

export default withAppContext(Profile);
