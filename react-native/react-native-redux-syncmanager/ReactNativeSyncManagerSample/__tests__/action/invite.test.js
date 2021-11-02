import 'react-native';
import React from 'react';
import Action from '../../src/action/invite';

describe('action/invite', () => {
  it('fetchUsers', () => {
    const result = Action.fetchUsers([{ nickname: 'test' }, { nickname: 'test 2' }]);
    expect(result).toMatchSnapshot();
  });
});
