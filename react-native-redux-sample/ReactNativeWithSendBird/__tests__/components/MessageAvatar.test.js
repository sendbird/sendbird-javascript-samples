import 'react-native';
import React from 'react';
import { MessageAvatar } from '../../src/components';
import renderer from 'react-test-renderer';

describe('component/MessageAvatar', () => {
  it('renders correctly with user present', () => {
    let props = {
      uri: 'test_uri',
      isShow: false,
      onPress: () => {}
    };
    const tree = renderer.create(<MessageAvatar {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
