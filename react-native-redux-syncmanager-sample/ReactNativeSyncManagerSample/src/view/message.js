
import React from 'react';
import {
  Image,
  Text,
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
    const isMyMessage = SendBird.getInstance().currentUser
      && this.props.message.sender
      && SendBird.getInstance().currentUser.userId === this.props.message.sender.userId;
    const isPreviousMessageSentBySameUser = !!this.props.message._isPreviousMessageSentBySameUser;
    const readReceipt = this.props.channel.getReadReceipt(this.props.message);

    const direction = isMyMessage ? 'row-reverse' : 'row';
    const bubbleColor = isMyMessage ? '#5f3dc4' : '#e6e6e6';
    const textColor = isMyMessage ? '#fff' : '#333';

    let content = null;
    if(this.props.message.isUserMessage()) {
      content = <View style={{
        backgroundColor: bubbleColor,
        ...style.messageTextContainer
        }}>
        <Text style={{ color: textColor, ...style.messageText }}>{this.props.message.message}</Text>
      </View>;
    } else if(this.props.message.isFileMessage()) {
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
                source={{ uri: this.props.message.url.replace("http://", "https://") }}
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
            this.props.message.name.length > MAX_FILENAME_LENGTH
              ? this.props.message.name.substring(0, MAX_FILENAME_LENGTH - 3) + '...'
              : this.props.message.name}</Text>
        </View>;
      }
    } else if(this.props.message.isAdminMessage()) {
      return <View style={{ ...style.container, ...style.adminMessageContainer }}>
        <Text>{ this.props.message.message }</Text>
      </View>;
    } else {
      return <View />;
    }

    return (
      <View style={{
        flexDirection: direction,
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
          source={this.props.message.sender.profileUrl
            ? { uri: this.props.message.sender.profileUrl }
            : require('../img/icon_sb_68.png') }
        />
        <View style={{ ...style.contentContainer }}>
          {!isPreviousMessageSentBySameUser &&
            <View style={{ flexDirection: direction }}>
              <Text style={style.nickname}>{this.props.message.sender.nickname}</Text>
            </View>
          }
          <View style={{ flexDirection: direction }}>
            {content}
            <View style={style.readReceiptContainer}>
              {isMyMessage && readReceipt > 0 && <Text style={style.readReceipt}>{readReceipt}</Text>}
            </View>
          </View>
          <View style={{ flexDirection: direction, ...style.createdAtContainer }}>
            <Text style={style.createdAt}>{moment(this.props.message.createdAt).fromNow()}</Text>
          </View>
        </View>
      </View>
    );
  }
}