/* @jest-environment jsdom */
import 'react-native';
import React from 'react';
import Profile from '../../src/screens/Profile';
import store from '../../src/store';
import renderer from 'react-test-renderer';
import Enzyme from 'enzyme';
import 'jest-enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

let navParams = {
  channelUrl: 'channelUrl',
  isOpenChannel: true
};

const navigation = {
  setParams: params => {
    Object.assign(navParams, params);
  },
  navigate: jest.fn(),
  state: navParams,
  dispatch: jest.fn(),
  addListener: jest.fn()
};

describe('screen/Profile', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Profile store={store} navigation={navigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
