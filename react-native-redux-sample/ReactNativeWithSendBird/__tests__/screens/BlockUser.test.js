import 'react-native';
import React from 'react';
import BlockUser from '../../src/screens/BlockUser';
import store from '../../src/store';
import renderer from 'react-test-renderer';

describe('screen/BlockUser', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<BlockUser store={store} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
