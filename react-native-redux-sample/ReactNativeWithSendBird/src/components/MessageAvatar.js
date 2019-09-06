import React from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';

const _renderAvatar = (isShow, uri, onImagePress) => {
  if (!isShow) {
    uri = '';
  }

  return uri ? (
    <Avatar
      small
      rounded
      source={uri === 'default-image' ? require('../img/icon_sb_68.png') : { uri }}
      onPress={onImagePress}
    />
  ) : null;
};

const MessageAvatar = props => {
  return <View style={styles.viewStyle}>{_renderAvatar(props.isShow, props.uri, props.onAvatarPress)}</View>;
};

const styles = {
  viewStyle: {
    backgroundColor: 'transparent',
    marginRight: 8,
    width: 34,
    height: 34
  }
};

export { MessageAvatar };
