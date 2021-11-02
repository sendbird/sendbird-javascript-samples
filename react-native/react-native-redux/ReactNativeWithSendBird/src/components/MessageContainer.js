import React from 'react';
import { View, Text } from 'react-native';
import { MessageBubble } from './MessageBubble';

const _renderUnreadCount = readCount => {
  return readCount ? <Text style={{ fontSize: 10, color: '#f03e3e' }}>{readCount}</Text> : null;
};

const MessageContainer = props => {
  return (
    <View style={{ flexDirection: props.isUser ? 'row-reverse' : 'row' }}>
      <MessageBubble
        isShow={props.isShow}
        isUser={props.isUser}
        nickname={props.nickname}
        message={props.message}
        time={props.time}
        isEdited={props.isEdited}
      />
      <View
        style={{
          flexDirection: 'column-reverse',
          paddingLeft: 4,
          paddingRight: 4
        }}
      >
        {props.isUser ? _renderUnreadCount(props.readCount) : null}
      </View>
    </View>
  );
};

const styles = {};

export { MessageContainer };
