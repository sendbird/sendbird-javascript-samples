import 'react-native';
import React from 'react';
import OpenChannel from '../../src/screens/OpenChannel';
import store from '../../src/store';
import renderer from 'react-test-renderer';

const navigation = {
  setParams: jest.fn(),
  navigate: jest.fn(),
  state: {
    params: {
      channelUrl: 'channelUrl'
    }
  },
  dispatch: jest.fn(),
  addListener: jest.fn()
};

describe('screen/OpenChannel', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<OpenChannel store={store} navigation={navigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
