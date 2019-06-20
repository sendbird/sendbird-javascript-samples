import 'react-native';
import React from 'react';
import Login from '../../src/screens/Login';
import store from '../../src/store';
import renderer from 'react-test-renderer';

describe('screen/Login', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Login store={store} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
