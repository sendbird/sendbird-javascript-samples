import 'react-native';
import React from 'react';
import { MemberController } from '../../src/controller/member';
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

const navigation = {
  setParams: jest.fn(),
  getParam: jest.fn().mockReturnValue({ members }),
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

describe('controller/member', () => {
  it('renders correctly', () => {
    const initMembers = jest.fn();
    const tree = renderer
      .create(<MemberController initMembers={initMembers} members={members} navigation={navigation} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
    expect(initMembers.mock.calls.length).toBe(1);
  });

  // TODO: add test cases
});
