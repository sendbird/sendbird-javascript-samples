import 'react-native';
import React from 'react';
import Menu from '../../src/screens/Menu';
import store from '../../src/store';
import renderer from 'react-test-renderer';

describe('screen/Menu', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Menu store={store} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
