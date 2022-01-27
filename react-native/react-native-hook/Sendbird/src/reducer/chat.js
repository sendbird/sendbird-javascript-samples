export const chatReducer = (state, action) => {
  switch (action.type) {
    case 'refresh': {
      return {
        ...state,
        messageMap: {},
        messages: [],
        loading: false,
        error: null,
      };
    }
    case 'fetch-messages': {
      const { messages } = action.payload || {};
      const distinctMessages = messages.filter(message => !state.messageMap[message.reqId]);
      const mergedMessages = [...state.messages, ...distinctMessages];
      for (let i = 0; i < mergedMessages.length - 1; i++) {
        mergedMessages[i].hasSameSenderAbove =
          mergedMessages[i].sender &&
          mergedMessages[i + 1].sender &&
          mergedMessages[i].sender.userId === mergedMessages[i + 1].sender.userId;
      }

      const messageMap = {};
      for (let i in distinctMessages) {
        const message = distinctMessages[i];
        messageMap[message.reqId] = true;
      }
      return {
        ...state,
        messages: mergedMessages,
        messageMap,
        empty: mergedMessages.length === 0 ? 'Start conversation.' : '',
      };
    }
    case 'send-message':
    case 'receive-message':
    case 'update-message': {
      if (action.type === 'receive-message') {
        action.payload.channel.markAsRead();
      }

      const { message, clearInput } = action.payload || {};
      const msgId = message.reqId || message.messageId;

      if (!state.messageMap[msgId]) {
        if (state.messages.length > 0) {
          message.hasSameSenderAbove =
            message.sender && state.messages[0].sender && message.sender.userId === state.messages[0].sender.userId;
        }
        return {
          ...state,
          messages: [message, ...state.messages],
          messageMap: { ...state.messageMap, [msgId]: true },
          input: clearInput ? '' : state.input,
          empty: '',
        };
      } else {
        for (let i in state.messages) {
          if (state.messages[i].reqId === msgId) {
            const updatedMessages = [...state.messages];
            message.hasSameSenderAbove = updatedMessages[i].hasSameSenderAbove;
            updatedMessages[i] = message;
            return {
              ...state,
              input: clearInput ? '' : state.input,
              messages: updatedMessages,
            };
          }
        }
      }
      break;
    }
    case 'delete-message': {
      const { messageId, reqId } = action.payload || {};
      for (let i in state.messages) {
        if (state.messages[i].messageId === messageId || state.messages[i].reqId === reqId) {
          const updatedMessages = state.messages.filter(m => m.reqId !== reqId && m.messageId !== messageId);
          for (let i = 0; i < updatedMessages.length - 1; i++) {
            updatedMessages[i].hasSameSenderAbove =
              updatedMessages[i].sender &&
              updatedMessages[i + 1].sender &&
              updatedMessages[i].sender.userId === updatedMessages[i + 1].sender.userId;
          }
          return {
            ...state,
            messages: updatedMessages,
          };
        }
      }
      break;
    }
    case 'typing': {
      const { input } = action.payload || {};
      return { ...state, input };
    }
    case 'start-loading': {
      return { ...state, loading: true, error: '' };
    }
    case 'end-loading': {
      const { error } = action.payload || {};
      return { ...state, loading: false, error };
    }
    case 'error': {
      const { error } = action.payload || {};
      return { ...state, error };
    }
  }
  return state;
};
