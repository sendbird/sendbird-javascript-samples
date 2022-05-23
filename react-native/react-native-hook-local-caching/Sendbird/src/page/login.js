import React, { useReducer } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { loginReducer } from '../reducer/login';
import { useIsMountedRef } from '../hooks/useIsMountedRef';

const showErrorFadeDuration = 200;
const showErrorDuration = 3500;

const Login = props => {
  const isMounted = useIsMountedRef();
  const { onLogin } = props;
  const [state, dispatch] = useReducer(loginReducer, {
    userId: '',
    nickname: '',
    error: '',
    connecting: false,
  });

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
  const connect = async () => {
    if (state.connecting) return;

    if (state.userId && state.nickname) {
      dispatch({ type: 'start-connection' });
      Keyboard.dismiss();

      try {
        await onLogin({ userId: state.userId, nickname: state.nickname });
      } catch (e) {
        isMounted.current && showError(e.message);
      } finally {
        isMounted.current && dispatch({ type: 'end-connection' });
      }
    } else {
      showError('Please put your user ID and nickname.');
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#742ddd" barStyle="light-content" />
      <SafeAreaView style={style.container}>
        <View style={style.logoContainer}>
          <Image source={require('../asset/logo.png')} style={style.logo} />
          <Text style={style.subtitle}>Powered by React Native</Text>
          <ActivityIndicator animating={state.connecting} size="large" color="#6e5baa" />
        </View>
        <View style={[style.loginForm]}>
          <Animated.View style={{ opacity: fade }}>
            <Text style={style.loginError}>{state.error}</Text>
          </Animated.View>
          <TextInput
            placeholder={'User ID'}
            editable={!state.connecting}
            onChangeText={content => dispatch({ type: 'edit-userId', payload: { content } })}
            style={style.loginInput}
          />
          <TextInput
            placeholder={'Nickname'}
            editable={!state.connecting}
            onChangeText={content => dispatch({ type: 'edit-nickname', payload: { content } })}
            style={style.loginInput}
          />
          <TouchableOpacity
            disabled={state.connecting}
            activeOpacity={0.85}
            style={[style.loginButton, { backgroundColor: state.connecting ? '#dbcfff' : '#742ddd' }]}
            onPress={connect}
          >
            <Text style={style.loginButtonLabel}>Connect</Text>
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
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  logo: {
    width: 300,
    height: 51,
    marginTop: 200,
    resizeMode: 'stretch',
  },
  subtitle: {
    color: '#999',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 30,
  },
  loginForm: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingLeft: 48,
    paddingRight: 48,
    paddingBottom: 36,
  },
  loginInput: {
    height: 48,
    fontSize: 16,
    padding: 12,
    borderColor: '#777',
    borderWidth: 0.2,
    borderRadius: 5,
    marginBottom: 8,
    alignSelf: 'stretch',
  },
  loginError: {
    fontSize: 18,
    color: '#d44',
    textAlign: 'center',
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  loginButton: {
    height: 48,
    padding: 12,
    backgroundColor: '#742ddd',
    borderWidth: 0,
    borderRadius: 5,
    marginBottom: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  loginButtonLabel: {
    color: '#fff',
    fontSize: 18,
  },
};

export default Login;
