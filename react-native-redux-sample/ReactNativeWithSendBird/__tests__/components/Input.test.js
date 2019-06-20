import 'react-native';
import React from 'react';
import { Input } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/Input', () => {
  it('renders correctly', () => {
    const props = {
      label: 'test_label',
      value: 'test_value',
      maxLength: 123,
      onChangeText: () => {}
    };
    const tree = renderer.create(<Input {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
