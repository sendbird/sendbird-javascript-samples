import 'react-native';
import React from 'react';
import { Message } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/Message', () => {
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
      isShow: true,
      readCount: 1,
      profileUrl: 'test_profile_url',
      onPress: () => {}
    };
    const tree = renderer.create(<Message {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
