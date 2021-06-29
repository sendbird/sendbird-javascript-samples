import SendBird from 'sendbird';

export const sbGetChannelTitle = channel => {
  if (channel.isOpenChannel()) {
    return channel.name;
  } else {
    const { members } = channel;
    let nicknames = members
      .map(member => {
        return member.nickname;
      })
      .join(', ');

    if (nicknames.length > 21) {
      nicknames = nicknames.substring(0, 17) + '...';
    }

    return nicknames;
  }
};

export const sbAdjustMessageList = list => {
  return list.map((message, i) => {
    message['time'] = sbUnixTimestampToDate(message.createdAt);
    message['readCount'] = 0;
    if (message.isUserMessage() || message.isFileMessage()) {
      message['isUser'] = message.sender.userId === SendBird.getInstance().getCurrentUserId();
    } else {
      message['isUser'] = false;
    }
    if (message.sender) {
      message.sender['isShow'] = true;
      if (!message.sender.profileUrl) {
        message.sender.profileUrl = 'default-image';
      }
    }

    if (i < list.length - 1) {
      let prevMessage = list[i + 1];
      if (message.isUserMessage() || message.isFileMessage()) {
        if (prevMessage.isUserMessage() || prevMessage.isFileMessage()) {
          if (prevMessage.sender.userId === message.sender.userId) {
            message.sender.isShow = false;
          }
        }
      }
    }
    return message;
  });
};

export const sbUnixTimestampToDate = unixTimestamp => {
  const today = new Date();
  const date = new Date(unixTimestamp);

  if (today.getMonth() !== date.getMonth() || today.getDay() !== date.getDay()) {
    return date.getMonth() + '/' + date.getDay();
  } else {
    const hour = '0' + date.getHours();
    const minute = '0' + date.getMinutes();
    return hour.substr(-2) + ':' + minute.substr(-2);
  }
};
