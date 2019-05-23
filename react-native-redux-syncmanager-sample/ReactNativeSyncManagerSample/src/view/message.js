
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Avatar,
  Icon
} from 'react-native-elements';
import { CachedImage } from 'react-native-cached-image';
import moment from 'moment';
import SendBird from 'sendbird';

import { style } from '../style/message';

const IMAGE_MAX_SIZE = 240;
const MAX_FILENAME_LENGTH = 10;

function isImage(props) {
  return props.message.type.match(/^image\/.+$/);
}

export default class MessageView extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      width: 0,
      height: 0
    };
  }
  componentDidMount() {
    this._isMounted = true;
    if(this.props.message.isFileMessage() && isImage(this.props)) {
      Image.getSize(this.props.message.url, (width, height) => {
        if(this._isMounted) {
          const scaleWidth = IMAGE_MAX_SIZE / width;
          const scaleHeight = IMAGE_MAX_SIZE / height;
      
          let scale = Math.min((scaleWidth <= scaleHeight) ? scaleWidth : scaleHeight, 1);
          this.setState({width: width * scale, height: height * scale});
        }
      });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    const channel = this.props.channel;
    const message = this.props.message;
    const isMyMessage = SendBird.getInstance().currentUser
      && message.sender
      && SendBird.getInstance().currentUser.userId === message.sender.userId;
    const isPreviousMessageSentBySameUser = !!message._isPreviousMessageSentBySameUser;
    const readReceipt = channel.getReadReceipt(message);

    const direction = isMyMessage ? 'row-reverse' : 'row';
    const bubbleColor = isMyMessage ? '#5f3dc4' : '#e6e6e6';
    const textColor = isMyMessage ? '#fff' : '#333';

    let content = null;
    if(message.isUserMessage()) {
      content = <View style={{
        backgroundColor: bubbleColor,
        ...style.messageTextContainer
        }}>
        <Text style={{ color: textColor, ...style.messageText }}>{message.message}</Text>
      </View>;
    } else if(message.isFileMessage()) {
      if(isImage(this.props)) {
        content = <View style={{
          ...style.imageContainer
          }}>
          {this.state.width > 0 && this.state.height > 0 &&
              <CachedImage 
                style={{
                  width: this.state.width,
                  height: this.state.height,
                  ...style.image
                }} 
                source={{ uri: message.url.replace("http://", "https://") }}
                resizeMode='contain'
              />}
        </View>;
      } else {
        content = <View style={{
          backgroundColor: bubbleColor,
          ...style.messageTextContainer
        }}>
          <Icon name='file' type='font-awesome' color={textColor} size={18}></Icon>
          <Text style={{ color: textColor, ...style.messageFile }}>{
            message.name.length > MAX_FILENAME_LENGTH
              ? message.name.substring(0, MAX_FILENAME_LENGTH - 3) + '...'
              : message.name}</Text>
        </View>;
      }
    } else if(message.isAdminMessage()) {
      return <View style={{ ...style.container, ...style.adminMessageContainer }}>
        <Text>{ message.message }</Text>
      </View>;
    } else {
      return <View />;
    }

    const backgroundColor = message._selected ? '#ddd' : 'transparent';
    const extendedTouchHitSlop = 100;
    return (
        <TouchableOpacity
          hitSlop={{ top: extendedTouchHitSlop, bottom: extendedTouchHitSlop }}
          activeOpacity={0.9}
          onLongPress={() => {
            if(this.props.onLongPress) {
              this.props.onLongPress(message);
            }
          }}>
          <View style={{
            flexDirection: direction,
            backgroundColor,
            ...style.container,
            ...style.normalMessageContainer }}>
            <Avatar
              containerStyle={{
                marginLeft: isMyMessage ? 8 : 0,
                marginRight: isMyMessage ? 0 : 8,
                opacity: isPreviousMessageSentBySameUser ? 0 : 1,
                ...style.avatarContainer
              }}
              small
              rounded
              source={message.sender.profileUrl
                ? { uri: message.sender.profileUrl }
                : require('../img/icon_sb_68.png') }
            />
            <View style={style.contentContainer}>
              {!isPreviousMessageSentBySameUser &&
                <View style={{ flexDirection: direction }}>
                  <Text style={style.nickname}>{message.sender.nickname}</Text>
                </View>
              }
              <View style={{ flexDirection: direction }}>
                {content}
                <View style={style.readReceiptContainer}>
                  {isMyMessage && readReceipt > 0 && <Text style={style.readReceipt}>{readReceipt}</Text>}
                </View>
              </View>
              <View style={{ flexDirection: direction, ...style.createdAtContainer}}>
                <Text style={style.createdAt}>{moment(message.createdAt).fromNow() + ((message.updatedAt > message.createdAt) ? ' (edited)' : '')}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
  }
}