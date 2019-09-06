jest.useFakeTimers();

import 'react-native';
import React from 'react';
import GroupChannelInvite from '../../src/screens/GroupChannelInvite';
import store from '../../src/store';
import renderer from 'react-test-renderer';

const navigation = {
  setParams: jest.fn(),
  navigate: jest.fn(),
  state: {
    params: {
      channelUrl: 'channelUrl'
    }
  }
};

describe('screen/GroupChannelInvite', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<GroupChannelInvite navigation={navigation} store={store} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
