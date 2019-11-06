import 'react-native';
import React from 'react';
import { MainController } from '../../src/controller/main';
import renderer from 'react-test-renderer';

const navigation = {
  setParams: jest.fn(),
  getParam: jest.fn().mockReturnValue({ userId: 123 }),
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

describe('controller/main', () => {
  it('renders correctly', () => {
    const comp = <MainController navigation={navigation} />;
    const tree = renderer.create(comp).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
