import 'react-native';
import React from 'react';
import { MessageBubble } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/MessageBubble', () => {
  const textMessage = {
    message: 'test_message',
    isUserMessage: () => true,
    isFileMessage: () => false,
    type: ''
  };
  const imageMessage = {
    isUserMessage: () => false,
    isFileMessage: () => true,
    url: 'https://dxstmhyqfqr1o.cloudfront.net/sbcom/logo-white@3x.png?key=390f1364a4e3e1cc0ad95074928193c7aeeca401',
    type: 'image/_'
  };
  const videoMessage = {
    isUserMessage: () => false,
    isFileMessage: () => true,
    url: 'https://www.youtube.com/watch?v=wjko7g3SMdg',
    type: 'video/_'
  };
  const fileMessage = {
    isUserMessage: () => false,
    isFileMessage: () => true,
    url: 'http://example.example/test.file',
    name: 'test.file',
    type: ''
  };

  it('renders correctly with no message present', () => {
    let props = {
      message: null,
      nickname: 'test_nickname',
      time: 'test_time',
      isUser: true,
      isShow: false
    };
    const tree = renderer.create(<MessageBubble {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with user present', () => {
    let props = {
      message: textMessage,
      nickname: 'test_nickname',
      time: 'test_time',
      isUser: true,
      isShow: false
    };
    const tree = renderer.create(<MessageBubble {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with user not present', () => {
    let props = {
      message: textMessage,
      nickname: 'test_nickname',
      time: 'test_time',
      isUser: false,
      isShow: false
    };
    const tree = renderer.create(<MessageBubble {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with user present and isShow true', () => {
    let props = {
      message: textMessage,
      nickname: 'test_nickname',
      time: 'test_time',
      isUser: true,
      isShow: true
    };
    const tree = renderer.create(<MessageBubble {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with user not present and isShow true', () => {
    let props = {
      message: textMessage,
      nickname: 'test_nickname',
      time: 'test_time',
      isUser: false,
      isShow: true
    };
    const tree = renderer.create(<MessageBubble {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly image file', () => {
    let props = {
      message: imageMessage,
      nickname: 'test_nickname',
      time: 'test_time',
      isUser: true,
      isShow: false
    };
    const tree = renderer.create(<MessageBubble {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly video file', () => {
    let props = {
      message: videoMessage,
      nickname: 'test_nickname',
      time: 'test_time',
      isUser: true,
      isShow: false
    };
    const tree = renderer.create(<MessageBubble {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly file', () => {
    let props = {
      message: fileMessage,
      nickname: 'test_nickname',
      time: 'test_time',
      isUser: true,
      isShow: false
    };
    const tree = renderer.create(<MessageBubble {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
