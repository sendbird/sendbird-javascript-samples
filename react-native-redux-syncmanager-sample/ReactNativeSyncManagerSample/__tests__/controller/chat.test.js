import 'react-native';
import React from 'react';
import { ChatController } from '../../src/controller/chat';
import renderer from 'react-test-renderer';

const navigation = {
  getParam: jest.fn().mockReturnValue({
    url: 'new Url',
    markAsRead: jest.fn()
  }),
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

describe('controller/chat', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ChatController navigation={navigation} failedMessages={[]} messages={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
