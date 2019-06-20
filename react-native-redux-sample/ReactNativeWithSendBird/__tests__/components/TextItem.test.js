import 'react-native';
import React from 'react';
import { TextItem } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/TextItem', () => {
  it('renders correctly with user present', () => {
    const props = {
      isUser: true,
      message: 'test_message'
    };
    const tree = renderer.create(<TextItem {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with no user present', () => {
    const props = {
      isUser: false,
      message: 'test_message'
    };
    const tree = renderer.create(<TextItem {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
