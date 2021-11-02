import 'react-native';
import React from 'react';
import Member from '../../src/screens/Member';
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

describe('screen/Member', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Member store={store} navigation={navigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
