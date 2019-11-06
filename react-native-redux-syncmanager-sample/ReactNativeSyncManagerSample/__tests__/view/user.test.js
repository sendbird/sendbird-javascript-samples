import 'react-native';
import React from 'react';
import UserView from '../../src/view/user';
import renderer from 'react-test-renderer';

describe('view/user', () => {
  it('renders correctly', () => {
    const user = {
      userId: 'userId',
      nickname: 'nick'
    };
    const tree = renderer.create(<UserView user={user} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when selected', () => {
    const user = {
      userId: 'userId',
      nickname: 'nick'
    };
    const tree = renderer.create(<UserView user={user} selected={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
