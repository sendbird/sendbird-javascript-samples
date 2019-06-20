import React from 'react';
import { View, Text } from 'react-native';
import Video from 'react-native-video';
import { FileItem, TextItem } from './MessageItem';
import { ImageItem } from './ImageItem';

const _renderNickname = nickname => {
  return nickname ? <Text style={{ fontSize: 9, color: '#7048e8', paddingBottom: 4 }}>{nickname}</Text> : null;
};

const _isImage = props => {
  return props.message.type.match(/^image\/.+$/);
};

const _isVideo = props => {
  return props.message.type.match(/^video\/.+$/);
};

const MessageBubble = props => {
  let content = null;
  const message = props.message;
  if (!message) {
    return null;
  }
  if (message.isUserMessage()) {
    content = (
      <View
        style={{ maxWidth: 250, padding: 8, borderRadius: 8, backgroundColor: props.isUser ? '#5F3DC4' : '#e6e6e6' }}
      >
        {props.isUser || !props.isShow ? null : _renderNickname(props.nickname)}
        <View style={{}}>
          <TextItem isUser={props.isUser} message={message.message} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingLeft: 8 }}>
          <Text style={{ fontSize: 8, color: props.isUser ? '#E9EBEF' : '#878d99' }}>{props.time}</Text>
        </View>
      </View>
    );
  } else if (message.isFileMessage()) {
    if (_isImage(props)) {
      content = <ImageItem isUser={props.isUser} message={message.url.replace('http://', 'https://')} />;
    } else if (_isVideo(props)) {
      content = (
        <View style={styles.videoContainer}>
          <Video source={{ uri: message.url }} style={styles.video} paused={true} controls={true} />
        </View>
      );
    } else {
      content = <FileItem isUser={props.isUser} message={message.name} />;
    }
  }
  return content;
};

const styles = {
  videoContainer: {
    minWidth: 240,
    minHeight: 180,
    marginBottom: 4,
    borderRadius: 8
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 8
  }
};

export { MessageBubble };
