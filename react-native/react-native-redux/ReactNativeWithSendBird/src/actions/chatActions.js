import {
  INIT_CHAT_SCREEN,
  CREATE_CHAT_HANDLER_SUCCESS,
  CREATE_CHAT_HANDLER_FAIL,
  CHANNEL_TITLE_CHANGED,
  CHANNEL_TITLE_CHANGED_FAIL,
  MESSAGE_LIST_SUCCESS,
  MESSAGE_LIST_FAIL,
  SEND_MESSAGE_TEMPORARY,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  USER_BLOCK_SUCCESS,
  USER_BLOCK_FAIL,
  CHANNEL_EXIT_SUCCESS,
  CHANNEL_EXIT_FAIL,
  SEND_TYPING_START_SUCCESS,
  SEND_TYPING_START_FAIL,
  SEND_TYPING_END_SUCCESS,
  SEND_TYPING_END_FAIL,
  MESSAGE_RECEIVED,
  MESSAGE_UPDATED,
  MESSAGE_DELETED,
  CHANNEL_CHANGED,
  TYPING_STATUS_UPDATED,
  READ_RECEIPT_UPDATED,
  USER_MESSAGE_PRESS,
  USER_MESSAGE_SELECTION_CLEAR,
  OWN_MESSAGE_DELETED,
  OWN_MESSAGE_DELETED_FAIL,
  OWN_MESSAGE_UPDATED,
  OWN_MESSAGE_UPDATED_FAIL,
  MESSAGE_COPY
} from './types';

import {
  sbGetOpenChannel,
  sbOpenChannelEnter,
  sbGetChannelTitle,
  sbGetMessageList,
  sbSendTextMessage,
  sbSendFileMessage,
  sbUserBlock,
  sbGetGroupChannel,
  sbOpenChannelExit,
  sbTypingStart,
  sbTypingEnd,
  sbIsTyping,
  sbChannelDeleteMessage,
  sbChannelUpdateMessage,
  sbMarkAsRead
} from '../sendbirdActions';

import SendBird from 'sendbird';

export const initChatScreen = () => {
  const sb = SendBird.getInstance();
  sb.removeAllChannelHandlers();
  return { type: INIT_CHAT_SCREEN };
};

export const getChannelTitle = (channelUrl, isOpenChannel) => {
  return dispatch => {
    if (isOpenChannel) {
      return sbGetOpenChannel(channelUrl)
        .then(channel => {
          dispatch({
            type: CHANNEL_TITLE_CHANGED,
            title: sbGetChannelTitle(channel),
            memberCount: channel.participantCount
          });
        })
        .catch(error => {
          dispatch({ type: CHANNEL_TITLE_CHANGED_FAIL });
        });
    } else {
      return sbGetGroupChannel(channelUrl)
        .then(channel => {
          dispatch({
            type: CHANNEL_TITLE_CHANGED,
            title: sbGetChannelTitle(channel),
            memberCount: channel.memberCount
          });
        })
        .catch(error => {
          dispatch({ type: CHANNEL_TITLE_CHANGED_FAIL });
        });
    }
  };
};

export const createChatHandler = (channelUrl, isOpenChannel) => {
  return dispatch => {
    if (isOpenChannel) {
      return sbGetOpenChannel(channelUrl)
        .then(channel => {
          sbOpenChannelEnter(channel)
            .then(channel => {
              registerOpenChannelHandler(channelUrl, dispatch);
              dispatch({ type: CREATE_CHAT_HANDLER_SUCCESS });
            })
            .catch(error => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }));
        })
        .catch(error => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }));
    } else {
      return sbGetGroupChannel(channelUrl)
        .then(channel => {
          registerGroupChannelHandler(channelUrl, dispatch);
          dispatch({ type: CREATE_CHAT_HANDLER_SUCCESS });
        })
        .catch(error => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }));
    }
  };
};

