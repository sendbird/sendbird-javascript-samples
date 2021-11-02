import { chatReducer } from '../../src/reducers';
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
  MESSAGE_RECEIVED,
  MESSAGE_UPDATED,
  MESSAGE_DELETED,
  CHANNEL_CHANGED,
  TYPING_STATUS_UPDATED,
  READ_RECEIPT_UPDATED,
  USER_MESSAGE_PRESS,
  USER_MESSAGE_SELECTION_CLEAR,
  OWN_MESSAGE_DELETED_FAIL,
  OWN_MESSAGE_DELETED,
  OWN_MESSAGE_UPDATED,
  OWN_MESSAGE_UPDATED_FAIL,
  MESSAGE_COPY
} from '../../src/actions/types';

describe('reducers/chatReducer', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });

  test('INIT_CHAT_SCREEN', () => {
    const action = { type: INIT_CHAT_SCREEN };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });

  test('CREATE_CHAT_HANDLER_SUCCESS', () => {
    const action = { type: CREATE_CHAT_HANDLER_SUCCESS };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });

  test('CREATE_CHAT_HANDLER_FAIL', () => {
    const action = { type: CREATE_CHAT_HANDLER_FAIL };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('CHANNEL_TITLE_CHANGED', () => {
    const action = { type: CHANNEL_TITLE_CHANGED, title: 'title', memberCount: 34 };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('CHANNEL_TITLE_CHANGED_FAIL', () => {
    const action = { type: CHANNEL_TITLE_CHANGED_FAIL };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('MESSAGE_LIST_SUCCESS', () => {
    const action = { type: MESSAGE_LIST_SUCCESS, list: ['1', '2'] };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('MESSAGE_LIST_FAIL', () => {
    const action = { type: MESSAGE_LIST_FAIL };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('SEND_MESSAGE_TEMPORARY', () => {
    const action = { type: SEND_MESSAGE_TEMPORARY, message: 'message' };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('SEND_MESSAGE_SUCCESS present message', () => {
    const action = { type: SEND_MESSAGE_SUCCESS, message: { reqId: 123 } };
    const state = {
      list: [{ reqId: 123 }, { reqId: 456 }],
      memberCount: 0,
      title: '',
      exit: false,
      typing: ''
    };
    expect(chatReducer(state, action)).toMatchSnapshot();
  });
  test('SEND_MESSAGE_SUCCESS no present message', () => {
    const action = { type: SEND_MESSAGE_SUCCESS, message: { reqId: 123 } };
    const state = {
      list: [{ reqId: 789 }, { reqId: 456 }],
      memberCount: 0,
      title: '',
      exit: false,
      typing: ''
    };
    expect(chatReducer(state, action)).toMatchSnapshot();
  });
  test('SEND_MESSAGE_FAIL', () => {
    const action = { type: SEND_MESSAGE_FAIL };
    const state = {
      list: [{ reqId: 789 }, { reqId: 456 }],
      memberCount: 0,
      title: '',
      exit: false,
      typing: ''
    };
    expect(chatReducer(state, action)).toMatchSnapshot();
  });
  test('CHANNEL_EXIT_SUCCESS', () => {
    const action = { type: CHANNEL_EXIT_SUCCESS };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('CHANNEL_EXIT_FAIL', () => {
    const action = { type: CHANNEL_EXIT_FAIL };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('MESSAGE_RECEIVED', () => {
    const action = { type: MESSAGE_RECEIVED, payload: { reqId: 123, messageId: 1 } };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('MESSAGE_UPDATED', () => {
    const action = { type: MESSAGE_UPDATED, payload: { messageId: 1, reqId: 123 } };
    const state = {
      list: [{ messageId: 1 }, { messageId: 2 }],
      memberCount: 0,
      title: '',
      exit: false,
      typing: ''
    };
    expect(chatReducer(state, action)).toMatchSnapshot();
  });
  test('MESSAGE_DELETED', () => {
    const action = { type: MESSAGE_DELETED, payload: 1 };
    const state = {
      list: [{ messageId: 1 }, { messageId: 2 }],
      memberCount: 0,
      title: '',
      exit: false,
      typing: ''
    };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('CHANNEL_CHANGED', () => {
    const action = { type: CHANNEL_CHANGED, memberCount: 3, title: 'title' };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('TYPING_STATUS_UPDATED', () => {
    const action = { type: TYPING_STATUS_UPDATED, typing: true };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('READ_RECEIPT_UPDATED', () => {
    const action = { type: READ_RECEIPT_UPDATED };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('USER_MESSAGE_PRESS', () => {
    const action = { type: USER_MESSAGE_PRESS, message: { messageId: 1 } };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('USER_MESSAGE_SELECTION_CLEAR', () => {
    const action = { type: USER_MESSAGE_SELECTION_CLEAR };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('OWN_MESSAGE_DELETED_FAIL', () => {
    const action = { type: OWN_MESSAGE_DELETED_FAIL };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('OWN_MESSAGE_DELETED', () => {
    const action = { type: OWN_MESSAGE_DELETED };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('OWN_MESSAGE_UPDATED', () => {
    const action = { type: OWN_MESSAGE_UPDATED, edited: { messageId: 1 }, contents: 'new text' };
    const state = {
      list: [
        {
          messageId: 1,
          message: 'text'
        },
        {
          messageId: 2,
          message: 'text 2'
        }
      ]
    };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('OWN_MESSAGE_UPDATED_FAIL', () => {
    const action = { type: OWN_MESSAGE_UPDATED_FAIL };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
  test('MESSAGE_COPY', () => {
    const action = { type: MESSAGE_COPY };
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
});
