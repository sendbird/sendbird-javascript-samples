import 'react-native';
import React from 'react';
import Action from '../../src/action/member';

describe('action/invite', () => {
  it('initMembers', () => {
    const result = Action.initMembers([{ nickname: 'test' }, { nickname: 'test 2' }]);
    expect(result).toMatchSnapshot();
  });

  it('updateMembers', () => {
    const result = Action.updateMembers([{ nickname: 'test' }, { nickname: 'test 2' }]);
    expect(result).toMatchSnapshot();
  });
});
