import 'react-native';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  channel as channelObj,
  resetChannel,
  mockGetOpenChannel,
  restoreAllDefaultMocks
} from '../../__mocks__/mockSendbird';
import {
  initOpenChannel,
  getOpenChannelList,
  onOpenChannelPress,
  addOpenChannelItem,
  clearCreatedOpenChannel,
  clearSeletedOpenChannel,
  openChannelProgress
} from '../../src/actions';
import {
  INIT_OPEN_CHANNEL,
  OPEN_CHANNEL_PROGRESS_START,
  OPEN_CHANNEL_PROGRESS_END,
  OPEN_CHANNEL_LIST_SUCCESS,
  OPEN_CHANNEL_LIST_FAIL,
  GET_OPEN_CHANNEL_SUCCESS,
  GET_OPEN_CHANNEL_FAIL,
  ADD_OPEN_CHANNEL_ITEM,
  CLEAR_ADD_OPEN_CHANNEL,
  CLEAR_SELETED_OPEN_CHANNEL
} from '../../src/actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/openChannelActions', () => {
  beforeEach(() => {
    resetChannel();
    restoreAllDefaultMocks();
  });
  afterAll(() => {
    resetChannel();
  });
  it('initOpenChannel', () => {
    const store = mockStore({});
    store.dispatch(initOpenChannel());
    const actions = store.getActions();
    const expectedPayload = { type: INIT_OPEN_CHANNEL };
    expect(actions).toEqual([expectedPayload]);
  });

  it('getOpenChannelList success', () => {
    const store = mockStore({});
    const channels = [1, 2, 3];
    const fakeQuery = {
      hasNext: true,
      next: jest.fn(cb => {
        cb(channels, null);
      })
    };
    return store.dispatch(getOpenChannelList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: OPEN_CHANNEL_LIST_SUCCESS,
        list: channels
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getOpenChannelList fail no hasNext', () => {
    const store = mockStore({});
    const channels = [1, 2, 3];
    const fakeQuery = {
      next: jest.fn(cb => {
        cb(channels, null);
      })
    };
    return store.dispatch(getOpenChannelList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: OPEN_CHANNEL_LIST_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getOpenChannelList fail API request', () => {
    const store = mockStore({});
    const channels = [1, 2, 3];
    const fakeQuery = {
      hasNext: true,
      next: jest.fn(cb => {
        cb(null, new Error());
      })
    };
    return store.dispatch(getOpenChannelList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: OPEN_CHANNEL_LIST_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('onOpenChannelPress success', () => {
    const store = mockStore({});
    return store.dispatch(onOpenChannelPress('new url')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: GET_OPEN_CHANNEL_SUCCESS,
        channel: channelObj
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('onOpenChannelPress fail API request', () => {
    const store = mockStore({});
    mockGetOpenChannel.mockImplementation((channelName, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(onOpenChannelPress('new url')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: GET_OPEN_CHANNEL_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('addOpenChannelItem', () => {
    const store = mockStore({});
    const channel = { url: 'fake' };
    store.dispatch(addOpenChannelItem(channel));
    const actions = store.getActions();
    const expectedPayload = {
      type: ADD_OPEN_CHANNEL_ITEM,
      channel
    };
    expect(actions).toEqual([expectedPayload]);
  });

  it('clearCreatedOpenChannel', () => {
    const store = mockStore({});
    store.dispatch(clearCreatedOpenChannel());
    const actions = store.getActions();
    const expectedPayload = {
      type: CLEAR_ADD_OPEN_CHANNEL
    };
    expect(actions).toEqual([expectedPayload]);
  });

  it('clearSeletedOpenChannel', () => {
    const store = mockStore({});
    store.dispatch(clearSeletedOpenChannel());
    const actions = store.getActions();
    const expectedPayload = {
      type: CLEAR_SELETED_OPEN_CHANNEL
    };
    expect(actions).toEqual([expectedPayload]);
  });

  it('openChannelProgress', () => {
    const store = mockStore({});
    store.dispatch(openChannelProgress(true));
    let actions = store.getActions();
    let expectedPayload = {
      type: OPEN_CHANNEL_PROGRESS_START
    };
    expect(actions).toEqual([expectedPayload]);
    store.clearActions();
    store.dispatch(openChannelProgress(false));
    actions = store.getActions();
    expectedPayload = {
      type: OPEN_CHANNEL_PROGRESS_END
    };
    expect(actions).toEqual([expectedPayload]);
  });
});
