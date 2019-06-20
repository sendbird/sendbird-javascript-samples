import 'react-native';
import React from 'react';
import { HR } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/Hr', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<HR />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
