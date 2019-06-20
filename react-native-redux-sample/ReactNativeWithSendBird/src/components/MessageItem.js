import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

const TextItem = props => {
  return (
    <View style={{}}>
      <Text style={{ fontSize: 12, color: props.isUser ? '#fff' : '#000' }}>{props.message}</Text>
    </View>
  );
};

class FileItem extends Component {
  constructor(props) {
    super(props);
  }

  _renderMessage() {
    if (this.props.message.length > 13) {
      return this.props.message.substring(0, 10) + '...';
    }
    return this.props.message;
  }

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Icon
          containerStyle={{ marginLeft: 0 }}
          iconStyle={{ margin: 0, padding: 0 }}
          name="file"
          type="font-awesome"
          color={this.props.isUser ? '#fff' : '#000'}
          size={16}
        />
        <Text style={{ marginLeft: 8 }}>{this._renderMessage()}</Text>
      </View>
    );
  }
}

const styles = {};

export { TextItem, FileItem };
