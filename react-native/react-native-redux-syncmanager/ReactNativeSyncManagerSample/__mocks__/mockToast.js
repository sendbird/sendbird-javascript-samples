export const Toast = {
  show: jest.fn(),
  durations: {
    SHORT: 'short'
  },
  positions: {
    BOTTOM: 'bottom'
  }
};

jest.mock('react-native-root-toast', () => {
  return Toast;
});
