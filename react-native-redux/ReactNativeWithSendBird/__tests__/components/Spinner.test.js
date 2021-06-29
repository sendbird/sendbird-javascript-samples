import 'react-native';
import React from 'react';
import { Spinner } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/Spinner', () => {
  it('renders correctly when visible', () => {
    const props = {
      visible: true
    };
    const tree = renderer.create(<Spinner {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when not visible', () => {
    const props = {
      visible: false
    };
    const tree = renderer.create(<Spinner {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
