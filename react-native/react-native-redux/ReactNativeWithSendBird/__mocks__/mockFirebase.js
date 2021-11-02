/* eslint-disable no-undef */
jest.mock('react-native-firebase', () => ({
  messaging: jest.fn(() => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve('myMockToken')),
    onTokenRefresh: jest.fn(),
    onMessage: jest.fn()
  })),
  notifications: jest.fn(() => ({
    onNotification: jest.fn(),
    onNotificationDisplayed: jest.fn(),
    onNotificationOpened: jest.fn(),
    removeAllDeliveredNotifications: jest.fn()
  }))
}));
