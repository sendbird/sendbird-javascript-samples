import React, { useEffect, useState } from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';
import moment from 'moment';

import { withAppContext } from '../context';
import { createChannelName, createUnreadMessageCount, ellipsis } from '../utils';

const LAST_MESSAGE_ELLIPSIS = 45;

const Channel = props => {
  const { sendbird, channel, onPress } = props;
  const [name, setName] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [unreadMessageCount, setUnreadMessageCount] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  const channelHandler = new sendbird.ChannelHandler();
  channelHandler.onChannelChanged = updatedChannel => {
    if (updatedChannel.url === channel.url) {
      updateChannelName(updatedChannel);
      updateLastMessage(updatedChannel);
      updateUnreadMessageCount(updatedChannel);
      updateUpdatedAt(updatedChannel);
    }
  };
  channelHandler.onUserJoined = (updatedChannel, user) => {
    if (updatedChannel.url === channel.url) {
      if (user.userId !== sendbird.currentUser.userId) {
        updateChannelName(updatedChannel);
      }
    }
  };
  channelHandler.onUserLeft = (updatedChannel, user) => {
    if (updatedChannel.url === channel.url) {
      if (user.userId !== sendbird.currentUser.userId) {
        updateChannelName(updatedChannel);
      }
    }
  };

  const updateChannelName = channel => {
    setName(createChannelName(channel));
  };
  const updateLastMessage = channel => {
    if (channel.lastMessage) {
      const message = channel.lastMessage;
      if (message.isUserMessage()) {
        setLastMessage(message.message);
      } else if (message.isFileMessage()) {
        setLastMessage(message.name);
      }
    }
  };
  const updateUnreadMessageCount = channel => {
    setUnreadMessageCount(createUnreadMessageCount(channel));
  };
  const updateUpdatedAt = channel => {
    setUpdatedAt(moment(channel.lastMessage ? channel.lastMessage.createdAt : channel.createdAt).fromNow());
  };

  useEffect(() => {
    // channel event listener
    sendbird.addChannelHandler(`channel_${channel.url}`, channelHandler);
    updateChannelName(channel);
    updateLastMessage(channel);
    updateUnreadMessageCount(channel);
    updateUpdatedAt(channel);
    return () => {
      sendbird.removeChannelHandler(`channel_${channel.url}`);
    };
  }, []);
  return (
    <TouchableOpacity activeOpacity={0.75} style={style.container} onPress={() => onPress(channel)}>
      <Image
        source={channel.coverUrl ? { uri: channel.coverUrl } : require('../asset/logo-icon-purple.png')}
        style={style.profileImage}
      />
      <View style={style.contentContainer}>
        <Text style={style.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={style.lastMessage}>{ellipsis(lastMessage.replace(/\n/g, ' '), LAST_MESSAGE_ELLIPSIS)}</Text>
      </View>
      <View style={style.propertyContainer}>
        <Text style={style.updatedAt}>{updatedAt}</Text>
        {channel.unreadMessageCount > 0 ? (
          <View style={style.unreadMessageCountContainer}>
            <Text style={style.unreadMessageCount}>{unreadMessageCount}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const style = {
  container: {
    flexDirection: 'row',
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    marginRight: 15,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    alignSelf: 'center',
    paddingBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '100',
    color: '#333',
    marginRight: 8,
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
  },
  propertyContainer: {
    alignItems: 'center',
  },
  unreadMessageCountContainer: {
    minWidth: 20,
    padding: 3,
    borderRadius: 10,
    backgroundColor: '#742ddd',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  unreadMessageCount: {
    fontSize: 12,
    color: '#fff',
  },
  updatedAt: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    marginBottom: 4,
  },
};

export default withAppContext(Channel);
