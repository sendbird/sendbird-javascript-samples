import { MAX_COUNT } from './consts.js';
import { xssEscape } from './utils.js';

const GLOBAL_HANDLER = 'GLOBAL_HANDLER';
const GET_MESSAGE_LIMIT = 20;

class Sendbird {
  constructor(appId) {
    this.sb = new window.SendBird({ appId: appId });
    this.channelListQuery = null;
    this.userListQuery = null;
  }

  reset() {
    this.channelListQuery = null;
    this.userListQuery = null;
    this.sb.removeChannelHandler(GLOBAL_HANDLER);
  }

  isConnected() {
    return !!this.sb.currentUser;
  }

  connect(userId, nickname, action) {
    this.sb.connect(userId.trim(), (user, error) => {
      if (error) {
        console.error(error);
        return;
      }
      this.sb.updateCurrentUserInfo(nickname.trim(), '', (response, error) => {
        if (error) {
          console.error(error);
          return;
        }
        action();
      });
    });
  }

  disconnect(action) {
    if (this.isConnected()) {
      this.sb.disconnect(() => {
        action();
      });
    }
  }

  isCurrentUser(user) {
    return this.sb.currentUser.userId == user.userId;
  }

  /*
  Channel
   */
  getChannelList(action) {
    if (!this.channelListQuery) {
      this.channelListQuery = this.sb.GroupChannel.createMyGroupChannelListQuery();
      this.channelListQuery.includeEmpty = true;
      this.channelListQuery.limit = 20;
    }
    if (this.channelListQuery.hasNext && !this.channelListQuery.isLoading) {
      this.channelListQuery.next(function(channelList, error) {
        if (error) {
          console.error(error);
          return;
        }
        action(channelList);
      });
    }
  }

  getChannelInfo(channelUrl, action) {
    this.sb.GroupChannel.getChannel(channelUrl, function(channel, error) {
      if (error) {
        console.error(error);
        return;
      }
      action(channel);
    });
  }

  createNewChannel(userIds, action) {
    this.sb.GroupChannel.createChannelWithUserIds(userIds, true, '', '', '', function(channel, error) {
      if (error) {
        console.error(error);
        return;
      }
      action(channel);
    });
  }

  inviteMember(channel, userIds, action) {
    channel.inviteWithUserIds(userIds, (response, error) => {
      if (error) {
        console.error(error);
        return;
      }
      action();
    });
  }

  channelLeave(channel, action) {
    channel.leave((response, error) => {
      if (error) {
        console.error(error);
        return;
      }
      action();
    });
  }

  /*
  Message
   */
  getTotalUnreadCount(action) {
    this.sb.GroupChannel.getTotalUnreadMessageCount(unreadCount => {
      action(unreadCount);
    });
  }

  getMessageList(channelSet, action) {
    if (!channelSet.query) {
      channelSet.query = channelSet.channel.createPreviousMessageListQuery();
    }
    if (channelSet.query.hasMore && !channelSet.query.isLoading) {
      channelSet.query.load(GET_MESSAGE_LIMIT, false, function(messageList, error) {
        if (error) {
          console.error(error);
          return;
        }
        action(messageList);
      });
    }
  }

  sendTextMessage(channel, textMessage, action) {
    channel.sendUserMessage(textMessage, (message, error) => {
      if (error) {
        return;
      }
      action(message);
    });
  }

  sendFileMessage(channel, file, action) {
    let thumbSize = [{ maxWidth: 160, maxHeight: 160 }];
    channel.sendFileMessage(file, '', '', thumbSize, (message, error) => {
      if (error) {
        console.error(error);
        return;
      }
      action(message);
    });
  }

  /*
  User
   */
  getUserList(action) {
    if (!this.userListQuery) {
      this.userListQuery = this.sb.createUserListQuery();
    }
    if (this.userListQuery.hasNext && !this.userListQuery.isLoading) {
      this.userListQuery.next((userList, error) => {
        if (error) {
          console.error(error);
          return;
        }
        action(userList);
      });
    }
  }

  /*
  Handler
   */
  createHandlerGlobal(...args) {
    let messageReceivedFunc = args[0];
    let messageUpdatedFunc = args[1];
    let messageDeletedFunc = args[2];
    let ChannelChangedFunc = args[3];
    let typingStatusFunc = args[4];
    let readReceiptFunc = args[5];
    let userLeftFunc = args[6];
    let userJoinFunc = args[7];

    let channelHandler = new this.sb.ChannelHandler();
    channelHandler.onMessageReceived = function(channel, message) {
      messageReceivedFunc(channel, message);
    };
    channelHandler.onMessageUpdated = function(channel, message) {
      messageUpdatedFunc(channel, message);
    };
    channelHandler.onMessageDeleted = function(channel, messageId) {
      messageDeletedFunc(channel, messageId);
    };
    channelHandler.onChannelChanged = function(channel) {
      ChannelChangedFunc(channel);
    };
    channelHandler.onTypingStatusUpdated = function(channel) {
      typingStatusFunc(channel);
    };
    channelHandler.onReadReceiptUpdated = function(channel) {
      readReceiptFunc(channel);
    };
    channelHandler.onUserLeft = function(channel, user) {
      userLeftFunc(channel, user);
    };
    channelHandler.onUserJoined = function(channel, user) {
      userJoinFunc(channel, user);
    };
    this.sb.addChannelHandler(GLOBAL_HANDLER, channelHandler);
  }

  /*
  Info
   */
  getNicknamesString(channel) {
    let nicknameList = [];
    let currentUserId = this.sb.currentUser.userId;
    channel.members.forEach(function(member) {
      if (member.userId != currentUserId) {
        nicknameList.push(xssEscape(member.nickname));
      }
    });
    return nicknameList.toString();
  }

  getMemberCount(channel) {
    return channel.memberCount > 9 ? MAX_COUNT : channel.memberCount.toString();
  }

  getLastMessage(channel) {
    if (channel.lastMessage) {
      return channel.lastMessage.isUserMessage() || channel.lastMessage.isAdminMessage()
        ? channel.lastMessage.message
        : channel.lastMessage.name;
    }
    return '';
  }

  getMessageTime(message) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    var _getDay = val => {
      let day = parseInt(val);
      if (day == 1) {
        return day + 'st';
      } else if (day == 2) {
        return day + 'en';
      } else if (day == 3) {
        return day + 'rd';
      } else {
        return day + 'th';
      }
    };

    var _checkTime = val => {
      return +val < 10 ? '0' + val : val;
    };

    if (message) {
      const LAST_MESSAGE_YESTERDAY = 'YESTERDAY';
      var _nowDate = new Date();
      var _date = new Date(message.createdAt);
      if (_nowDate.getDate() - _date.getDate() == 1) {
        return LAST_MESSAGE_YESTERDAY;
      } else if (
        _nowDate.getFullYear() == _date.getFullYear() &&
        _nowDate.getMonth() == _date.getMonth() &&
        _nowDate.getDate() == _date.getDate()
      ) {
        return _checkTime(_date.getHours()) + ':' + _checkTime(_date.getMinutes());
      } else {
        return months[_date.getMonth()] + ' ' + _getDay(_date.getDate());
      }
    }
    return '';
  }

  getMessageReadReceiptCount(channel, message) {
    return channel.getReadReceipt(message);
  }

  getChannelUnreadCount(channel) {
    return channel.unreadMessageCount;
  }
}

export { Sendbird as default };
