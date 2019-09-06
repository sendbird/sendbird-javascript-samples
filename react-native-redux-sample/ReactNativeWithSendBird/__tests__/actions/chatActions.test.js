import 'react-native';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  initChatScreen,
  getChannelTitle,
  createChatHandler,
  getPrevMessageList,
  onSendButtonPress,
  onUserBlockPress,
  onFileButtonPress,
  typingStart,
  typingEnd,
  channelExit,
  onMessageDelete,
  onUserMessageCopy,
  onUserUpdateMessage,
  onUserMessagePress,
  clearMessageSelection
} from '../../src/actions';
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
  OWN_MESSAGE_DELETED,
  OWN_MESSAGE_DELETED_FAIL,
  OWN_MESSAGE_UPDATED,
  OWN_MESSAGE_UPDATED_FAIL,
  MESSAGE_COPY,
  USER_MESSAGE_SELECTION_CLEAR
} from '../../src/actions/types';
import {
  mockRemoveAllChannelHandlers,
  mockGetOpenChannel,
  mockGetGroupChannel,
  resetChannel,
  restoreAllDefaultMocks,
  mockChannelHandler,
  mockAddChannelHandler,
  mockBlockUserWithUserId,
  mockRemoveChannelHandler
} from '../../__mocks__/mockSendbird';
import { sbGetChannelTitle } from '../../src/sendbirdActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/chatActions', () => {
  beforeEach(() => {
    resetChannel();
    restoreAllDefaultMocks();
  });
  afterAll(() => {
    resetChannel();
  });
  it('initMenu', () => {
    const store = mockStore({});
    store.dispatch(initChatScreen());
    const actions = store.getActions();
    const expectedPayload = { type: INIT_CHAT_SCREEN };
    expect(actions).toEqual([expectedPayload]);
    expect(mockRemoveAllChannelHandlers.mock.calls.length).toEqual(1);
  });

  it('getChannelTitle openChannel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      isOpenChannel: () => {
        return true;
      },
      participantCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(getChannelTitle(channelUrl, true)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_TITLE_CHANGED,
        title: sbGetChannelTitle(channel),
        memberCount: channel.participantCount
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getChannelTitle openChannel long participant list', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      isOpenChannel: () => {
        return true;
      },
      participantCount: 3,
      members: [
        { nickname: 'first' },
        { nickname: 'second' },
        { nickname: 'third' },
        { nickname: 'fourth' },
        { nickname: 'fifth' }
      ]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(getChannelTitle(channelUrl, true)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_TITLE_CHANGED,
        title: sbGetChannelTitle(channel),
        memberCount: channel.participantCount
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getChannelTitle openChannel fail getOpenChannel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(getChannelTitle(channelUrl, true)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_TITLE_CHANGED_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getChannelTitle openChannel fail getOpenChannel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(getChannelTitle(channelUrl, true)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_TITLE_CHANGED_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getChannelTitle groupChannel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      isOpenChannel: () => {
        return false;
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(getChannelTitle(channelUrl, false)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_TITLE_CHANGED,
        title: sbGetChannelTitle(channel),
        memberCount: channel.memberCount
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getChannelTitle groupChannel long participant list', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      isOpenChannel: () => {
        return false;
      },
      memberCount: 3,
      members: [
        { nickname: 'first' },
        { nickname: 'second' },
        { nickname: 'third' },
        { nickname: 'fourth' },
        { nickname: 'fifth' }
      ]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(getChannelTitle(channelUrl, false)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_TITLE_CHANGED,
        title: sbGetChannelTitle(channel),
        memberCount: channel.memberCount
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getChannelTitle groupChannel fail getGroupChannel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(getChannelTitle(channelUrl, false)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_TITLE_CHANGED_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createChatHandler openChannel success', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      enter: jest.fn(cb => {
        cb(this, null);
      }),
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      participantCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(createChatHandler(channelUrl, true)).then(() => {
      expect(channel.enter.mock.calls.length).toBe(1);
      let actions = store.getActions();
      let expectedPayload = {
        type: CREATE_CHAT_HANDLER_SUCCESS
      };
      expect(actions).toEqual([expectedPayload]);
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onUserEntered')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onUserExited')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageReceived')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageUpdated')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageDeleted')).toBeTruthy();
      expect(mockAddChannelHandler.mock.calls.length).toEqual(1);
      expect(mockAddChannelHandler.mock.calls[0][0]).toEqual(channelUrl);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onUserEntered(channel);
      actions = store.getActions();
      expectedPayload = {
        type: CHANNEL_CHANGED,
        memberCount: channel.participantCount,
        title: channel.title
      };
      expect(actions).toEqual([expectedPayload]);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onUserExited(channel);
      actions = store.getActions();
      expectedPayload = {
        type: CHANNEL_CHANGED,
        memberCount: channel.participantCount,
        title: channel.title
      };
      expect(actions).toEqual([expectedPayload]);
      store.clearActions();
      const message = { text: 'test', id: 'some id' };
      mockChannelHandler.mock.instances[0].onMessageReceived(channel, message);
      actions = store.getActions();
      expectedPayload = {
        type: MESSAGE_RECEIVED,
        payload: message
      };
      expect(actions).toEqual([expectedPayload]);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onMessageUpdated(channel, message);
      actions = store.getActions();
      expectedPayload = {
        type: MESSAGE_UPDATED,
        payload: message
      };
      expect(actions).toEqual([expectedPayload]);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onMessageDeleted(channel, message.id);
      actions = store.getActions();
      expectedPayload = {
        type: MESSAGE_DELETED,
        payload: message.id
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createChatHandler openChannel event not dispatched on different channelUrl', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      enter: jest.fn(cb => {
        cb(this, null);
      }),
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      participantCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(createChatHandler(channelUrl, true)).then(() => {
      expect(channel.enter.mock.calls.length).toBe(1);
      let actions = store.getActions();
      let expectedPayload = {
        type: CREATE_CHAT_HANDLER_SUCCESS
      };
      expect(actions).toEqual([expectedPayload]);
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onUserEntered')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onUserExited')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageReceived')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageUpdated')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageDeleted')).toBeTruthy();
      expect(mockAddChannelHandler.mock.calls.length).toEqual(1);
      expect(mockAddChannelHandler.mock.calls[0][0]).toEqual(channelUrl);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onUserEntered({ url: 'different' });
      actions = store.getActions();
      expect(actions.length).toBe(0);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onUserExited({ url: 'different' });
      actions = store.getActions();
      expect(actions.length).toBe(0);
      store.clearActions();
      const message = { text: 'test', id: 'some id' };
      mockChannelHandler.mock.instances[0].onMessageReceived({ url: 'different' }, message);
      actions = store.getActions();
      expect(actions.length).toBe(0);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onMessageUpdated({ url: 'different' }, message);
      actions = store.getActions();
      expect(actions.length).toBe(0);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onMessageDeleted({ url: 'different' }, message.id);
      actions = store.getActions();
      expect(actions.length).toBe(0);
    });
  });

  it('createChatHandler openChannel fail getOpenChannel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(createChatHandler(channelUrl, false)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CREATE_CHAT_HANDLER_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createChatHandler openChannel fail enter channel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      enter: jest.fn(cb => {
        cb(null, new Error());
      }),
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      participantCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(createChatHandler(channelUrl, true)).then(() => {
      expect(channel.enter.mock.calls.length).toBe(1);
      let actions = store.getActions();
      let expectedPayload = {
        type: CREATE_CHAT_HANDLER_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createChatHandler groupChannel success', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return true;
      },
      isOpenChannel: () => {
        return false;
      },
      isTyping: () => {
        return false;
      },
      markAsRead: jest.fn(),
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(createChatHandler(channelUrl, false)).then(() => {
      let actions = store.getActions();
      let expectedPayload = {
        type: CREATE_CHAT_HANDLER_SUCCESS
      };
      expect(actions).toEqual([expectedPayload]);
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onUserJoined')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onUserLeft')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onReadReceiptUpdated')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onTypingStatusUpdated')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageReceived')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageUpdated')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageDeleted')).toBeTruthy();
      expect(mockAddChannelHandler.mock.calls.length).toEqual(1);
      expect(mockAddChannelHandler.mock.calls[0][0]).toEqual(channelUrl);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onUserJoined(channel);
      actions = store.getActions();
      expectedPayload = {
        type: CHANNEL_TITLE_CHANGED,
        memberCount: channel.memberCount,
        title: sbGetChannelTitle(channel)
      };
      expect(actions).toEqual([expectedPayload]);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onUserLeft(channel);
      actions = store.getActions();
      expectedPayload = {
        type: CHANNEL_TITLE_CHANGED,
        memberCount: channel.memberCount,
        title: sbGetChannelTitle(channel)
      };
      expect(actions).toEqual([expectedPayload]);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onReadReceiptUpdated(channel);
      actions = store.getActions();
      expectedPayload = {
        type: READ_RECEIPT_UPDATED
      };
      expect(actions).toEqual([expectedPayload]);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onTypingStatusUpdated(channel);
      actions = store.getActions();
      expectedPayload = {
        type: TYPING_STATUS_UPDATED,
        typing: ''
      };
      expect(actions).toEqual([expectedPayload]);
      store.clearActions();
      const message = { text: 'test', id: 'some id' };
      mockChannelHandler.mock.instances[0].onMessageReceived(channel, message);
      expect(channel.markAsRead.mock.calls.length).toBe(1);
      actions = store.getActions();
      expectedPayload = {
        type: MESSAGE_RECEIVED,
        payload: message
      };
      expect(actions).toEqual([expectedPayload]);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onMessageUpdated(channel, message);
      actions = store.getActions();
      expectedPayload = {
        type: MESSAGE_UPDATED,
        payload: message
      };
      expect(actions).toEqual([expectedPayload]);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onMessageDeleted(channel, message.id);
      actions = store.getActions();
      expectedPayload = {
        type: MESSAGE_DELETED,
        payload: message.id
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createChatHandler groupChannel success typing user', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return true;
      },
      isOpenChannel: () => {
        return false;
      },
      isTyping: () => {
        return true;
      },
      getTypingMembers: () => {
        return [{ nickname: 'nick' }];
      },
      markAsRead: jest.fn(),
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(createChatHandler(channelUrl, false)).then(() => {
      let actions = store.getActions();
      let expectedPayload = {
        type: CREATE_CHAT_HANDLER_SUCCESS
      };
      expect(actions).toEqual([expectedPayload]);
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onTypingStatusUpdated')).toBeTruthy();
      expect(mockAddChannelHandler.mock.calls.length).toEqual(1);
      expect(mockAddChannelHandler.mock.calls[0][0]).toEqual(channelUrl);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onTypingStatusUpdated(channel);
      actions = store.getActions();
      expectedPayload = {
        type: TYPING_STATUS_UPDATED,
        typing: 'nick is typing...'
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createChatHandler groupChannel success typing users', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return true;
      },
      isOpenChannel: () => {
        return false;
      },
      isTyping: () => {
        return true;
      },
      getTypingMembers: () => {
        return [{ nickname: 'nick' }, { nickname: 'rick' }];
      },
      markAsRead: jest.fn(),
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(createChatHandler(channelUrl, false)).then(() => {
      let actions = store.getActions();
      let expectedPayload = {
        type: CREATE_CHAT_HANDLER_SUCCESS
      };
      expect(actions).toEqual([expectedPayload]);
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onTypingStatusUpdated')).toBeTruthy();
      expect(mockAddChannelHandler.mock.calls.length).toEqual(1);
      expect(mockAddChannelHandler.mock.calls[0][0]).toEqual(channelUrl);
      store.clearActions();
      mockChannelHandler.mock.instances[0].onTypingStatusUpdated(channel);
      actions = store.getActions();
      expectedPayload = {
        type: TYPING_STATUS_UPDATED,
        typing: 'several member are typing...'
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createChatHandler groupChannel events not dispatched on different channelUrl', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return true;
      },
      isOpenChannel: () => {
        return false;
      },
      isTyping: () => {
        return false;
      },
      markAsRead: jest.fn(),
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(createChatHandler(channelUrl, false)).then(() => {
      let actions = store.getActions();
      let expectedPayload = {
        type: CREATE_CHAT_HANDLER_SUCCESS
      };
      expect(actions).toEqual([expectedPayload]);
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onUserJoined')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onUserLeft')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onReadReceiptUpdated')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onTypingStatusUpdated')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageReceived')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageUpdated')).toBeTruthy();
      expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onMessageDeleted')).toBeTruthy();
      expect(mockAddChannelHandler.mock.calls.length).toEqual(1);
      expect(mockAddChannelHandler.mock.calls[0][0]).toEqual(channelUrl);

      store.clearActions();
      mockChannelHandler.mock.instances[0].onUserJoined({ url: 'different' });
      actions = store.getActions();
      expect(actions.length).toBe(0);

      store.clearActions();
      mockChannelHandler.mock.instances[0].onUserLeft({ url: 'different' });
      actions = store.getActions();
      expect(actions.length).toBe(0);

      store.clearActions();
      mockChannelHandler.mock.instances[0].onReadReceiptUpdated({ url: 'different' });
      actions = store.getActions();
      expect(actions.length).toBe(0);

      store.clearActions();
      mockChannelHandler.mock.instances[0].onTypingStatusUpdated({ url: 'different' });
      actions = store.getActions();
      expect(actions.length).toBe(0);

      store.clearActions();
      mockChannelHandler.mock.instances[0].onMessageReceived({ url: 'different' });
      actions = store.getActions();
      expect(actions.length).toBe(0);

      store.clearActions();
      mockChannelHandler.mock.instances[0].onMessageUpdated({ url: 'different' });
      actions = store.getActions();
      expect(actions.length).toBe(0);

      store.clearActions();
      mockChannelHandler.mock.instances[0].onMessageDeleted({ url: 'different' });
      actions = store.getActions();
      expect(actions.length).toBe(0);
    });
  });

  it('createChatHandler groupChannel fail getGroupChannel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(createChatHandler(channelUrl, false)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CREATE_CHAT_HANDLER_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getPrevMessageList success', () => {
    const store = mockStore({});
    const messages = [{ text: 'text' }];
    const fakeQuery = {
      hasMore: true,
      load: jest.fn((limit, reverse, cb) => {
        expect(limit).toBe(30);
        expect(reverse).toBe(true);
        cb(messages, null);
      })
    };
    return store.dispatch(getPrevMessageList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: MESSAGE_LIST_SUCCESS,
        list: messages
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getPrevMessageList no hasMore', () => {
    const store = mockStore({});
    const messages = [{ text: 'text' }];
    const fakeQuery = {
      load: jest.fn((limit, reverse, cb) => {
        expect(limit).toBe(30);
        expect(reverse).toBe(true);
        cb(messages, null);
      })
    };
    return store.dispatch(getPrevMessageList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: MESSAGE_LIST_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getPrevMessageList fail API request', () => {
    const store = mockStore({});
    const fakeQuery = {
      load: jest.fn((limit, reverse, cb) => {
        expect(limit).toBe(30);
        expect(reverse).toBe(true);
        cb(null, new Error());
      })
    };
    return store.dispatch(getPrevMessageList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: MESSAGE_LIST_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('onSendButtonPress openChannel success', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      sendUserMessage: (textMessage, cb) => {
        expect(textMessage).toBe(message.text);
        cb(message, null);
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onSendButtonPress(channelUrl, true, message.text)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_MESSAGE_SUCCESS,
          message
        },
        {
          type: SEND_MESSAGE_TEMPORARY,
          message
        }
      ];
      expect(actions.sort()).toEqual(expectedPayload.sort());
    });
  });

  it('onSendButtonPress openChannel fail getOpenChannel', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      sendUserMessage: (textMessage, cb) => {
        expect(textMessage).toBe(message.text);
        cb(message, null);
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(onSendButtonPress(channelUrl, true, message.text)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_MESSAGE_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onSendButtonPress openChannel fail channel sendUserMessage', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      sendUserMessage: (textMessage, cb) => {
        expect(textMessage).toBe(message.text);
        cb(null, new Error());
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onSendButtonPress(channelUrl, true, message.text)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_MESSAGE_FAIL
        },
        {
          type: SEND_MESSAGE_TEMPORARY,
          message
        }
      ];
      expect(actions.sort()).toEqual(expectedPayload.sort());
    });
  });

  it('onSendButtonPress groupChannel success', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return true;
      },
      isOpenChannel: () => {
        return false;
      },
      endTyping: jest.fn(),
      sendUserMessage: (textMessage, cb) => {
        expect(textMessage).toBe(message.text);
        cb(message, null);
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onSendButtonPress(channelUrl, false, message.text)).then(() => {
      const actions = store.getActions();
      expect(channel.endTyping.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: SEND_MESSAGE_SUCCESS,
          message
        },
        {
          type: SEND_MESSAGE_TEMPORARY,
          message
        }
      ];
      expect(actions.sort()).toEqual(expectedPayload.sort());
    });
  });

  it('onSendButtonPress groupChannel fail getGroupChannel', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return true;
      },
      isOpenChannel: () => {
        return false;
      },
      sendUserMessage: (textMessage, cb) => {
        expect(textMessage).toBe(message.text);
        cb(message, null);
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(onSendButtonPress(channelUrl, false, message.text)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_MESSAGE_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onSendButtonPress groupChannel fail channel sendUserMessage', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return true;
      },
      isOpenChannel: () => {
        return false;
      },
      endTyping: jest.fn(),
      sendUserMessage: (textMessage, cb) => {
        expect(textMessage).toBe(message.text);
        cb(null, new Error());
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onSendButtonPress(channelUrl, false, message.text)).then(() => {
      const actions = store.getActions();
      expect(channel.endTyping.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: SEND_MESSAGE_FAIL
        },
        {
          type: SEND_MESSAGE_TEMPORARY,
          message
        }
      ];
      expect(actions.sort()).toEqual(expectedPayload.sort());
    });
  });

  it('onUserBlockPress success', () => {
    const store = mockStore({});
    const toBlockUserId = 'userId';
    const user = { userId: toBlockUserId };
    mockBlockUserWithUserId.mockImplementation((blockUserId, cb) => {
      expect(blockUserId).toBe(toBlockUserId);
      cb(user, null);
    });
    return store.dispatch(onUserBlockPress(toBlockUserId)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: USER_BLOCK_SUCCESS
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onUserBlockPress fail', () => {
    const store = mockStore({});
    const toBlockUserId = 'userId';
    const user = { userId: toBlockUserId };
    mockBlockUserWithUserId.mockImplementation((blockUserId, cb) => {
      expect(blockUserId).toBe(toBlockUserId);
      cb(null, new Error());
    });
    return store.dispatch(onUserBlockPress(toBlockUserId)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: USER_BLOCK_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onFileButtonPress openChannel success', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const file = { data: 'test data' };
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      sendFileMessage: (receivedFile, data, customType, thumbSizeList, cb) => {
        expect(receivedFile).toEqual(file);
        expect(data).toEqual('');
        expect(customType).toEqual('');
        expect(thumbSizeList).toEqual([{ maxWidth: 160, maxHeight: 160 }]);
        cb(message, null);
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onFileButtonPress(channelUrl, true, file)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_MESSAGE_SUCCESS,
          message
        }
      ];
      expect(actions.sort()).toEqual(expectedPayload.sort());
    });
  });

  it('onFileButtonPress openChannel fail getOpenChannel', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      sendUserMessage: (textMessage, cb) => {
        expect(textMessage).toBe(message.text);
        cb(message, null);
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(onFileButtonPress(channelUrl, true, message.text)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_MESSAGE_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onFileButtonPress openChannel fail channel sendFileMessage', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const file = { data: 'test data' };
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      sendFileMessage: (receivedFile, data, customType, thumbSizeList, cb) => {
        expect(receivedFile).toEqual(file);
        expect(data).toEqual('');
        expect(customType).toEqual('');
        expect(thumbSizeList).toEqual([{ maxWidth: 160, maxHeight: 160 }]);
        cb(null, new Error());
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetOpenChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onFileButtonPress(channelUrl, true, file)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_MESSAGE_FAIL
        }
      ];
      expect(actions.sort()).toEqual(expectedPayload.sort());
    });
  });

  it('onFileButtonPress groupChannel success', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const file = { data: 'test data' };
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return true;
      },
      isOpenChannel: () => {
        return false;
      },
      sendFileMessage: (receivedFile, data, customType, thumbSizeList, cb) => {
        expect(receivedFile).toEqual(file);
        expect(data).toEqual('');
        expect(customType).toEqual('');
        expect(thumbSizeList).toEqual([{ maxWidth: 160, maxHeight: 160 }]);
        cb(message, null);
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onFileButtonPress(channelUrl, false, file)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_MESSAGE_SUCCESS,
          message
        }
      ];
      expect(actions.sort()).toEqual(expectedPayload.sort());
    });
  });

  it('onFileButtonPress groupChannel fail getGroupChannel', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      sendUserMessage: (textMessage, cb) => {
        expect(textMessage).toBe(message.text);
        cb(message, null);
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(onFileButtonPress(channelUrl, false, message.text)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_MESSAGE_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onFileButtonPress groupChannel fail channel sendFileMessage', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const file = { data: 'test data' };
    const channel = {
      name: 'name',
      title: 'name',
      url: channelUrl,
      isGroupChannel: () => {
        return false;
      },
      isOpenChannel: () => {
        return true;
      },
      sendFileMessage: (receivedFile, data, customType, thumbSizeList, cb) => {
        expect(receivedFile).toEqual(file);
        expect(data).toEqual('');
        expect(customType).toEqual('');
        expect(thumbSizeList).toEqual([{ maxWidth: 160, maxHeight: 160 }]);
        cb(null, new Error());
        return message; // temporary
      },
      memberCount: 3,
      members: [{ nickname: 'first' }, { nickname: 'second' }, { nickname: 'third' }]
    };
    mockGetGroupChannel.mockImplementation((channelUrlCalled, cb) => {
      expect(channelUrlCalled).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onFileButtonPress(channelUrl, false, file)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_MESSAGE_FAIL
        }
      ];
      expect(actions.sort()).toEqual(expectedPayload.sort());
    });
  });

  it('typingStart success', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      startTyping: jest.fn()
    };
    mockGetGroupChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(typingStart(channelUrl)).then(() => {
      const actions = store.getActions();
      expect(channel.startTyping.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: SEND_TYPING_START_SUCCESS
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('typingStart fail getGroupChannel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      startTyping: jest.fn()
    };
    mockGetGroupChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(typingStart(channelUrl)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_TYPING_START_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('typingEnd success', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      endTyping: jest.fn()
    };
    mockGetGroupChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(typingEnd(channelUrl)).then(() => {
      const actions = store.getActions();
      expect(channel.endTyping.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: SEND_TYPING_END_SUCCESS
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('typingEnd fail getGroupChannel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      startTyping: jest.fn()
    };
    mockGetGroupChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(typingEnd(channelUrl)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: SEND_TYPING_END_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('channelExit openChannel success', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      exit: jest.fn(cb => {
        cb(true, null);
      })
    };
    mockGetOpenChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(channelExit(channelUrl, true)).then(() => {
      const actions = store.getActions();
      expect(channel.exit.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: CHANNEL_EXIT_SUCCESS
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('channelExit openChannel fail getOpenChannel', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      exit: jest.fn(cb => {
        cb(true, null);
      })
    };
    mockGetOpenChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(channelExit(channelUrl, true)).then(() => {
      const actions = store.getActions();
      const expectedPayload = [
        {
          type: CHANNEL_EXIT_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('channelExit openChannel fail exit API', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    const channel = {
      exit: jest.fn(cb => {
        cb(null, new Error());
      })
    };
    mockGetOpenChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(channelExit(channelUrl, true)).then(() => {
      const actions = store.getActions();
      expect(channel.exit.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: CHANNEL_EXIT_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('channelExit groupChannel success', () => {
    const store = mockStore({});
    const channelUrl = 'url';
    return store.dispatch(channelExit(channelUrl, false)).then(() => {
      const actions = store.getActions();
      expect(mockRemoveChannelHandler.mock.calls.length).toBe(1);
      expect(mockRemoveChannelHandler.mock.calls[0][0]).toBe(channelUrl);
      const expectedPayload = [
        {
          type: CHANNEL_EXIT_SUCCESS
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onUserMessagePress success', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    store.dispatch(onUserMessagePress(message));
    const actions = store.getActions();
    const expectedPayload = [
      {
        type: USER_MESSAGE_PRESS,
        message
      }
    ];
    expect(actions).toEqual(expectedPayload);
  });

  it('onMessageDelete openChannel success', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      deleteMessage: jest.fn((messageActual, cb) => {
        expect(messageActual).toEqual(message);
        cb(messageActual, null);
      })
    };
    mockGetOpenChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onMessageDelete(channelUrl, true, message)).then(() => {
      const actions = store.getActions();
      expect(mockGetOpenChannel.mock.calls.length).toBe(1);
      expect(channel.deleteMessage.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_DELETED
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onMessageDelete fail getOpenChannel success', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    mockGetOpenChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(onMessageDelete(channelUrl, true, message)).then(() => {
      const actions = store.getActions();
      expect(mockGetOpenChannel.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_DELETED_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onMessageDelete openChannel fail', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      deleteMessage: jest.fn((messageActual, cb) => {
        expect(messageActual).toEqual(message);
        cb(null, new Error());
      })
    };
    mockGetOpenChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onMessageDelete(channelUrl, true, message)).then(() => {
      const actions = store.getActions();
      expect(mockGetOpenChannel.mock.calls.length).toBe(1);
      expect(channel.deleteMessage.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_DELETED_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onMessageDelete groupChannel success', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      deleteMessage: jest.fn((messageActual, cb) => {
        expect(messageActual).toEqual(message);
        cb(messageActual, null);
      })
    };
    mockGetGroupChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onMessageDelete(channelUrl, false, message)).then(() => {
      const actions = store.getActions();
      expect(mockGetGroupChannel.mock.calls.length).toBe(1);
      expect(channel.deleteMessage.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_DELETED
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onMessageDelete fail getGroupChannel', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    mockGetGroupChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(onMessageDelete(channelUrl, false, message)).then(() => {
      const actions = store.getActions();
      expect(mockGetGroupChannel.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_DELETED_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onMessageDelete groupChannel fail', () => {
    const store = mockStore({});
    const message = { text: 'text' };
    const channelUrl = 'url';
    const channel = {
      deleteMessage: jest.fn((messageActual, cb) => {
        expect(messageActual).toEqual(message);
        cb(null, new Error());
      })
    };
    mockGetGroupChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onMessageDelete(channelUrl, false, message)).then(() => {
      const actions = store.getActions();
      expect(mockGetGroupChannel.mock.calls.length).toBe(1);
      expect(channel.deleteMessage.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_DELETED_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onUserUpdateMessage openChannel success', () => {
    const store = mockStore({});
    const message = {
      text: 'text',
      messageId: 123
    };
    const newText = 'new text';
    const channelUrl = 'url';
    const channel = {
      updateUserMessage: jest.fn((messageId, contents, data, customType, cb) => {
        expect(contents).toEqual(newText);
        expect(messageId).toEqual(message.messageId);
        message.text = contents;
        expect(data).toEqual(null);
        expect(customType).toEqual(null);
        cb(message, null);
      })
    };
    mockGetOpenChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onUserUpdateMessage(channelUrl, true, message, newText)).then(() => {
      const actions = store.getActions();
      expect(mockGetOpenChannel.mock.calls.length).toBe(1);
      expect(channel.updateUserMessage.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_UPDATED,
          edited: message,
          contents: newText
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onUserUpdateMessage fail getOpenChannel', () => {
    const store = mockStore({});
    const message = {
      text: 'text',
      messageId: 123
    };
    const newText = 'new text';
    const channelUrl = 'url';
    mockGetOpenChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(onUserUpdateMessage(channelUrl, true, message, newText)).then(() => {
      const actions = store.getActions();
      expect(mockGetOpenChannel.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_UPDATED_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onUserUpdateMessage openChannel fail', () => {
    const store = mockStore({});
    const message = {
      text: 'text',
      messageId: 123
    };
    const newText = 'new text';
    const channelUrl = 'url';
    const channel = {
      updateUserMessage: jest.fn((messageId, contents, data, customType, cb) => {
        expect(contents).toEqual(newText);
        expect(messageId).toEqual(message.messageId);
        expect(data).toEqual(null);
        expect(customType).toEqual(null);
        cb(null, new Error());
      })
    };
    mockGetOpenChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onUserUpdateMessage(channelUrl, true, message, newText)).then(() => {
      const actions = store.getActions();
      expect(mockGetOpenChannel.mock.calls.length).toBe(1);
      expect(channel.updateUserMessage.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_UPDATED_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onUserUpdateMessage groupChannel success', () => {
    const store = mockStore({});
    const message = {
      text: 'text',
      messageId: 123
    };
    const newText = 'new text';
    const channelUrl = 'url';
    const channel = {
      updateUserMessage: jest.fn((messageId, contents, data, customType, cb) => {
        expect(contents).toEqual(newText);
        expect(messageId).toEqual(message.messageId);
        message.text = contents;
        expect(data).toEqual(null);
        expect(customType).toEqual(null);
        cb(message, null);
      })
    };
    mockGetGroupChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onUserUpdateMessage(channelUrl, false, message, newText)).then(() => {
      const actions = store.getActions();
      expect(mockGetGroupChannel.mock.calls.length).toBe(1);
      expect(channel.updateUserMessage.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_UPDATED,
          edited: message,
          contents: newText
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onUserUpdateMessage fail getGroupChannel', () => {
    const store = mockStore({});
    const message = {
      text: 'text',
      messageId: 123
    };
    const newText = 'new text';
    const channelUrl = 'url';
    mockGetGroupChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(null, new Error());
    });
    return store.dispatch(onUserUpdateMessage(channelUrl, false, message, newText)).then(() => {
      const actions = store.getActions();
      expect(mockGetGroupChannel.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_UPDATED_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onUserUpdateMessage groupChannel fail', () => {
    const store = mockStore({});
    const message = {
      text: 'text',
      messageId: 123
    };
    const newText = 'new text';
    const channelUrl = 'url';
    const channel = {
      updateUserMessage: jest.fn((messageId, contents, data, customType, cb) => {
        expect(contents).toEqual(newText);
        expect(messageId).toEqual(message.messageId);
        expect(data).toEqual(null);
        expect(customType).toEqual(null);
        cb(null, new Error());
      })
    };
    mockGetGroupChannel.mockImplementation((url, cb) => {
      expect(url).toBe(channelUrl);
      cb(channel, null);
    });
    return store.dispatch(onUserUpdateMessage(channelUrl, false, message, newText)).then(() => {
      const actions = store.getActions();
      expect(mockGetGroupChannel.mock.calls.length).toBe(1);
      expect(channel.updateUserMessage.mock.calls.length).toBe(1);
      const expectedPayload = [
        {
          type: OWN_MESSAGE_UPDATED_FAIL
        }
      ];
      expect(actions).toEqual(expectedPayload);
    });
  });

  it('onUserMessageCopy success', () => {
    const store = mockStore({});
    store.dispatch(onUserMessageCopy());
    const actions = store.getActions();
    const expectedPayload = [
      {
        type: MESSAGE_COPY
      }
    ];
    expect(actions).toEqual(expectedPayload);
  });

  it('clearMessageSelection success', () => {
    const store = mockStore({});
    store.dispatch(clearMessageSelection());
    const actions = store.getActions();
    const expectedPayload = [
      {
        type: USER_MESSAGE_SELECTION_CLEAR
      }
    ];
    expect(actions).toEqual(expectedPayload);
  });
});
