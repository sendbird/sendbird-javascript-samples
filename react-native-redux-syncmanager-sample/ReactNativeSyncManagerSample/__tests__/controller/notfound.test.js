import 'react-native';
import React from 'react';
import NotFound from '../../src/controller/notfound';
import renderer from 'react-test-renderer';

const navigation = {
  setParams: jest.fn(),
  getParam: jest.fn().mockReturnValue('channel Url'),
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

describe('controller/notfound', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<NotFound navigation={navigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
