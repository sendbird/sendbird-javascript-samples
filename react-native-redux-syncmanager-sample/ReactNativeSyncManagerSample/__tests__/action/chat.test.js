import 'react-native';
import React from 'react';
import Action from '../../src/action/chat';

describe('action/chat', () => {
  it('selectMessage', () => {
    const result = Action.selectMessage({ message: 'test' });
    expect(result).toMatchSnapshot();
  });

  it('deselectAllMessages', () => {
    const result = Action.deselectAllMessages();
    expect(result).toMatchSnapshot();
  });

  it('addMessages', () => {
    const result = Action.addMessages([{ message: 'test' }, { message: 'test2' }]);
    expect(result).toMatchSnapshot();
  });

  it('updateMessages', () => {
    const result = Action.updateMessages([{ message: 'test' }, { message: 'test2' }]);
    expect(result).toMatchSnapshot();
  });

  it('removeMessages', () => {
    const result = Action.removeMessages([{ message: 'test' }, { message: 'test2' }]);
    expect(result).toMatchSnapshot();
  });

  it('clearMessages', () => {
    const result = Action.clearMessages();
    expect(result).toMatchSnapshot();
  });
});
