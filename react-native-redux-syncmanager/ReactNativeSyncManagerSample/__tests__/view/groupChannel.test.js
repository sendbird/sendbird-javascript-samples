import 'react-native';
import React from 'react';
import GroupChannelView from '../../src/view/groupChannel';
import renderer from 'react-test-renderer';

describe('view/groupChannel', () => {
  it('renders correctly user message', () => {
    const message = {
      isFileMessage: () => false,
      isUserMessage: () => true,
      url: 'http://some url',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      coverUrl: 'coverUrl',
      unreadMessageCount: 20,
      message: 'text message'
    };
    const channel = {
      lastMessage: message,
      members: [
        {
          nickname: 'nick1'
        },
        {
          nickname: 'nick2'
        }
      ]
    };
    const tree = renderer.create(<GroupChannelView channel={channel} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly file message', () => {
    const message = {
      isFileMessage: () => true,
      isUserMessage: () => true,
      url: 'http://some url',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      coverUrl: 'coverUrl',
      unreadMessageCount: 20,
      name: 'file message'
    };
    const channel = {
      lastMessage: message,
      members: [
        {
          nickname: 'nick1'
        },
        {
          nickname: 'nick2'
        }
      ]
    };
    const tree = renderer.create(<GroupChannelView channel={channel} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
