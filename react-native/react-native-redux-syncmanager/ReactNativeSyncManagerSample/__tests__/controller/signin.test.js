import 'react-native';
import React from 'react';
import { SigninController } from '../../src/controller/signin';
import store from '../../src/store';
import renderer from 'react-test-renderer';

describe('controller/signing', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<SigninController store={store} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: add test cases
});
