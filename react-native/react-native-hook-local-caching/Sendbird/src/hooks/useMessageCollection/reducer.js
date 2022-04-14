import { useMemo, useReducer } from 'react';

export function arrayToMapWithGetter(arr, getSelector) {
  return arr.reduce((accum, curr) => {
    const _key = getSelector(curr);
    accum[_key] = curr;
    return accum;
  }, {});
}

export function getMessageUniqId(msg) {
  if (msg.isUserMessage() || msg.isFileMessage()) {
    if (msg.sendingStatus === 'succeeded') return msg.messageId + '';
    return msg.reqId;
  }

  return msg.messageId + '';
}

export function isMyMessage(msg, currentUserId = '##__USER_ID_IS_NOT_PROVIDED__##') {
  return (
    ('sender' in msg && msg.sender?.userId === currentUserId) ||
    msg.sendingStatus === 'pending' ||
    msg.sendingStatus === 'failed' ||
    msg.sendingStatus === 'canceled'
  );
}

const defaultReducer = ({ ...draft }, action) => {
  switch (action.type) {
    case 'update_refreshing':
    case 'update_loading': {
      const key = action.type === 'update_loading' ? 'loading' : 'refreshing';
      draft[key] = action.value.status;

      return draft;
    }
    case 'update_messages': {
      const key = 'messageMap';
      const messageMap = arrayToMapWithGetter(action.value.messages, getMessageUniqId);
      if (action.value.clearPrev) {
        draft[key] = messageMap;
      } else {
        draft[key] = { ...draft[key], ...messageMap };

        // NOTE: Replace pending message to succeeded message
        action.value.messages
          .filter(m => {
            return (
              (m.isFileMessage() || m.isUserMessage()) &&
              Boolean(draft[key][m.reqId]) &&
              m.sendingStatus === 'succeeded' &&
              isMyMessage(m, action.value.currentUserId)
            );
          })
          .forEach(m => delete draft[key][m.reqId]);
      }

      return draft;
    }
    case 'delete_messages': {
      const key = 'messageMap';
      draft[key] = { ...draft[key] };
      action.value.messageIds.forEach(msgId => delete draft[key][msgId]);
      action.value.reqIds.forEach(reqId => delete draft[key][reqId]);

      return draft;
    }
  }
};

export const useGroupChannelMessagesReducer = userId => {
  const [{ loading, refreshing, messageMap }, dispatch] = useReducer(defaultReducer, {
    loading: true,
    refreshing: false,
    messageMap: {},
  });

  const updateMessages = (messages, clearPrev, currentUserId) => {
    dispatch({ type: 'update_messages', value: { messages, clearPrev, currentUserId } });
  };
  const deleteMessages = (messageIds, reqIds) => {
    dispatch({ type: 'delete_messages', value: { messageIds, reqIds } });
  };
  const updateLoading = status => {
    dispatch({ type: 'update_loading', value: { status } });
  };
  const updateRefreshing = status => {
    dispatch({ type: 'update_refreshing', value: { status } });
  };

  const messages = useMemo(() => {
    return Object.values(messageMap).sort((a, b) => b.createdAt - a.createdAt);
  }, [messageMap]);

  return {
    updateLoading,
    updateRefreshing,
    updateMessages,
    deleteMessages,

    loading,
    refreshing,
    messages,
  };
};
