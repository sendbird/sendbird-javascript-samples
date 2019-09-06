import 'react-native';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initBlockUser, getBlockUserList, onUnblockUserPress } from '../../src/actions';
import {
  INIT_BLOCK_USER,
  BLOCK_LIST_SUCCESS,
  BLOCK_LIST_FAIL,
  USER_UNBLOCK_SUCCESS,
  USER_UNBLOCK_FAIL
} from '../../src/actions/types';
import { resetChannel, restoreAllDefaultMocks, mockUnblockUserWithUserId } from '../../__mocks__/mockSendbird';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/blockUserActions', () => {
  beforeEach(() => {
    resetChannel();
    restoreAllDefaultMocks();
  });
  afterAll(() => {
    resetChannel();
  });
  it('initBlockUser', () => {
    const store = mockStore({});
    store.dispatch(initBlockUser());
    const actions = store.getActions();
    const expectedPayload = { type: INIT_BLOCK_USER };
    expect(actions).toEqual([expectedPayload]);
  });

  it('getBlockUserList success', () => {
    const store = mockStore({});
    const blockedUsers = [
      {
        nickname: 'nick1',
        profileUrl: 'profile1'
      },
      {
        nickname: 'nick2',
        profileUrl: 'profile2'
      }
    ];
    const fakeQuery = {
      hasNext: true,
      next: jest.fn(cb => {
        cb(blockedUsers, null);
      })
    };
    return store.dispatch(getBlockUserList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: BLOCK_LIST_SUCCESS,
        list: blockedUsers
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getBlockUserList success no hasNext', () => {
    const store = mockStore({});
    const fakeQuery = {
      next: jest.fn(cb => {
        cb([], null);
      })
    };
    return store.dispatch(getBlockUserList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: BLOCK_LIST_FAIL,
        list: []
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getBlockUserList fail API request', () => {
    const store = mockStore({});
    const fakeQuery = {
      next: jest.fn(cb => {
        cb(null, new Error());
      })
    };
    return store.dispatch(getBlockUserList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: BLOCK_LIST_FAIL,
        list: []
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('onUnblockUserPress success', () => {
    const store = mockStore({});
    const unblockedUserId = 'userId';
    return store.dispatch(onUnblockUserPress(unblockedUserId)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: USER_UNBLOCK_SUCCESS,
        unblockedUserId: unblockedUserId
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('onUnblockUserPress fail API request', () => {
    const store = mockStore({});
    mockUnblockUserWithUserId.mockImplementation((unblockUserId, cb) => {
      cb(null, new Error());
    });
    const unblockedUserId = 'userId';
    return store.dispatch(onUnblockUserPress(unblockedUserId)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: USER_UNBLOCK_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });
});
