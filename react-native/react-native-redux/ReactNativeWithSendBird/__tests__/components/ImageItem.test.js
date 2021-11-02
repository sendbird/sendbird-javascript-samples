import 'react-native';
import React from 'react';
import { ImageItem } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/ImageItem', () => {
  it('renders correctly', () => {
    let props = {
      message: 'test_message_uri'
    };
    const tree = renderer.create(<ImageItem {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
