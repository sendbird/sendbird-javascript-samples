import 'react-native';
import React from 'react';
import { InviteController } from '../../src/controller/invite';
import renderer from 'react-test-renderer';

const members = [
  {
    userId: 1,
    nickname: 'Aaa'
  },
  {
    userId: 2,
    nickname: 'Baa'
  },
  {
    userId: 3,
    nickname: 'Caa'
  }
];

const channel = {
  members: [
    {
      userId: 1
    },
    {
      userId: 4
    }
  ]
};

const navigation = {
  setParams: jest.fn(),
  getParam: jest.fn().mockReturnValue(channel),
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

describe('controller/invite', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<InviteController users={members} navigation={navigation} fetchUsers={jest.fn()} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
