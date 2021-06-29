jest.mock('NativeModules', () => ({
  UIManager: {
    RCTView: () => {}
  },
  RNGestureHandlerModule: {
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    State: {},
    Directions: {
      forceTouchAvailable: jest.fn()
    }
  },
  PlatformConstants: {
    forceTouchAvailable: false
  }
}));
