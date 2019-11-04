import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Video from 'react-native-video';
import { FileItem, TextItem } from './MessageItem';
import { ImageItem } from './ImageItem';

const _isVideo = props => {
  return props.message.type.match(/^video\/.+$/);
};

const _isImage = props => {
  return props.message.type.match(/^image\/.+$/);
};

export class MessageBubble extends Component {
  constructor(props) {
    super(props);
  }

  _renderNickname = nickname => {
    return nickname ? <Text style={{ fontSize: 9, color: '#7048e8', paddingBottom: 4 }}>{nickname}</Text> : null;
  };

  _renderMessageItem = message => {
    if (message.isUserMessage()) {
      return <TextItem isUser={this.props.isUser} message={message.message} />;
    } else if (_isImage(this.props)) {
      return <ImageItem isUser={this.props.isUser} message={message.url.replace('http://', 'https://')} />;
    } else if (_isVideo(this.props)) {
      return (
        <View style={styles.videoContainer}>
          <Video source={{ uri: message.url }} style={styles.video} paused={true} controls={true} />
        </View>
      );
    } else {
      return <FileItem isUser={this.props.isUser} message={message.name} />;
    }
  };

  render() {
    const message = this.props.message;
    if (!message) {
      return null;
    }
    return (
      <View
        style={{
          maxWidth: 250,
          padding: 8,
          borderRadius: 8,
          backgroundColor: this.props.isUser ? '#5F3DC4' : '#e6e6e6'
        }}
      >
        {this.props.isUser || !this.props.isShow ? null : this._renderNickname(this.props.nickname)}
        <View style={{}}>{this._renderMessageItem(this.props.message)}</View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingLeft: 8
          }}
        >
          <Text
            style={{
              fontSize: 8,
              color: this.props.isUser ? '#E9EBEF' : '#878d99'
            }}
          >
            {this.props.time}
          </Text>
        </View>
        {this.props.isEdited && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingLeft: 8
            }}
          >
            <Text
              style={{
                fontSize: 8,
                color: this.props.isUser ? '#E9EBEF' : '#878d99'
              }}
            >
              edited
            </Text>
          </View>
        )}
      </View>
    );
  }
}

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
