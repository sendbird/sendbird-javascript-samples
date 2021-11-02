/* eslint-disable no-undef */
const collectionHandlerMocks = {
  onMessageEvent: jest.fn()
};

const messageCollectionMocks = {
  setCollectionHandler: jest.fn(),
  fetchSucceededMessages: jest.fn(),
  fetchFailedMessages: jest.fn()
};

const methods = {
  clearCache: jest.fn()
};

jest.mock('sendbird-syncmanager', () => {
  const mock = jest.fn().mockImplementation(() => {
    return methods;
  });
  mock.setup = jest.fn();
  mock.Options = function() {
    this.messageCollectionCapacity = 2000;
    this.messageResendPolicy = '';
  };
  mock.MessageCollection = function() {
    return messageCollectionMocks;
  };
  mock.MessageCollection.CollectionHandler = function() {
    return collectionHandlerMocks;
  };
  return mock;
});
