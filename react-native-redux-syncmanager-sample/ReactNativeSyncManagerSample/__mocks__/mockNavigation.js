/* eslint-disable no-undef */
jest.mock('react-navigation', () => ({
  StackActions: {
    reset: jest.fn()
  },
  NavigationActions: {
    navigate: jest.fn()
  }
}));
