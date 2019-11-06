import 'react-native';
import React from 'react';
import Action from '../../src/action/signin';

describe('action/authenticate', () => {
  it('authenticate', () => {
    const result = Action.authenticate();
    expect(result).toMatchSnapshot();
  });

  it('succeed', () => {
    const result = Action.succeed({ nickname: 'test' });
    expect(result).toMatchSnapshot();
  });

  it('fail', () => {
    const result = Action.fail(new Error('fail'));
    expect(result).toMatchSnapshot();
  });
});
