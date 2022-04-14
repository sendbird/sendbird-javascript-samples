import React, { useContext, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useHeaderHeight } from '@react-navigation/elements';

import { AppContext } from '../context';
import Message from '../component/message';
import { createChannelName } from '../utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMessageCollection } from '../hooks/useMessageCollection/useMessageCollection';
import { useConnectionHandler } from '../hooks/useConnectionHandler';
import { getMessageUniqId } from '../hooks/useMessageCollection/reducer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Chat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sendbird, currentUser } = useContext(AppContext);

  const headerHeight = useHeaderHeight();

  const { bottom } = useSafeAreaInsets();

  const [staleChannel] = useState(() => sendbird.GroupChannel.buildFromSerializedData(route.params.channel));
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const { messages, activeChannel, refresh, next, sendUserMessage, sendFileMessage } = useMessageCollection(
    sendbird,
    staleChannel,
    currentUser.userId,
    () => {
      navigation.navigate('Lobby', {
        action: 'delete',
        data: { channel: staleChannel },
      });
    },
    setError,
  );

  useConnectionHandler(
    sendbird,
    'page-chat',
    {
      onReconnectStarted: () => {
        setError('Connecting..');
      },
      onReconnectSucceeded: () => {
        setError(null);
        refresh();
      },
      onReconnectFailed: () => {
        setError('Connection failed. Please check the network status.');
      },
    },
    [refresh],
  );

  useLayoutEffect(() => {
    const leave = () => {
      Alert.alert('Leave', 'Are you going to leave this channel?', [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Lobby', {
              action: 'leave',
              data: { channel: activeChannel },
            });
          },
        },
      ]);
    };
    const member = () => navigation.navigate('Member', { channel: activeChannel.serialize(), currentUser });

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
      title: createChannelName(staleChannel),
      headerRight: () => right,
    });
  }, [activeChannel, currentUser]);

  const _sendUserMessage = async () => {
    if (input.length > 0) {
      try {
        const params = new sendbird.UserMessageParams();
        params.message = input;
        setInput('');

        await sendUserMessage(params);
      } catch (e) {
        console.log('failure user mes', e);
        setError('Failed to send a message:', e.message);
      }
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

      try {
        const params = new sendbird.FileMessageParams();
        params.file = { size: result.size, uri: result.uri, name: result.name, type: result.type };
        await sendFileMessage(params);
      } catch {
        setError('Failed to send a file message.');
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log(err);
        setError(err.message);
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
    <View style={style.container}>
      <FlatList
        data={messages}
        inverted={true}
        renderItem={({ item }) => (
          <Message
            channel={activeChannel}
            message={item}
            onPress={message => viewDetail(message)}
            onLongPress={message => showContextMenu(message)}
          />
        )}
        keyExtractor={getMessageUniqId}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 8 }}
        ListHeaderComponent={
          error && (
            <View style={style.errorContainer}>
              <Text style={style.error}>{error}</Text>
            </View>
          )
        }
        ListEmptyComponent={
          <View style={style.emptyContainer}>
            <Text style={style.empty}>{'No messages'}</Text>
          </View>
        }
        onEndReached={next}
        onEndReachedThreshold={0.5}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={-bottom + headerHeight}
        behavior={Platform.select({ ios: 'padding', default: undefined })}
      >
        <View style={style.inputContainer}>
          <TouchableOpacity activeOpacity={0.85} style={style.uploadButton} onPress={selectFile}>
            <Icon name="insert-photo" color="#7b53ef" size={28} />
          </TouchableOpacity>
          <TextInput
            value={input}
            style={style.input}
            multiline={true}
            numberOfLines={2}
            onChangeText={content => {
              if (content.length > 0) {
                staleChannel.startTyping();
              } else {
                staleChannel.endTyping();
              }
              setInput(content);
            }}
          />
          <TouchableOpacity activeOpacity={0.85} style={style.sendButton} onPress={_sendUserMessage}>
            <Icon name="send" color={input.length > 0 ? '#7b53ef' : '#ddd'} size={28} />
          </TouchableOpacity>
        </View>
        <View style={{ height: bottom }} />
      </KeyboardAvoidingView>
    </View>
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
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  input: {
    maxHeight: 100,
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

export default Chat;
