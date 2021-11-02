import 'react-native';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initInvite, getUserList, createGroupChannel, inviteGroupChannel } from '../../src/actions';
import {
  INIT_INVITE,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  CREATE_GROUP_CHANNEL_SUCCESS,
  CREATE_GROUP_CHANNEL_FAIL,
  INVITE_GROUP_CHANNEL_SUCCESS,
  INVITE_GROUP_CHANNEL_FAIL
} from '../../src/actions/types';
import {
  channel as channelObj,
  mockGetGroupChannel,
  mockCreateChannelWithUserIds,
  resetChannel,
  restoreAllDefaultMocks
} from '../../__mocks__/mockSendbird';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/groupChannelInviteActions', () => {
  beforeEach(() => {
    resetChannel();
    restoreAllDefaultMocks();
  });
  afterAll(() => {
    resetChannel();
  });
  it('initInvite', () => {
    const store = mockStore({});
    store.dispatch(initInvite());
    const actions = store.getActions();
    const expectedPayload = { type: INIT_INVITE };
    expect(actions).toEqual([expectedPayload]);
  });

  it('getUserList success without channelUrl', () => {
    const store = mockStore({});
    const users = [
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
        cb(users, null);
      })
    };
    return store.dispatch(getUserList(fakeQuery)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: USER_LIST_SUCCESS,
        list: users
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getUserList success with channelUrl', () => {
    const store = mockStore({});
    const users = [
      {
        userId: '1'
      },
      {
        userId: '2'
      },
      {
        userId: '3'
      }
    ];
    const members = [
      {
        userId: '1'
      },
      {
        userId: '2'
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
    const fakeQuery = {
      hasNext: true,
      next: jest.fn(cb => {
        cb(users, null);
      })
    };
    return store.dispatch(getUserList(fakeQuery, 'url')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: USER_LIST_SUCCESS,
        list: [{ userId: '3' }]
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getUserList success with channelUrl failed to getGroupChannel', () => {
    const store = mockStore({});
    const users = [
      {
        userId: '1'
      },
      {
        userId: '2'
      },
      {
        userId: '3'
      }
    ];
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(null, new Error());
    });
    const fakeQuery = {
      hasNext: true,
      next: jest.fn(cb => {
        cb(users, null);
      })
    };
    return store.dispatch(getUserList(fakeQuery, 'url')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: USER_LIST_SUCCESS,
        list: users
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getUserList fail API request', () => {
    const store = mockStore({});
    const fakeQuery = {
      hasNext: true,
      next: jest.fn(cb => {
        cb(null, new Error());
      })
    };
    return store.dispatch(getUserList(fakeQuery, 'url')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: USER_LIST_SUCCESS,
        list: []
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('getUserList fail no hasNext', () => {
    const store = mockStore({});
    const fakeQuery = {
      next: jest.fn(cb => {
        cb(null, new Error());
      })
    };
    return store.dispatch(getUserList(fakeQuery, 'url')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: USER_LIST_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createGroupChannel success', () => {
    const store = mockStore({});
    return store.dispatch(createGroupChannel([], true)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CREATE_GROUP_CHANNEL_SUCCESS,
        channel: channelObj
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('createGroupChannel fail', () => {
    const store = mockStore({});
    mockCreateChannelWithUserIds.mockImplementation((inviteUserIdList, isDistinct, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(createGroupChannel([], true)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: CREATE_GROUP_CHANNEL_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('inviteGroupChannel success', () => {
    const store = mockStore({});
    const inviteUserIdList = ['1', '2', '3'];
    const channel = {
      channelUrl: 'url',
      inviteWithUserIds: jest.fn((inviteUserIdList, cb) => {
        cb(channel, null);
      })
    };
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(channel, null);
    });
    return store.dispatch(inviteGroupChannel(inviteUserIdList, true)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: INVITE_GROUP_CHANNEL_SUCCESS,
        channel: channel
      };
      expect(channel.inviteWithUserIds.mock.calls[0][0]).toEqual(inviteUserIdList);
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('inviteGroupChannel fail getGroupChannel API request', () => {
    const store = mockStore({});
    const inviteUserIdList = ['1', '2', '3'];
    const channel = {
      channelUrl: 'url',
      inviteWithUserIds: jest.fn((inviteUserIdList, cb) => {
        cb(channel, null);
      })
    };
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(inviteGroupChannel(inviteUserIdList, true)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: INVITE_GROUP_CHANNEL_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('inviteGroupChannel fail inviteWithUserIds API request', () => {
    const store = mockStore({});
    const inviteUserIdList = ['1', '2', '3'];
    const channel = {
      channelUrl: 'url',
      inviteWithUserIds: jest.fn((inviteUserIdList, cb) => {
        cb(null, new Error());
      })
    };
    mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
      cb(channel, null);
    });
    return store.dispatch(inviteGroupChannel(inviteUserIdList, true)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: INVITE_GROUP_CHANNEL_FAIL
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });
});
