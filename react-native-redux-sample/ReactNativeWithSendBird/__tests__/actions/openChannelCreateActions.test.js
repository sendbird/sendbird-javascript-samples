import 'react-native';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  mockCreateOpenChannel,
  channel as channelObj,
  resetChannel,
  restoreAllDefaultMocks
} from '../../__mocks__/mockSendbird';

import { initOpenChannelCreate, createOpenChannel } from '../../src/actions';
import {
  INIT_OPEN_CHANNEL_CREATE,
  OPEN_CHANNEL_CREATE_SUCCESS,
  OPEN_CHANNEL_CREATE_FAIL
} from '../../src/actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/openChannelCreateActions', () => {
  beforeEach(() => {
    resetChannel();
    restoreAllDefaultMocks();
  });
  afterAll(() => {
    resetChannel();
  });
  it('initOpenChannelCreate', () => {
    const store = mockStore({});
    store.dispatch(initOpenChannelCreate());
    const actions = store.getActions();
    const expectedPayload = { type: INIT_OPEN_CHANNEL_CREATE };
    expect(actions).toEqual([expectedPayload]);
  });

  it('createOpenChannel success', () => {
    const store = mockStore({});
    return store.dispatch(createOpenChannel('new channel')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: OPEN_CHANNEL_CREATE_SUCCESS,
        channel: channelObj
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createOpenChannel fail API request', () => {
    const store = mockStore({});
    mockCreateOpenChannel.mockImplementation((channelName, coverUrl, data, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(createOpenChannel()).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: OPEN_CHANNEL_CREATE_FAIL,
        error: 'Channel name is required.'
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createOpenChannel fail API request', () => {
    const store = mockStore({});
    mockCreateOpenChannel.mockImplementation((channelName, coverUrl, data, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(createOpenChannel('new channel')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: OPEN_CHANNEL_CREATE_FAIL,
        error: 'Create OpenChannel Failed.'
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });
});
