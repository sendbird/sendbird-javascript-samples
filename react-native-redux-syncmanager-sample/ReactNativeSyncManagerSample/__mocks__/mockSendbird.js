const defaultUser = {
  userId: '123',
  nickname: 'test_nickname',
  profileUrl: 'test_profileUrl'
};
export let user = JSON.parse(JSON.stringify(defaultUser));
export function setUser(newUser) {
  user = newUser;
}
export function resetUser() {
  user = JSON.parse(JSON.stringify(defaultUser));
}

const defaultChannel = {
  channelUrl: 'url'
};
export function resetChannel() {
  channel = JSON.parse(JSON.stringify(defaultChannel));
}

export let channel = {
  channelUrl: 'url'
};

export function restoreAllDefaultMocks() {
  mockUpdateCurrentUserInfo.mockImplementation((nickname, profileUrl, cb) => {
    if (nickname) user.nickname = nickname;
    if (profileUrl) user.profileUrl = profileUrl;
    cb(user, null);
  });
  mockCreateApplicationUserListQuery.mockImplementation(() => ({
    hasNext: false
  }));
  mockCreateBlockedUserListQuery.mockImplementation(() => ({
    hasNext: false
  }));
  mockConnect.mockImplementation((userId, cb) => cb(true, null));
  mockCreateOpenChannel.mockImplementation((channelName, coverUrl, data, cb) => {
    channel = {
      ...channel,
      name: channelName
    };
    cb(channel, null);
  });
  mockGetOpenChannel.mockImplementation((channelUrl, cb) => {
    channel = {
      ...channel,
      channelUrl: channelUrl
    };
    cb(channel, null);
  });
  mockGetGroupChannel.mockImplementation((channelUrl, cb) => {
    channel = {
      ...channel,
      channelUrl: channelUrl
    };
    cb(channel, null);
  });
  mockCreateChannelWithUserIds.mockImplementation((inviteUserIdList, isDistinct, cb) => {
    cb(channel, null);
  });
  mockUnblockUserWithUserId.mockImplementation((unblockUserId, cb) => {
    cb(user, null);
  });
  mockBlockUserWithUserId.mockImplementation((blockUserId, cb) => {
    cb(user, null);
  });
  mockRemoveAllChannelHandlers.mockImplementation(() => {});
  mockChannelHandler.mockReset();
  mockConnectionHandler.mockReset();
  mockAddChannelHandler.mockReset();
  mockAddConnectionHandler.mockReset();
  mockRemoveChannelHandler.mockReset();
  mockCreateUserListQuery.mockImplementation(() => ({
    hasNext: true,
    next: cb => {
      cb();
    },
    limit: 2
  }));
}

export const mockUpdateCurrentUserInfo = jest.fn();
export const mockCreateApplicationUserListQuery = jest.fn();
export const mockCreateBlockedUserListQuery = jest.fn();
export const mockConnect = jest.fn();
export const mockCreateOpenChannel = jest.fn();
export const mockGetOpenChannel = jest.fn();
export const mockGetGroupChannel = jest.fn();
export const mockCreateChannelWithUserIds = jest.fn();
export const mockUnblockUserWithUserId = jest.fn();
export const mockBlockUserWithUserId = jest.fn();
export const mockRemoveAllChannelHandlers = jest.fn();
export const mockChannelHandler = jest.fn();
export const mockConnectionHandler = jest.fn();
export const mockAddChannelHandler = jest.fn();
export const mockAddConnectionHandler = jest.fn();
export const mockRemoveChannelHandler = jest.fn();
export const mockCreateUserListQuery = jest.fn(() => ({
  hasNext: true,
  next: cb => {
    cb();
  },
  limit: 2
}));

restoreAllDefaultMocks();

const methods = {
  getInstance: jest.fn(() => ({
    createApplicationUserListQuery: mockCreateApplicationUserListQuery,
    createBlockedUserListQuery: mockCreateBlockedUserListQuery,
    updateCurrentUserInfo: mockUpdateCurrentUserInfo,
    currentUser: user,
    disconnect: jest.fn(cb => {
      cb();
    }),
    OpenChannel: {
      createChannel: mockCreateOpenChannel,
      getChannel: mockGetOpenChannel
    },
    GroupChannel: {
      getChannel: mockGetGroupChannel,
      createChannelWithUserIds: mockCreateChannelWithUserIds
    },
    unblockUserWithUserId: mockUnblockUserWithUserId,
    blockUserWithUserId: mockBlockUserWithUserId,
    removeAllChannelHandlers: mockRemoveAllChannelHandlers,
    ChannelHandler: mockChannelHandler,
    ConnectionHandler: mockConnectionHandler,
    addChannelHandler: mockAddChannelHandler,
    addConnectionHandler: mockAddConnectionHandler,
    removeChannelHandler: mockRemoveChannelHandler,
    connect: mockConnect,
    createUserListQuery: mockCreateUserListQuery
  })),
  connect: mockConnect
};

/* eslint-disable no-undef */
jest.mock('sendbird', () => {
  const mock = jest.fn().mockImplementation(() => {
    return methods;
  });
  mock.getInstance = methods.getInstance;
  return mock;
});
