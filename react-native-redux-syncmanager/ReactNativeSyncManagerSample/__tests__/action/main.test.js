import 'react-native';
import React from 'react';
import Action from '../../src/action/main';

describe('action/chat', () => {
  it('addChannels', () => {
    const result = Action.addChannels([{ url: 'test' }, { url: 'test 2' }]);
    expect(result).toMatchSnapshot();
  });

  it('updateChannels', () => {
    const result = Action.updateChannels([{ url: 'test' }, { url: 'test 2' }]);
    expect(result).toMatchSnapshot();
  });

  it('removeChannels', () => {
    const result = Action.removeChannels([{ url: 'test' }, { url: 'test 2' }]);
    expect(result).toMatchSnapshot();
  });

  it('moveChannels', () => {
    const result = Action.moveChannels([{ url: 'test' }, { url: 'test 2' }]);
    expect(result).toMatchSnapshot();
  });

  it('clearChannels', () => {
    const result = Action.clearChannels();
    expect(result).toMatchSnapshot();
  });
});
