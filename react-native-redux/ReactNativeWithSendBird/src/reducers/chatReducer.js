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
  CHANNEL_EXIT_SUCCESS,
  CHANNEL_EXIT_FAIL,
  USER_MESSAGE_PRESS,
  USER_MESSAGE_SELECTION_CLEAR,
  MESSAGE_RECEIVED,
  MESSAGE_UPDATED,
  MESSAGE_DELETED,
  CHANNEL_CHANGED,
  TYPING_STATUS_UPDATED,
  READ_RECEIPT_UPDATED,
  OWN_MESSAGE_DELETED,
  OWN_MESSAGE_DELETED_FAIL,
  OWN_MESSAGE_UPDATED,
  OWN_MESSAGE_UPDATED_FAIL,
  MESSAGE_COPY
} from '../actions/types';

const INITAL_STATE = {
  list: [],
  memberCount: 0,
  title: '',
  exit: false,
  typing: '',
  selectedMessages: []
};

const uniqueList = list => {
  return list.reduce((uniqList, currentValue) => {
    let ids = uniqList.map(item => {
      return item.messageId;
    });
    if (ids.indexOf(currentValue.messageId) < 0) {
      uniqList.push(currentValue);
    }
    return uniqList;
  }, []);
};

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case INIT_CHAT_SCREEN:
      return { ...state, ...INITAL_STATE };
    case CREATE_CHAT_HANDLER_SUCCESS:
      return { ...state };
    case CREATE_CHAT_HANDLER_FAIL:
      return { ...state };
    case CHANNEL_TITLE_CHANGED:
      return { ...state, title: action.title, memberCount: action.memberCount };
    case CHANNEL_TITLE_CHANGED_FAIL:
      return { ...state };
    case MESSAGE_LIST_SUCCESS:
      return { ...state, list: uniqueList([...state.list, ...action.list]) };
    case MESSAGE_LIST_FAIL:
      return { ...state };
    case SEND_MESSAGE_TEMPORARY:
      return { ...state, list: [...[action.message], ...state.list] };
    case SEND_MESSAGE_SUCCESS:
      const newMessage = action.message;
      let foundNewMessage = false;
      const sendSuccessList = state.list.map(message => {
        if (message.reqId && newMessage.reqId && message.reqId.toString() === newMessage.reqId.toString()) {
          foundNewMessage = true;
          return newMessage;
        } else {
          return message;
        }
      });
      if (foundNewMessage) {
        return { ...state, list: sendSuccessList };
      } else {
        return { ...state, list: [...[newMessage], ...sendSuccessList] };
      }
    case SEND_MESSAGE_FAIL:
      const newChatList = state.list.slice(1);
      return { ...state, list: newChatList };
    case CHANNEL_EXIT_SUCCESS:
      return { ...state, exit: true };
    case CHANNEL_EXIT_FAIL:
      return { ...state, exit: false };
    case USER_MESSAGE_PRESS:
      const newSelectedMessage = action.message;
      return { ...state, selectedMessages: [newSelectedMessage] };
    case USER_MESSAGE_SELECTION_CLEAR:
      return { ...state, selectedMessages: [] };
    case MESSAGE_RECEIVED:
      return { ...state, list: uniqueList([...[action.payload], ...state.list]) };
    case MESSAGE_UPDATED:
      const updatedMessage = action.payload;
      const updatedList = state.list.map(message => {
        if (message.messageId === updatedMessage.messageId) {
          message = updatedMessage;
        }
        return message;
      });
      return { ...state, list: updatedList };
    case MESSAGE_DELETED:
      const deletedList = state.list.filter(message => {
        return message.messageId.toString() !== action.payload.toString();
      });
      return { ...state, list: deletedList };
    case CHANNEL_CHANGED:
      return { ...state, memberCount: action.memberCount, title: action.title };
    case TYPING_STATUS_UPDATED:
      return { ...state, typing: action.typing };
    case READ_RECEIPT_UPDATED:
      return { ...state, list: state.list };
    case OWN_MESSAGE_DELETED_FAIL:
      return { ...state };
    case OWN_MESSAGE_DELETED:
      return { ...state, selectedMessages: [] };
    case OWN_MESSAGE_UPDATED:
      const editedMessage = action.edited;
      const updatedList2 = state.list.map(message => {
        if (message.messageId === editedMessage.messageId) {
          message.isEdited = true;
          message.message = action.contents;
        }
        return message;
      });
      return { ...state, selectedMessages: [], list: updatedList2 };
    case OWN_MESSAGE_UPDATED_FAIL:
      return { ...state };
    case MESSAGE_COPY:
      return { ...state, selectedMessages: [] };
    default:
      return state;
  }
};
