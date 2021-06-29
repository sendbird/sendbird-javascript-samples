import 'react-native';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initMember, getParticipantList, getMemberList } from '../../src/actions';
import { INIT_MEMBER, MEMBER_LIST_SUCCESS, MEMBER_LIST_FAIL } from '../../src/actions/types';
import {
  channel as channelObj,
  mockGetGroupChannel,
  resetChannel,
  restoreAllDefaultMocks
} from '../../__mocks__/mockSendbird';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/memberActions', () => {
  beforeEach(() => {
    resetChannel();
    restoreAllDefaultMocks();
  });
  afterAll(() => {
    resetChannel();
  });
  it('initMember', () => {
    const store = mockStore({});
    store.dispatch(initMember());
    const actions = store.getActions();
    const expectedPayload = { type: INIT_MEMBER };
    expect(actions).toEqual([expectedPayload]);
  });

  it('getParticipantList success', () => {
    const store = mockStore({});
    const participants = [
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
        cb(participants, null);
      })
    };
    return store.dispatch(getParticipantList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: MEMBER_LIST_SUCCESS,
        list: participants.map(participant => {
          return {
            nickname: participant.nickname,
            profileUrl: participant.profileUrl,
            isOnline: ' '
          };
        })
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getParticipantList fail no hasNext', () => {
    const store = mockStore({});
    const fakeQuery = {};
    return store.dispatch(getParticipantList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: MEMBER_LIST_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getOpenChannelList fail API request', () => {
    const store = mockStore({});
    const fakeQuery = {
      hasNext: true,
      next: jest.fn(cb => {
        cb(null, new Error());
      })
    };
    return store.dispatch(getParticipantList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: MEMBER_LIST_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getMemberList success', () => {
    const store = mockStore({});
    const members = [
      {
        nickname: 'nick1',
        profileUrl: 'profileUrl1',
        connectionStatus: 'online'
      },
      {
        nickname: 'nick2',
        profileUrl: 'profileUrl2',
        connectionStatus: ''
      }
    ];
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      const channel = {
        ...channelObj,
        channelUrl: channelUrl,
        members: members
      };
      cb(channel, null);
    });
    return store.dispatch(getMemberList('channelUrl')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: MEMBER_LIST_SUCCESS,
        list: members.map(member => {
          return {
            nickname: member.nickname,
            profileUrl: member.profileUrl,
            isOnline: member.connectionStatus === 'online' ? 'online' : 'offline'
          };
        })
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getMemberList success', () => {
    const store = mockStore({});
    const members = [
      {
        nickname: 'nick1',
        profileUrl: 'profileUrl1',
        connectionStatus: 'online'
      },
      {
        nickname: 'nick2',
        profileUrl: 'profileUrl2',
        connectionStatus: ''
      }
    ];
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      const channel = {
        ...channelObj,
        channelUrl: channelUrl,
        members: members
      };
      cb(channel, null);
    });
    return store.dispatch(getMemberList('channelUrl')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: MEMBER_LIST_SUCCESS,
        list: members.map(member => {
          return {
            nickname: member.nickname,
            profileUrl: member.profileUrl,
            isOnline: member.connectionStatus === 'online' ? 'online' : 'offline'
          };
        })
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getMemberList fail', () => {
    const store = mockStore({});
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(getMemberList('channelUrl')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: MEMBER_LIST_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });
});
