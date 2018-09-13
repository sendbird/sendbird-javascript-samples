'use strict';

const GLOBAL_HANDLER = 'GLOBAL_HANDLER';
const GET_MESSAGE_LIMIT = 30;

export const KeyCode = {
  ENTER : 13,
  KR : 229
};

class SendbirdAdapter {
  constructor(appId) {
    this.api = new window.SendBird({ appId: appId });
    this.messageListQuery = null;
    this.channel = null;
  }

  reset() {
    this.channel = null;
    this.api.removeChannelHandler(GLOBAL_HANDLER);
  }

  /*
  User
   */
  isConnected() {
    return !!this.api.currentUser;
  }
  isCurrentUser(user) {
    return this.api.currentUser.userId === user.userId;
  }

  connect(userId, nickname, action) {
    this.api.connect(userId.trim(), (user, error) => {
      if (error) {
        console.error(error);
        return;
      }
      this.api.updateCurrentUserInfo(nickname.trim(), '', (response, error) => {
        if (error) {
          console.error(error);
          return;
        }
        action();
      });
    });
  }

  disconnect(action) {
    if(this.isConnected()) {
      this.api.disconnect(() => {
        action();
      });
    }
  }

  /*
  Channel
   */
  enterChannel(channelUrl, action) {
    this.api.OpenChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        console.error(error);
        return;
      }
      channel.enter((response, error) => {
        if (error) {
          console.error(error);
          return;
        }
        this.channel = channel;
        action();
      });
    });
  }

  exitChannel(callback) {
    this.channel.exit((response, error) => {
      if (error) {
        console.error(error);
        return;
      }
      this.channel = null;
      callback();
    });
  }

  /*
  Message
   */
  getMessageList(action, isInit) {
    if (!this.messageListQuery || isInit) {
      this.messageListQuery = this.channel.createPreviousMessageListQuery();
    }
    if (this.messageListQuery.hasMore && !this.messageListQuery.isLoading) {
      this.messageListQuery.load(GET_MESSAGE_LIMIT, !isInit, (messageList, error) => {
        if (error) {
          console.error(error);
          return;
        }
        action(messageList);
      });
    }
  }

  sendMessage(textMessage, action) {
    this.channel.sendUserMessage(textMessage, (message, error) => {
      if (error) {
        console.error(error);
        return;
      }
      action(message);
    });
  }

  /*
  Handler
   */
  createHandler(onMessageReceived) {
    let channelHandler = new this.api.ChannelHandler();
    channelHandler.onMessageReceived = onMessageReceived;
    channelHandler.onMessageDeleted = (channel, messageId) => {
      var deletedMessage = document.getElementById(messageId);
      if (deletedMessage) {
        deletedMessage.remove();
      }
    };
    this.api.addChannelHandler(GLOBAL_HANDLER, channelHandler);
  }

  connectionHandler(channelUrl, liveChat) {
    let ConnectionHandler = new this.api.ConnectionHandler();
    ConnectionHandler.onReconnectStarted = function(id) {
      console.log('onReconnectStarted');
      liveChat.$spinner.attachTo(liveChat.$messageBoard.$content);
    };

    ConnectionHandler.onReconnectSucceeded = function(id) {
      console.log('onReconnectSucceeded');
      liveChat.enterChannel(channelUrl);
    };

    ConnectionHandler.onReconnectFailed = function(id) {
      console.log('onReconnectFailed');
    };
    this.api.addConnectionHandler('CONNECTION_HANDLER', ConnectionHandler);
  }
}

export { SendbirdAdapter as default };
