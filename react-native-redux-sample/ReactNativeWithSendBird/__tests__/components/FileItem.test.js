import 'react-native';
import React from 'react';
import { FileItem } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/FileItem', () => {
  it('renders correctly with user present, message length is small', () => {
    const props = {
      isUser: true,
      message: 'test_message' // .length === 12
    };
    const tree = renderer.create(<FileItem {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with user present, message length is large', () => {
    const props = {
      isUser: true,
      message: 'test_message123' // .length === 15
    };
    const tree = renderer.create(<FileItem {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with no user present', () => {
    const props = {
      isUser: false,
      message: 'test_message123' // .length === 15
    };
    const tree = renderer.create(<FileItem {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
