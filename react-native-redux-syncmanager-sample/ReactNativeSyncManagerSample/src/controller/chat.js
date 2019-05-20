
import React from 'react';
import {
	Alert,
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

class ChatController extends React.Component {
	static navigationOptions = ({ navigation }) => {
    const channel = navigation.getParam('channel', null);
    return {
      title: `${createChannelTitle(channel)} (${channel.memberCount})`,
      headerRight: (
        <View style={style.headerRightContainer}>
          <Button
            containerStyle={style.headerRightMemberContainer}
            buttonStyle={style.headerRightMember}
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
            containerStyle={style.headerRightLeaveContainer}
            buttonStyle={style.headerRightLeave}
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
      )
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
		this.state = {
			typedMessage: '',
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
	}
	componentWillUnmount() {
    this.props.clearMessages();
    if(this.collection) {
      this.collection.remove();
      this.collection = null;
    }
    navigator.pop();
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
		if(this.state.typedMessage) {
      const tempMessage = this.channel.sendUserMessage(this.state.typedMessage, (message, err) => {
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
        this.setState({ typedMessage: '' });
      }
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
      this.setState({ typedMessage: '' });
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
	render() {
		return (
			<View style={style.container}>
        <View style={style.messageListViewContainer}>
          <FlatList
            data={this.state.messages}
            keyExtractor={message => message.messageId + ''}
            onEndReached={this.loadPrevious.bind(this)}
						renderItem={bundle => <MessageView channel={this.channel} message={bundle.item} />}
          />
        </View>
        <View style={style.messageInputContainer}>
					<Button
						containerStyle={style.uploadContainer}
						buttonStyle={style.upload}
						icon={<Icon
							name='md-cloud-upload'
							size={28}
							color='#7d62d9'
						/>}
						onPress={this.pickImage.bind(this)}
					/>
					<Input
						placeholder='Your message'
						containerStyle={style.formContainer}
						inputContainerStyle={style.formInputContainer}
						inputStyle={style.formInput}
						multiline={true}
						numberOfLines={3}
						autoCapitalize='none'
						autoCorrect={false}
						selectionColor='#ddd'
						underlineColorAndroid='transparent'
						value={this.state.typedMessage}
						onChangeText={(typedMessage) => this.setState({typedMessage})}
					/>
					<Button
						containerStyle={style.sendContainer}
						buttonStyle={style.send}
						icon={<Icon
							name='md-send'
							size={28}
							color={this.state.typedMessage.length > 0 ? '#7d62d9' : '#494e57'}
						/>}
						onPress={this.sendMessage.bind(this)}
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