jest.useFakeTimers();

import 'react-native';
import React from 'react';
import Chat from '../../src/screens/Chat';
import store from '../../src/store';
import renderer from 'react-test-renderer';

const navigation = {
  setParams: jest.fn(),
  navigate: jest.fn(),
  state: {
    params: {
      channelUrl: 'channelUrl',
      isOpenChannel: true
    }
  },
  dispatch: jest.fn(),
  addListener: jest.fn()
};

describe('screen/Chat', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Chat store={store} navigation={navigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
