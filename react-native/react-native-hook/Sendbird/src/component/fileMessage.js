import React, { useEffect, useState } from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import { withAppContext } from '../context';

const DEFAULT_IMAGE_WIDTH = 240;
const DEFAULT_IMAGE_HEIGHT = 160;

const FileMessage = props => {
  const { sendbird, channel, message, onPress = () => {}, onLongPress = () => {} } = props;
  const isMyMessage = message.sender.userId === sendbird.currentUser.userId;
  const [readReceipt, setReadReceipt] = useState(0);

  const isImage = () => {
    return message.type.match(/^image\/.+$/);
  };
  const isVideo = () => {
    return message.type.match(/^video\/.+$/);
  };
  const isFile = () => {
    return !isImage() && !isVideo();
  };

  useEffect(() => {
    sendbird.addChannelHandler(`message-${message.reqId}`, channelHandler);
    setReadReceipt(channel.getUnreadMemberCount(message));
    return () => {
      sendbird.removeChannelHandler(`message-${message.reqId}`);
    };
  }, []);

  const channelHandler = new sendbird.ChannelHandler();
  channelHandler.onReadReceiptUpdated = targetChannel => {
    if (targetChannel.url === channel.url) {
      const newReadReceipt = channel.getUnreadMemberCount(message);
      if (newReadReceipt !== readReceipt) {
        setReadReceipt(newReadReceipt);
      }
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(message)}
      onLongPress={() => onLongPress(message)}
      style={{
        ...style.container,
        flexDirection: isMyMessage ? 'row-reverse' : 'row',
      }}
    >
      <View style={style.profileImageContainer}>
        {!message.hasSameSenderAbove && (
          <Image source={{ uri: message.sender.profileUrl }} style={style.profileImage} />
        )}
      </View>
      <View style={{ ...style.content, alignItems: isMyMessage ? 'flex-end' : 'flex-start' }}>
        {!message.hasSameSenderAbove && <Text style={style.nickname}>{message.sender.nickname}</Text>}
        {isImage() && <Image resizeMode={'cover'} source={{ uri: message.url }} style={style.image} />}
        {isVideo() && <Video source={{ uri: message.url }} repeat muted style={style.video} />}
        {isFile() && (
          <View style={{ ...style.messageBubble, backgroundColor: isMyMessage ? '#7b53ef' : '#ddd' }}>
            <Icon name="attach-file" color={isMyMessage ? '#fff' : '#333'} size={18} />
            <Text style={{ ...style.message, color: isMyMessage ? '#fff' : '#333' }}>{message.name}</Text>
          </View>
        )}
      </View>
      <View style={{ ...style.status, alignItems: isMyMessage ? 'flex-end' : 'flex-start' }}>
        {message.sendingStatus === 'pending' && (
          <Progress.Circle size={10} indeterminate indeterminateAnimationDuration={800} color="#999" />
        )}
        {message.sendingStatus === 'succeeded' && readReceipt > 0 && (
          <Text style={style.readReceipt}>{readReceipt}</Text>
        )}
        <Text style={style.updatedAt}>{moment(message.createdAt).fromNow()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const style = {
  container: {
    paddingHorizontal: 4,
  },
  profileImageContainer: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderWidth: 0,
    borderRadius: 16,
    marginTop: 20,
  },
  content: {
    alignSelf: 'flex-end',
    marginHorizontal: 4,
  },
  nickname: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#888',
    marginHorizontal: 8,
  },
  image: {
    width: DEFAULT_IMAGE_WIDTH,
    height: DEFAULT_IMAGE_HEIGHT,
    backgroundColor: '#ccc',
    borderRadius: 8,
    marginTop: 6,
  },
  video: {
    width: DEFAULT_IMAGE_WIDTH,
    height: DEFAULT_IMAGE_HEIGHT,
    borderRadius: 8,
    marginTop: 6,
  },
  messageBubble: {
    maxWidth: 240,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 4,
  },
  message: {
    fontSize: 18,
  },
  status: {
    alignSelf: 'flex-end',
    marginHorizontal: 3,
    marginBottom: 2,
  },
  readReceipt: {
    fontSize: 12,
    color: '#f89',
  },
  updatedAt: {
    fontSize: 12,
    color: '#999',
  },
};

export default withAppContext(FileMessage);
