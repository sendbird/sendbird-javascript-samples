import 'react-native';
import React from 'react';
import { AdminMessage } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/AdminMessage', () => {
  it('renders correctly', () => {
    let props = {
      message: 'test_message'
    };
    const tree = renderer.create(<AdminMessage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
