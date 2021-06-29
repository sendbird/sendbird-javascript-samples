import 'react-native';
import React from 'react';
import { MessageContainer } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/MessageContainer', () => {
  const textMessage = {
    message: 'test_message',
    isUserMessage: () => true,
    isFileMessage: () => false,
    type: ''
  };
  it('renders correctly with user present', () => {
    let props = {
      message: textMessage,
      nickname: 'test_nickname',
      time: 'test_time',
      isUser: true,
      isShow: false,
      readCount: 1
    };
    const tree = renderer.create(<MessageContainer {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with user not present', () => {
    let props = {
      message: textMessage,
      nickname: 'test_nickname',
      time: 'test_time',
      isUser: false,
      isShow: false,
      readCount: 1
    };
    const tree = renderer.create(<MessageContainer {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
