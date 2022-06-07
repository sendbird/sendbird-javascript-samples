import React, { useLayoutEffect, useEffect, useState, useReducer } from 'react';
import {
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  View,
  FlatList,
  AppState,
  TextInput,
  Alert,
  Platform,
} from 'react-native';

import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { withAppContext } from '../context';
import { chatReducer } from '../reducer/chat';
import Message from '../component/message';
import { createChannelName } from '../utils';

const Chat = props => {
  const { route, navigation, sendbird } = props;
  const { currentUser, channel } = route.params;

  const [query, setQuery] = useState(null);
  const [state, dispatch] = useReducer(chatReducer, {
    sendbird,
    channel,
    messages: [],
    messageMap: {}, // redId => boolean
    loading: false,
    input: '',
    empty: '',
    error: '',
  });

  useLayoutEffect(() => {
    const right = (
      <View style={style.headerRightContainer}>
        <TouchableOpacity activeOpacity={0.85} style={style.headerRightButton} onPress={member}>
          <Icon name="people" color="#fff" size={28} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} style={style.headerRightButton} onPress={leave}>
          <Icon name="directions-walk" color="#fff" size={28} />
        </TouchableOpacity>
      </View>
    );

    navigation.setOptions({
      title: createChannelName(channel),
      headerRight: () => right,
    });
  });
  // on state change
  useEffect(() => {
    sendbird.addConnectionHandler('chat', connectionHandler);
    sendbird.addChannelHandler('chat', channelHandler);
    const unsubscribe = AppState.addEventListener('change', handleStateChange);

    if (!sendbird.currentUser) {
      sendbird.connect(currentUser.userId, (_, err) => {
        if (!err) {
          refresh();
        } else {
          dispatch({
            type: 'error',
            payload: {
              error: 'Connection failed. Please check the network status.',
            },
          });
        }
      });
    } else {
      refresh();
    }

    return () => {
      sendbird.removeConnectionHandler('chat');
      sendbird.removeChannelHandler('chat');
      unsubscribe.remove();
    };
  }, []);

  /// on query refresh
  useEffect(() => {
    if (query) {
      next();
    }
  }, [query]);

  /// on connection event
  const connectionHandler = new sendbird.ConnectionHandler();
  connectionHandler.onReconnectStarted = () => {
    dispatch({
      type: 'error',
      payload: {
        error: 'Connecting..',
      },
    });
  };
  connectionHandler.onReconnectSucceeded = () => {
    dispatch({
      type: 'error',
      payload: {
        error: '',
      },
    });
    refresh();
  };
  connectionHandler.onReconnectFailed = () => {
    dispatch({
      type: 'error',
      payload: {
        error: 'Connection failed. Please check the network status.',
      },
    });
  };

  /// on channel event
  const channelHandler = new sendbird.ChannelHandler();
  channelHandler.onMessageReceived = (targetChannel, message) => {
    if (targetChannel.url === channel.url) {
      dispatch({ type: 'receive-message', payload: { message, channel } });
    }
  };
  channelHandler.onMessageUpdated = (targetChannel, message) => {
    if (targetChannel.url === channel.url) {
      dispatch({ type: 'update-message', payload: { message } });
    }
  };
  channelHandler.onMessageDeleted = (targetChannel, messageId) => {
    if (targetChannel.url === channel.url) {
      dispatch({ type: 'delete-message', payload: { messageId } });
    }
  };
  channelHandler.onUserLeft = (channel, user) => {
    if (user.userId === currentUser.userId) {
      navigation.navigate('Lobby', {
        action: 'leave',
        data: { channel },
      });
    }
  };
  channelHandler.onChannelDeleted = (channelUrl, channelType) => {
    navigation.navigate('Lobby', {
      action: 'delete',
      data: { channel },
    });
  };

  const handleStateChange = newState => {
    if (newState === 'active') {
      sendbird.setForegroundState();
    } else {
      sendbird.setBackgroundState();
    }
  };
  const member = () => {
    navigation.navigate('Member', { channel, currentUser });
  };
  const leave = () => {
    Alert.alert('Leave', 'Are you going to leave this channel?', [
      { text: 'Cancel' },
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Lobby', {
            action: 'leave',
            data: { channel },
          });
        },
      },
    ]);
  };
  const refresh = () => {
    channel.markAsRead();
    setQuery(channel.createPreviousMessageListQuery());
    dispatch({ type: 'refresh' });
  };
  const next = () => {
    if (query.hasMore) {
      dispatch({ type: 'error', payload: { error: '' } });
      query.limit = 50;
      query.reverse = true;
      query.load((fetchedMessages, err) => {
        if (!err) {
          dispatch({ type: 'fetch-messages', payload: { messages: fetchedMessages } });
        } else {
          dispatch({ type: 'error', payload: { error: 'Failed to get the messages.' } });
        }
      });
    }
  };
  const sendUserMessage = () => {
    if (state.input.length > 0) {
      const params = new sendbird.UserMessageParams();
      params.message = state.input;

      const pendingMessage = channel.sendUserMessage(params, (message, err) => {
        if (!err) {
          dispatch({ type: 'send-message', payload: { message } });
        } else {
          setTimeout(() => {
            dispatch({ type: 'error', payload: { error: 'Failed to send a message.' } });
            dispatch({ type: 'delete-message', payload: { reqId: pendingMessage.reqId } });
          }, 500);
        }
      });
      dispatch({ type: 'send-message', payload: { message: pendingMessage, clearInput: true } });
    }
  };
  const selectFile = async () => {
    try {
      if (Platform.OS === 'android') {
        const permission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        if (permission !== RESULTS.GRANTED) {
          const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
          if (result !== RESULTS.GRANTED) {
            throw new Error('Please allow the storage access permission request.');
          }
        }
      } else if (Platform.OS === 'ios') {
        // TODO:
      }
      const result = await DocumentPicker.pickSingle({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.video,
          DocumentPicker.types.audio,
          DocumentPicker.types.plainText,
          DocumentPicker.types.zip,
        ],
      });

      const params = new sendbird.FileMessageParams();
      params.file = {
        size: result.size,
        uri: result.uri,
        name: result.name,
        type: result.type,
      };
      dispatch({ type: 'start-loading' });
      channel.sendFileMessage(params, (message, err) => {
        dispatch({ type: 'end-loading' });
        if (!err) {
          dispatch({ type: 'send-message', payload: { message } });
        } else {
          setTimeout(() => {
            dispatch({ type: 'error', payload: { error: 'Failed to send a message.' } });
          }, 500);
        }
      });
    } catch (err) {
      console.log(err);
      if (!DocumentPicker.isCancel(err)) {
        dispatch({ type: 'error', payload: { error: err.message } });
      }
    }
  };
  const viewDetail = message => {
    if (message.isFileMessage()) {
      // TODO: show file details
    }
  };
  const showContextMenu = message => {
    if (message.sender && message.sender.userId === currentUser.userId) {
      // message control
      // showActionSheetWithOptions(
      //   {
      //     title: 'Message control',
      //     message: 'You can edit or delete the message.',
      //     options: ['Edit', 'Delete', 'Cancel'],
      //     cancelButtonIndex: 2,
      //     destructiveButtonIndex: 1
      //   },
      //   buttonIndex => {
      //     switch (buttonIndex) {
      //       case 0: // edit
      //         break;
      //       case 1: // delete
      //         break;
      //       case 2: // cancel
      //         break;
      //     }
      //   }
      // );
    }
  };
  return (
    <>
      <StatusBar backgroundColor="#742ddd" barStyle="light-content" />
      <SafeAreaView style={style.container}>
        <FlatList
          data={state.messages}
          inverted={true}
          renderItem={({ item }) => (
            <Message
              key={item.reqId}
              channel={channel}
              message={item}
              onPress={message => viewDetail(message)}
              onLongPress={message => showContextMenu(message)}
            />
          )}
          keyExtractor={item => `${item.messageId}` || item.reqId}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
          ListHeaderComponent={
            state.error && (
              <View style={style.errorContainer}>
                <Text style={style.error}>{state.error}</Text>
              </View>
            )
          }
          ListEmptyComponent={
            <View style={style.emptyContainer}>
              <Text style={style.empty}>{state.empty}</Text>
            </View>
          }
          onEndReached={() => next()}
          onEndReachedThreshold={0.5}
        />
        <View style={style.inputContainer}>
          <TouchableOpacity activeOpacity={0.85} style={style.uploadButton} onPress={selectFile}>
            <Icon name="insert-photo" color="#7b53ef" size={28} />
          </TouchableOpacity>
          <TextInput
            value={state.input}
            style={style.input}
            multiline={true}
            numberOfLines={2}
            onChangeText={content => {
              if (content.length > 0) {
                channel.startTyping();
              } else {
                channel.endTyping();
              }
              dispatch({ type: 'typing', payload: { input: content } });
            }}
          />
          <TouchableOpacity activeOpacity={0.85} style={style.sendButton} onPress={sendUserMessage}>
            <Icon name="send" color={state.input.length > 0 ? '#7b53ef' : '#ddd'} size={28} />
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
  headerRightContainer: {
    flexDirection: 'row',
  },
  headerRightButton: {
    marginRight: 10,
  },
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 24,
    color: '#999',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: '#555',
  },
  uploadButton: {
    marginRight: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
};

export default withAppContext(Chat);