const registerCommonHandler = (channelHandler, channelUrl, dispatch) => {
  channelHandler.onMessageReceived = (channel, message) => {
    if (channel.url === channelUrl) {
      if (channel.isGroupChannel()) {
        sbMarkAsRead({ channel });
      }
      dispatch({
        type: MESSAGE_RECEIVED,
        payload: message
      });
    }
  };
  channelHandler.onMessageUpdated = (channel, message) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: MESSAGE_UPDATED,
        payload: message
      });
    }
  };
  channelHandler.onMessageDeleted = (channel, messageId) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: MESSAGE_DELETED,
        payload: messageId
      });
    }
  };
};

const registerOpenChannelHandler = (channelUrl, dispatch) => {
  const sb = SendBird.getInstance();
  let channelHandler = new sb.ChannelHandler();

  registerCommonHandler(channelHandler, channelUrl, dispatch);

  channelHandler.onUserEntered = (channel, user) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: CHANNEL_CHANGED,
        memberCount: channel.participantCount,
        title: channel.name
      });
    }
  };
  channelHandler.onUserExited = (channel, user) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: CHANNEL_CHANGED,
        memberCount: channel.participantCount,
        title: channel.name
      });
    }
  };

  sb.addChannelHandler(channelUrl, channelHandler);
};

const registerGroupChannelHandler = (channelUrl, dispatch) => {
  const sb = SendBird.getInstance();
  let channelHandler = new sb.ChannelHandler();
  registerCommonHandler(channelHandler, channelUrl, dispatch);
  channelHandler.onUserJoined = (channel, user) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: CHANNEL_TITLE_CHANGED,
        title: sbGetChannelTitle(channel),
        memberCount: channel.memberCount
      });
    }
  };
  channelHandler.onUserLeft = (channel, user) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: CHANNEL_TITLE_CHANGED,
        title: sbGetChannelTitle(channel),
        memberCount: channel.memberCount
      });
    }
  };
  channelHandler.onReadReceiptUpdated = channel => {
    if (channel.url === channelUrl) {
      dispatch({ type: READ_RECEIPT_UPDATED });
    }
  };
  channelHandler.onTypingStatusUpdated = channel => {
    if (channel.url === channelUrl) {
      const typing = sbIsTyping(channel);
      dispatch({
        type: TYPING_STATUS_UPDATED,
        typing: typing
      });
    }
  };
  sb.addChannelHandler(channelUrl, channelHandler);
};

export const getPrevMessageList = previousMessageListQuery => {
  return dispatch => {
    if (previousMessageListQuery.hasMore) {
      return sbGetMessageList(previousMessageListQuery)
        .then(messages => {
          dispatch({
            type: MESSAGE_LIST_SUCCESS,
            list: messages
          });
        })
        .catch(error => dispatch({ type: MESSAGE_LIST_FAIL }));
    } else {
      dispatch({ type: MESSAGE_LIST_FAIL });
      return Promise.resolve(true);
    }
  };
};

export const onSendButtonPress = (channelUrl, isOpenChannel, textMessage) => {
  return dispatch => {
    if (isOpenChannel) {
      return sbGetOpenChannel(channelUrl)
        .then(channel => {
          sendTextMessage(dispatch, channel, textMessage);
        })
        .catch(error => dispatch({ type: SEND_MESSAGE_FAIL }));
    } else {
      return sbGetGroupChannel(channelUrl)
        .then(channel => {
          sendTextMessage(dispatch, channel, textMessage);
        })
        .catch(error => dispatch({ type: SEND_MESSAGE_FAIL }));
    }
  };
};

const sendTextMessage = (dispatch, channel, textMessage) => {
  const messageTemp = sbSendTextMessage(channel, textMessage, (message, error) => {
    if (error) {
      dispatch({ type: SEND_MESSAGE_FAIL });
    } else {
      dispatch({
        type: SEND_MESSAGE_SUCCESS,
        message: message
      });
    }
  });
  dispatch({
    type: SEND_MESSAGE_TEMPORARY,
    message: messageTemp
  });
};

export const onUserBlockPress = blockUserId => {
  return dispatch => {
    return sbUserBlock(blockUserId)
      .then(user => dispatch({ type: USER_BLOCK_SUCCESS }))
      .catch(error => dispatch({ type: USER_BLOCK_FAIL }));
  };
};

