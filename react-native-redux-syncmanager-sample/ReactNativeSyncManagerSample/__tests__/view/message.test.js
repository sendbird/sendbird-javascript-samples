import 'react-native';
import React from 'react';
import MessageView from '../../src/view/message';
import renderer from 'react-test-renderer';

describe('view/message', () => {
  it('renders correctly', () => {
    const message = {
      isFileMessage: () => false,
      isUserMessage: () => true,
      url: 'http://some url',
      sender: {
        userId: '123',
        profileUrl: 'profile url'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _isPreviousMessageSentBySameUser: false,
      message: 'text message',
      _selected: false
    };
    const channel = {
      getReadReceipt: () => {
        return 100;
      }
    };
    const tree = renderer.create(<MessageView message={message} channel={channel} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with not own user', () => {
    const message = {
      isFileMessage: () => false,
      isUserMessage: () => true,
      url: 'http://some url',
      sender: {
        userId: '456',
        profileUrl: 'profile url'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _isPreviousMessageSentBySameUser: false,
      message: 'text message',
      _selected: false
    };
    const channel = {
      getReadReceipt: () => {
        return 100;
      }
    };
    const tree = renderer.create(<MessageView message={message} channel={channel} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with message selected', () => {
    const message = {
      isFileMessage: () => false,
      isUserMessage: () => true,
      url: 'http://some url',
      sender: {
        userId: '123',
        profileUrl: 'profile url'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _isPreviousMessageSentBySameUser: false,
      message: 'text message',
      _selected: true
    };
    const channel = {
      getReadReceipt: () => {
        return 100;
      }
    };
    const tree = renderer.create(<MessageView message={message} channel={channel} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with also sent message previously', () => {
    const message = {
      isFileMessage: () => false,
      isUserMessage: () => true,
      url: 'http://some url',
      sender: {
        userId: '123',
        profileUrl: 'profile url'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _isPreviousMessageSentBySameUser: true,
      message: 'text message',
      _selected: true
    };
    const channel = {
      getReadReceipt: () => {
        return 100;
      }
    };
    const tree = renderer.create(<MessageView message={message} channel={channel} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with video file', () => {
    const message = {
      isFileMessage: () => true,
      isUserMessage: () => false,
      url: 'http://some url',
      sender: {
        userId: '123',
        profileUrl: 'profile url'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _isPreviousMessageSentBySameUser: true,
      _selected: false,
      type: 'video/c'
    };
    const channel = {
      getReadReceipt: () => {
        return 100;
      }
    };
    const tree = renderer.create(<MessageView message={message} channel={channel} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with file', () => {
    const message = {
      isFileMessage: () => true,
      isUserMessage: () => false,
      sender: {
        userId: '123',
        profileUrl: 'profile url'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _isPreviousMessageSentBySameUser: true,
      _selected: false,
      name: '123456',
      type: ''
    };
    const channel = {
      getReadReceipt: () => {
        return 100;
      }
    };
    const tree = renderer.create(<MessageView message={message} channel={channel} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with file long name', () => {
    const message = {
      isFileMessage: () => true,
      isUserMessage: () => false,
      type: '',
      sender: {
        userId: '123',
        profileUrl: 'profile url'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _isPreviousMessageSentBySameUser: true,
      _selected: false,
      name: '1234567891011'
    };
    const channel = {
      getReadReceipt: () => {
        return 100;
      }
    };
    const tree = renderer.create(<MessageView message={message} channel={channel} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with admin message', () => {
    const message = {
      isFileMessage: () => true,
      isUserMessage: () => false,
      sender: {
        userId: '123',
        profileUrl: 'profile url'
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _isPreviousMessageSentBySameUser: true,
      _selected: false,
      type: '',
      name: 'test hello world'
    };
    const channel = {
      getReadReceipt: () => {
        return 100;
      }
    };
    const tree = renderer.create(<MessageView message={message} channel={channel} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
