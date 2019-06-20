import 'react-native';
import React from 'react';
import OpenChannelCreate from '../../src/screens/OpenChannelCreate';
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
  dispatch: jest.fn()
};

describe('screen/OpenChannelCreate', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<OpenChannelCreate store={store} navigation={navigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