export const onUserMessagePress = message => {
  return { type: USER_MESSAGE_PRESS, message: message };
};

export const onMessageDelete = (channelUrl, isOpenChannel, message) => {
  return dispatch => {
    let promise = null;
    if (isOpenChannel) {
      promise = sbGetOpenChannel(channelUrl);
    } else {
      promise = sbGetGroupChannel(channelUrl);
    }
    return promise
      .then(channel => {
        sbChannelDeleteMessage(channel, message)
          .then(response => dispatch({ type: OWN_MESSAGE_DELETED }))
          .catch(error => dispatch({ type: OWN_MESSAGE_DELETED_FAIL }));
      })
      .catch(error => dispatch({ type: OWN_MESSAGE_DELETED_FAIL }));
  };
};

export const onUserUpdateMessage = (channelUrl, isOpenChannel, message, contents) => {
  return dispatch => {
    let promise = null;
    if (isOpenChannel) {
      promise = sbGetOpenChannel(channelUrl);
    } else {
      promise = sbGetGroupChannel(channelUrl);
    }
    return promise
      .then(channel => {
        return sbChannelUpdateMessage(channel, message, contents)
          .then(response => dispatch({ type: OWN_MESSAGE_UPDATED, edited: message, contents }))
          .catch(error => {
            dispatch({ type: OWN_MESSAGE_UPDATED_FAIL });
          });
      })
      .catch(error => {
        dispatch({ type: OWN_MESSAGE_UPDATED_FAIL });
      });
  };
};

export const onUserMessageCopy = () => {
  return { type: MESSAGE_COPY };
};

export const clearMessageSelection = () => {
  return { type: USER_MESSAGE_SELECTION_CLEAR };
};

export const onFileButtonPress = (channelUrl, isOpenChannel, source) => {
  return dispatch => {
    if (isOpenChannel) {
      return sbGetOpenChannel(channelUrl)
        .then(channel => {
          return sendFileMessage(dispatch, channel, source);
        })
        .then(message => {
          dispatch({
            type: SEND_MESSAGE_SUCCESS,
            message: message
          });
        })
        .catch(error => dispatch({ type: SEND_MESSAGE_FAIL }));
    } else {
      return sbGetGroupChannel(channelUrl)
        .then(channel => {
          return sendFileMessage(dispatch, channel, source);
        })
        .then(message => {
          dispatch({
            type: SEND_MESSAGE_SUCCESS,
            message: message
          });
        })
        .catch(error => {
          dispatch({ type: SEND_MESSAGE_FAIL });
        });
    }
  };
};

const sendFileMessage = (dispatch, channel, file) => {
  return new Promise((resolve, reject) => {
    sbSendFileMessage(channel, file, (message, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(message);
      }
    });
  });
};

export const typingStart = channelUrl => {
  return dispatch => {
    return sbTypingStart(channelUrl)
      .then(response => dispatch({ type: SEND_TYPING_START_SUCCESS }))
      .catch(error => dispatch({ type: SEND_TYPING_START_FAIL }));
  };
};

export const typingEnd = channelUrl => {
  return dispatch => {
    return sbTypingEnd(channelUrl)
      .then(response => dispatch({ type: SEND_TYPING_END_SUCCESS }))
      .catch(error => dispatch({ type: SEND_TYPING_END_FAIL }));
  };
};

export const channelExit = (channelUrl, isOpenChannel) => {
  return dispatch => {
    if (isOpenChannel) {
      return sbGetOpenChannel(channelUrl)
        .then(channel => {
          sbOpenChannelExit(channel)
            .then(response => dispatch({ type: CHANNEL_EXIT_SUCCESS }))
            .catch(error => dispatch({ type: CHANNEL_EXIT_FAIL }));
        })
        .catch(error => dispatch({ type: CHANNEL_EXIT_FAIL }));
    } else {
      const sb = SendBird.getInstance();
      sb.removeChannelHandler(channelUrl);
      dispatch({ type: CHANNEL_EXIT_SUCCESS });
      return Promise.resolve(true);
    }
  };
};
