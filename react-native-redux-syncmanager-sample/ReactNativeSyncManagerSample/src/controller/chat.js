
import React from 'react';
import {
  Alert,
  BackHandler,
  Clipboard,
  Keyboard,
  View
} from 'react-native';
import {
	Button,
	Input
} from 'react-native-elements';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';
import Permissions from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';

import SendBird from 'sendbird';
import SendBirdSyncManager from 'sendbird-syncmanager';

import { style } from '../style/chat';
import Action from '../action/chat';
import MessageView from '../view/message';
import { createChannelTitle, toast } from '../utils';
import { navigator } from '../navigator';

const PAGE_RETURN_DELAY = 600;

const _chatCloseHeader = navigation => {
  return (
    <View style={style.headerLeftContainer}>
      <Button
        containerStyle={style.headerLeftItemContainer}
        buttonStyle={style.headerLeftItem}
        icon={<Icon name="md-arrow-back" color="#333" size={28}></Icon>}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};
const _chatControlHeader = navigation => {
  const channel = navigation.getParam('channel', null);
  return (
    <View style={style.headerRightContainer}>
      <Button
        containerStyle={style.headerRightItemContainer}
        buttonStyle={style.headerRightItem}
        icon={<Icon name="md-contacts" color="#7d62d9" size={28}></Icon>}
        onPress={() => {
          const sb = SendBird.getInstance();
          sb.GroupChannel.getChannel(channel.url, (channel, err) => {
            if(!err) {
              navigation.push('Member', { channel });
            } else {
              toast('Failed to get channel information.');
            }
          });
        }}
      />
      <Button
        containerStyle={style.headerRightItemContainer}
        buttonStyle={style.headerRightItem}
        icon={<Icon name="md-exit" color="#7d62d9" size={28}></Icon>}
        onPress={() => {
          Alert.alert(
            'Leave',
            'Do you want to leave this channel?',
            [
              {text: 'Cancel'},
              {text: 'OK', onPress: () => {
                channel.leave((res, err) => {
                  if(!err) {
                    navigation.goBack();
                  } else {
                    toast('Failed to leave channel.');
                  }
                });
              }},
            ]
          );
        }}
      />
    </View>
  );
};
const _menuCloseHeader = navigation => {
  const currentChat = navigation.getParam('currentChat', null);
  return (
    <View style={style.headerLeftContainer}>
      <Button
        containerStyle={style.headerLeftItemContainer}
        buttonStyle={style.headerLeftItem}
        icon={<Icon name="md-close" color="#333" size={28}></Icon>}
        onPress={() => {
          if(currentChat) {
            currentChat.closeMessageControl();
          } else {
            navigation.setParams({
              currentChat: null,
              selectedMessages: []
            });
          }
        }}
      />
    </View>
  );
};
const _menuControlHeader = navigation => {
  const currentChat = navigation.getParam('currentChat', null);
  const syncManager = SendBirdSyncManager.getInstance();
  const channel = navigation.getParam('channel', null);
  const selectedMessages = navigation.getParam('selectedMessages', []);
  return (
    <View style={style.headerRightContainer}>
      {(selectedMessages.length === 1
        && selectedMessages[0].isUserMessage()
        && selectedMessages[0].sender.userId === syncManager.currentUserId)
        &&
        <Button
          containerStyle={style.headerRightItemContainer}
          buttonStyle={style.headerRightItem}
          icon={<Icon name="md-create" color="#7d62d9" size={28}></Icon>}
          onPress={() => {
            if(currentChat) {
              currentChat.closeMessageControl();
            } else {
              navigation.setParams({
                currentChat: null,
                selectedMessages: []
              });
            }
            currentChat.switchToEditMode(selectedMessages[0]);
          }}
        />
      }
      {(selectedMessages.length === 1
        && selectedMessages[0].isUserMessage())
        &&
        <Button
          containerStyle={style.headerRightItemContainer}
          buttonStyle={style.headerRightItem}
          icon={<Icon name="md-copy" color="#7d62d9" size={28}></Icon>}
          onPress={() => {
            if(selectedMessages.length > 0) {
              const message = selectedMessages[0];
              if(message.isUserMessage()) {
                Clipboard.setString(message.message);
                toast('The message is copied to Clipboard.');
                if(currentChat) {
                  currentChat.closeMessageControl();
                } else {
                  navigation.setParams({
                    currentChat: null,
                    selectedMessages: []
                  });
                }
              }
            }
          }}
        />
      }
      {(!selectedMessages[0].isAdminMessage()
        && selectedMessages[0].sender.userId === syncManager.currentUserId)
        &&
        <Button
          containerStyle={style.headerRightItemContainer}
          buttonStyle={style.headerRightItem}
          icon={<Icon name="md-trash" color="#7d62d9" size={28}></Icon>}
          onPress={() => {
            Alert.alert(
              'Delete',
              'Do you want to delete this message?',
              [
                {text: 'Cancel'},
                {text: 'OK', onPress: () => {
                  for(let i = 0; i < selectedMessages.length; i++) {
                    channel.deleteMessage(selectedMessages[i], (res, err) => {
                      if(err) {
                        console.error(err);
                      }
                    });
                  }
                  navigation.setParams({
                    currentChat: null,
                    selectedMessages: []
                  });
                }},
              ]
            );
          }}
        />
      }
    </View>
  );
};

class ChatController extends React.Component {
	static navigationOptions = ({ navigation }) => {
    const channel = navigation.getParam('channel', null);
    const selectedMessages = navigation.getParam('selectedMessages', []);
    const isMenuControl = selectedMessages.length > 0;
    return {
      title: isMenuControl ? 'Message Selected' : `${createChannelTitle(channel)} (${channel.memberCount})`,
      headerLeft: isMenuControl ? _menuCloseHeader(navigation) : _chatCloseHeader(navigation),
      headerRight: isMenuControl ? _menuControlHeader(navigation) : _chatControlHeader(navigation)
    };
  }
	static getDerivedStateFromProps(props, state) {
    state.messages = props.messages;
    return state;
  }
	constructor(props) {
		super(props);
		this.collection = null;
    this.channel = this.props.navigation.getParam('channel', null);
    this.messageInput = null;
		this.state = {
      typedText: '',
      editedMessage: null,
      inputMode: 'chat',
			messages: []
    };
	}
	componentDidMount() {
		const sb = SendBird.getInstance();
    const channelHandler = new sb.ChannelHandler();
    channelHandler.onChannelChanged = channel => {
      this.updateChannel(channel);
    };
    channelHandler.onUserJoined = (channel, user) => {
			this.updateChannel(channel);
		};
		channelHandler.onUserLeft = (channel, user) => {
      if(sb.currentUser.userId === user.userId) {
        this.props.navigation.replace('NotFound', { channelUrl: channel.url });
      } else {
        this.updateChannel(channel);
      }
		};
    sb.addChannelHandler(`chat-${this.channel.url}`, channelHandler);

		this.collection = new SendBirdSyncManager.MessageCollection(this.channel);
		this.collection.limit = 50;
		
		const collectionHandler = new SendBirdSyncManager.MessageCollection.CollectionHandler();
    collectionHandler.onMessageEvent = (action, messages) => {
      switch(action) {
        case 'insert': {
          this.props.addMessages(messages);
          break;
        }
        case 'update': {
          this.props.updateMessages(messages);
          break;
        }
        case 'remove': {
          this.props.removeMessages(messages);
          break;
        }
        case 'clear': {
          this.props.clearMessages();
          break;
        }
      }
    };
		this.collection.setCollectionHandler(collectionHandler);
		
		this.channel.markAsRead();
    this.collection.fetch('next', err => {
      if(err) {
        console.log(err);
      }
      this.collection.fetch('prev', err => {
        if(err) {
          console.log(err);
        }
      });
    });
    navigator.push(this.channel.url);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}
	componentWillUnmount() {
    this.props.clearMessages();
    if(this.collection) {
      this.collection.remove();
      this.collection = null;
    }
    navigator.pop();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  handleBackPress = () => {
    const selectedMessages = this.props.navigation.getParam('selectedMessages', []);
    if(selectedMessages.length > 0) {
      this.closeMessageControl();
      return true;
    } else if(this.state.inputMode === 'edit') {
      this.switchToChatMode();
      return true;
    }
    return false;
  }
  updateChannel(channel) {
    this.channel = channel;
    this.props.navigation.setParams({
      title: `${createChannelTitle(channel)} (${channel.memberCount})`
    });
  }
	loadPrevious() {
		this.collection.fetch('prev', err => {
      if(err) {
        console.log(err);
      }
    });
  }
  sendMessage() {
		if(this.state.typedText) {
      const tempMessage = this.channel.sendUserMessage(this.state.typedText, (message, err) => {
        if(!err) {
          if(message && this.collection) {
            this.collection.appendMessage(message);
          }
        } else {
          toast('Failed to send message.');
          if(tempMessage && this.collection) {
            this.collection.deleteMessage(tempMessage);
          }
        }
      });
      if(this.collection) {
        this.collection.appendMessage(tempMessage);
        this.setState({ typedText: '' });
      }
    }
  }
  updateMessage() {
    if(this.state.editedMessage && this.state.typedText) {
      const message = this.state.editedMessage;
      if(message.isUserMessage() && message.message !== this.state.typedText) {
        const messageContent = this.state.typedText;
        this.channel.updateUserMessage(message.messageId,
          messageContent,
          message.data,
          message.customType,
          (updatedMessage, err) => {
            if(!err) {
              this.collection.updateMessage(updatedMessage);
              this.switchToChatMode();
              Keyboard.dismiss();
            } else {
              toast('Failed to update the message.');
            }
          });
      } else {
        this.switchToChatMode();
        Keyboard.dismiss();
      }
    } else {
      toast('Cannot update the message with empty content.');
    }
  }
  sendImage(source, options = {}) {
    setTimeout(() => {
      const tempMessage = this.channel.sendFileMessage(source, '', '', options.thumbnailSizes, (message, err) => {
        if(!err) {
          if(message && this.collection) {
            this.collection.appendMessage(message);
          }
        } else {
          toast('Failed to send image. ' + err.message);
          if(tempMessage && this.collection) {
            this.collection.deleteMessage(tempMessage);
          }
        }
      });
      if(this.collection) {
        this.collection.appendMessage(tempMessage);
      }
      this.setState({ typedText: '' });
    },
    PAGE_RETURN_DELAY);
  }
	pickImage() {
		Permissions.check('photo').then(response => {
      if(response === 'authorized') {
        ImagePicker.showImagePicker(
          {
            title: "Select Image",
            mediaType: "photo",
            noData: true
          },
          response => {
            if (!response.didCancel && !response.error && !response.customButton) {
              const source = { uri: response.uri };
              if (response.name) {
                source["name"] = response.fileName;
              } else {
                paths = response.uri.split("/");
                source["name"] = paths[paths.length - 1];
              }
              if (response.type) {
                source["type"] = response.type;
              } else {
                /** For react-native-image-picker library doesn't return type in iOS,
                 *  it is necessary to force the type to be an image/jpeg (or whatever you're intended to be).
                 */
                if (Platform.OS === "ios") {
                  source["type"] = 'image/jpeg';
                }
              }
              const thumbnailSizes = [{'maxWidth': 200, 'maxHeight': 200}];
              this.sendImage(source, { thumbnailSizes });
            }
          }
        );
      } else if(response === 'undetermined') {
        Permissions.request('photo').then(response => {
          if(response === 'authorized') {
            this.pickImage();
          }
        });
      } else {
        toast('Permission denied. You declined the permission to access your photo.');
      }
    });
  }
  showMessageControl(message) {
    const syncManager = SendBirdSyncManager.getInstance();
    if(message.isUserMessage()
      || (message.isFileMessage() && message.sender.userId === syncManager.currentUserId)) {
      this.props.selectMessage(message);
      this.props.navigation.setParams({
        currentChat: this,
        selectedMessages: [ message ]
      });
    }
  }
  closeMessageControl() {
    this.props.deselectAllMessages();
    this.props.navigation.setParams({
      currentChat: null,
      selectedMessages: []
    });
  }
  switchToChatMode() {
    this.setState({
      inputMode: 'chat',
      editedMessage: null,
      typedText: ''
    });
  }
  switchToEditMode(message) {
    this.setState({
      inputMode: 'edit',
      editedMessage: message,
      typedText: message.message
    });
    this.messageInput.focus();
  }
	render() {
    const mode = {
      chat: {
        left: {
          icon: 'md-cloud-upload',
          onPress: this.pickImage.bind(this)
        },
        right: {
          icon: 'md-send',
          onPress: this.sendMessage.bind(this)
        }
      },
      edit: {
        left: {
          icon: 'md-close',
          onPress: this.switchToChatMode.bind(this)
        },
        right: {
          icon: 'md-checkmark',
          onPress: this.updateMessage.bind(this)
        }
      }
    };
    const currentMode = mode[this.state.inputMode];
		return (
			<View style={style.container}>
        <View style={style.messageListViewContainer}>
          <FlatList
            data={this.state.messages}
            keyExtractor={message => message.messageId + ''}
            onEndReached={this.loadPrevious.bind(this)}
            renderItem={bundle => <MessageView
              channel={this.channel}
              message={bundle.item}
              onLongPress={this.showMessageControl.bind(this)} />}
          />
        </View>
        <View style={style.messageInputContainer}>
					<Button
						containerStyle={style.uploadContainer}
						buttonStyle={style.upload}
						icon={<Icon
							name={currentMode.left.icon}
							size={28}
							color='#333'
						/>}
						onPress={currentMode.left.onPress}
					/>
					<Input
            placeholder='Your message'
            ref={input => { this.messageInput = input; }}
						containerStyle={style.formContainer}
						inputContainerStyle={style.formInputContainer}
						inputStyle={style.formInput}
						multiline={true}
						numberOfLines={3}
						autoCapitalize='none'
						autoCorrect={false}
						selectionColor='#ddd'
						underlineColorAndroid='transparent'
						value={this.state.typedText}
						onChangeText={(typedText) => this.setState({typedText})}
					/>
					<Button
						containerStyle={style.sendContainer}
						buttonStyle={style.send}
						icon={<Icon
							name={currentMode.right.icon}
							size={28}
							color={this.state.typedText.length > 0 ? '#7d62d9' : '#494e57'}
						/>}
						onPress={currentMode.right.onPress}
					/>
        </View>
      </View>
		);
	}
}

export default connect(previousState => {
	const { chat } = previousState;
	return { ...chat };
},
Action)(ChatController);