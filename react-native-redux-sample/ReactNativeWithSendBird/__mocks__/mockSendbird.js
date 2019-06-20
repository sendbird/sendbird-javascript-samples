/* eslint-disable no-undef */
const user = {
  userId: '123',
  nickname: 'test_nickname',
  profileUrl: 'test_profileUrl'
};

const methods = {
  getInstance: jest.fn(() => ({
    createApplicationUserListQuery: jest.fn(() => ({
      hasNext: false
    })),
    createBlockedUserListQuery: jest.fn(() => ({
      hasNext: false
    })),
    updateCurrentUserInfo: jest.fn((nickname, profileUrl, cb) => cb(user, null)),
    removeAllChannelHandlers: jest.fn(),
    currentUser: user
  })),
  connect: jest.fn((userId, cb) => cb(true, null))
};

jest.mock('sendbird', () => {
  const mock = jest.fn().mockImplementation(() => {
    return methods;
  });
  mock.getInstance = methods.getInstance;
  return mock;
});
