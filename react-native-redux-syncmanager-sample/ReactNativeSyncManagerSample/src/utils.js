
import Toast from 'react-native-root-toast';

export function getChannelIndex(newChannel, channels) {
  for(let i = 0; i < channels.length; i++) {
    if(channels[i].url === newChannel.url) {
      return i;
    }
  }
  return -1;
}
export function findChannelIndex(newChannel, channels) {
  const newChannelLastMessageUpdated = newChannel.lastMessage
    ? newChannel.lastMessage.createdAt
    : newChannel.createdAt;
  let index = channels.length;
  for(let i = 0; i < channels.length; i++) {
    const comparedChannel = channels[i];
    const comparedChannelLastMessageUpdated = comparedChannel.lastMessage
      ? comparedChannel.lastMessage.createdAt
      : comparedChannel.createdAt;
    if(newChannelLastMessageUpdated === comparedChannelLastMessageUpdated && newChannel.url === comparedChannel.url) {
      index = i;
      break;
    } else if(newChannelLastMessageUpdated > comparedChannelLastMessageUpdated) {
      index = i;
      break;
    }
  }
  return index;
}
export function getMessageIndex(newMessage, messages) {
  for(let i = 0; i < messages.length; i++) {
    if(newMessage.isIdentical(messages[i])) {
      return i;
    }
  }
  return -1;
}
export function findMessageIndex(newMessage, messages) {
  let index = messages.length;
  for(let i = 0; i < messages.length; i++) {
    if(messages[i].createdAt < newMessage.createdAt) {
      index = i;
      break;
    }
  }
  return index;
}
export function createChannelTitle(channel) {
  let title = channel.members.map(member => member.nickname).join(', ');
		if (title.length > 21) {
			title = title.substring(0, 17) + '...';
    }
    return title;
}
export function toast(msg) {
  Toast.show(msg, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true
  });
}