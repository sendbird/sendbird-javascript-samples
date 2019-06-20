import 'react-native';
import React from 'react';
import { MessageInput } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/MessageInput', () => {
  it('renders correctly', () => {
    let props = {
      textMessage: 'test_message',
      onLeftPress: () => {},
      onRightPress: () => {},
      onChangeText: () => {}
    };
    const tree = renderer.create(<MessageInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly on empty text string', () => {
    let props = {
      textMessage: '',
      onLeftPress: () => {},
      onRightPress: () => {},
      onChangeText: () => {}
    };
    const tree = renderer.create(<MessageInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
