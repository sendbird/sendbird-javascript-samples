import 'react-native';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  initGroupChannel,
  groupChannelProgress,
  getGroupChannelList,
  onGroupChannelPress,
  onLeaveChannelPress,
  onHideChannelPress,
  addGroupChannelItem,
  clearSelectedGroupChannel,
  createGroupChannelListHandler
} from '../../src/actions';
import {
  INIT_GROUP_CHANNEL,
  GROUP_CHANNEL_PROGRESS_START,
  GROUP_CHANNEL_PROGRESS_END,
  GROUP_CHANNEL_LIST_SUCCESS,
  GROUP_CHANNEL_LIST_FAIL,
  GET_GROUP_CHANNEL_SUCCESS,
  GET_GROUP_CHANNEL_FAIL,
  CHANNEL_EDIT_SUCCESS,
  CHANNEL_EDIT_FAIL,
  ADD_GROUP_CHANNEL_ITEM,
  CLEAR_SELECTED_GROUP_CHANNEL,
  GROUP_CHANNEL_CHANGED,
  GROUP_CHANNEL_LAST_MESSAGE
} from '../../src/actions/types';
import {
  channel as channelObj,
  mockGetGroupChannel,
  mockRemoveAllChannelHandlers,
  mockChannelHandler,
  mockAddChannelHandler,
  resetChannel,
  restoreAllDefaultMocks
} from '../../__mocks__/mockSendbird';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/groupChannelActions', () => {
  beforeEach(() => {
    resetChannel();
    restoreAllDefaultMocks();
  });
  afterAll(() => {
    resetChannel();
  });
  it('initGroupChannel', () => {
    const store = mockStore({});
    store.dispatch(initGroupChannel());
    const actions = store.getActions();
    const expectedPayload = { type: INIT_GROUP_CHANNEL };
    expect(actions).toEqual([expectedPayload]);
    expect(mockRemoveAllChannelHandlers.mock.calls.length).toEqual(1);
  });

  it('groupChannelProgress', () => {
    const store = mockStore({});
    store.dispatch(groupChannelProgress(true));
    let actions = store.getActions();
    let expectedPayload = {
      type: GROUP_CHANNEL_PROGRESS_START
    };
    expect(actions).toEqual([expectedPayload]);
    store.clearActions();
    store.dispatch(groupChannelProgress(false));
    actions = store.getActions();
    expectedPayload = {
      type: GROUP_CHANNEL_PROGRESS_END
    };
    expect(actions).toEqual([expectedPayload]);
  });

  it('getGroupChannelList success', () => {
    const store = mockStore({});
    const channels = [1, 2, 3];
    const fakeQuery = {
      hasNext: true,
      next: jest.fn(cb => {
        cb(channels, null);
      })
    };
    return store.dispatch(getGroupChannelList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: GROUP_CHANNEL_LIST_SUCCESS,
        list: channels
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getGroupChannelList fail no hasNext', () => {
    const store = mockStore({});
    const channels = [1, 2, 3];
    const fakeQuery = {
      next: jest.fn(cb => {
        cb(channels, null);
      })
    };
    return store.dispatch(getGroupChannelList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: GROUP_CHANNEL_LIST_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getGroupChannelList fail API request', () => {
    const store = mockStore({});
    const channels = [1, 2, 3];
    const fakeQuery = {
      hasNext: true,
      next: jest.fn(cb => {
        cb(null, new Error());
      })
    };
    return store.dispatch(getGroupChannelList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: GROUP_CHANNEL_LIST_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('onGroupChannelPress success', () => {
    const store = mockStore({});
    return store.dispatch(onGroupChannelPress('new url')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: GET_GROUP_CHANNEL_SUCCESS,
        channel: channelObj
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('onOpenChannelPress fail API request', () => {
    const store = mockStore({});
    mockGetGroupChannel.mockImplementation((channelName, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(onGroupChannelPress('new url')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: GET_GROUP_CHANNEL_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('onLeaveChannelPress success', () => {
    const store = mockStore({});
    const url = 'new url';
    const channel = {
      leave: jest.fn(cb => {
        cb({}, null);
      })
    };
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(channel, null);
    });
    return store.dispatch(onLeaveChannelPress(url)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_EDIT_SUCCESS,
        payload: url
      };
      expect(actions).toEqual([expectedPayload]);
      expect(channel.leave.mock.calls.length).toEqual(1);
    });
  });

  it('onLeaveChannelPress fail getGroupChannel API request', () => {
    const store = mockStore({});
    const url = 'new url';
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(onLeaveChannelPress(url)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_EDIT_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('onLeaveChannelPress fail channel leave API request', () => {
    const store = mockStore({});
    const url = 'new url';
    const channel = {
      leave: jest.fn(cb => {
        cb(null, new Error());
      })
    };
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(channel, null);
    });
    return store.dispatch(onLeaveChannelPress(url)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_EDIT_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
      expect(channel.leave.mock.calls.length).toEqual(1);
    });
  });

  it('onHideChannelPress success', () => {
    const store = mockStore({});
    const url = 'new url';
    const channel = {
      hide: jest.fn(cb => {
        cb({}, null);
      })
    };
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(channel, null);
    });
    return store.dispatch(onHideChannelPress(url)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_EDIT_SUCCESS,
        payload: url
      };
      expect(actions).toEqual([expectedPayload]);
      expect(channel.hide.mock.calls.length).toEqual(1);
    });
  });

  it('onHideChannelPress fail getGroupChannel API request', () => {
    const store = mockStore({});
    const url = 'new url';
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(onHideChannelPress(url)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_EDIT_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('onHideChannelPress fail channel leave API request', () => {
    const store = mockStore({});
    const url = 'new url';
    const channel = {
      hide: jest.fn(cb => {
        cb(null, new Error());
      })
    };
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(channel, null);
    });
    return store.dispatch(onHideChannelPress(url)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CHANNEL_EDIT_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
      expect(channel.hide.mock.calls.length).toEqual(1);
    });
  });

  it('addGroupChannelItem', () => {
    const store = mockStore({});
    const channel = { name: 'some name' };
    store.dispatch(addGroupChannelItem(channel));
    const actions = store.getActions();
    const expectedPayload = { type: ADD_GROUP_CHANNEL_ITEM, channel: channel };
    expect(actions).toEqual([expectedPayload]);
  });

  it('clearSelectedGroupChannel', () => {
    const store = mockStore({});
    store.dispatch(clearSelectedGroupChannel());
    const actions = store.getActions();
    const expectedPayload = { type: CLEAR_SELECTED_GROUP_CHANNEL };
    expect(actions).toEqual([expectedPayload]);
  });

  it('createGroupChannelListHandler', () => {
    const store = mockStore({});
    const channel = { name: 'some name' };
    store.dispatch(createGroupChannelListHandler());
    expect(mockChannelHandler.mock.calls.length).toEqual(1);
    expect(mockChannelHandler.mock.instances[0].hasOwnProperty('onChannelChanged')).toBeTruthy();
    expect(mockAddChannelHandler.mock.calls.length).toEqual(1);
    expect(mockAddChannelHandler.mock.calls[0][0]).toEqual('GROUP_CHANNEL_LIST_HANDLER');
    mockChannelHandler.mock.instances[0].onChannelChanged(channel);
    const actions = store.getActions();
    const expectedPayload = {
      type: GROUP_CHANNEL_CHANGED,
      channel
    };
    expect(actions).toEqual([expectedPayload]);
  });
});
