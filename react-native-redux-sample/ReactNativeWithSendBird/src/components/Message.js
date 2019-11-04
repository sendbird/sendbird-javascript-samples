import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { MessageAvatar } from './MessageAvatar';
import { MessageContainer } from './MessageContainer';
import { connect } from 'react-redux';
import { onUserMessagePress } from '../actions';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: ''
    };
  }

  _onMessagePressed = () => {
    this.props.onUserMessagePress(this.props.message);
  };

  _containsMessageWithId = (messages, messageId) => {
    return messages.find(message => message.messageId === messageId);
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.selectedMessages && !this.props.selectedMessages) {
      return;
    }
    const messageId = prevProps.message.messageId;
    if (
      this.props.selectedMessages &&
      this._containsMessageWithId(this.props.selectedMessages, messageId) &&
      (!prevProps.selectedMessages || !this._containsMessageWithId(prevProps.selectedMessages, messageId))
    ) {
      this.setState({
        bgColor: '#afceff'
      });
      return;
    }
    if (
      prevProps.selectedMessages &&
      this._containsMessageWithId(prevProps.selectedMessages, messageId) &&
      (!prevProps.selectedMessages || !this._containsMessageWithId(this.props.selectedMessages, messageId))
    ) {
      this.setState({
        bgColor: '#f1f2f6'
      });
      return;
    }
  }

  _renderMessageAvatar = () => {
    return this.props.isUser ? null : (
      <MessageAvatar isShow={this.props.isShow} uri={this.props.profileUrl} onAvatarPress={this.props.onAvatarPress} />
    );
  };

  render() {
    return (
      <TouchableWithoutFeedback onLongPress={this._onMessagePressed} delayLongPress={1500}>
        <View style={[styles.messageViewStyle, { backgroundColor: this.state.bgColor }]}>
          <View
            style={{
              flexDirection: this.props.isUser ? 'row-reverse' : 'row',
              paddingLeft: 14,
              paddingRight: 14,
              paddingTop: 4,
              paddingBottom: 4
            }}
          >
            {this._renderMessageAvatar()}
            <MessageContainer
              isShow={this.props.isShow}
              isUser={this.props.isUser}
              nickname={this.props.nickname}
              message={this.props.message}
              time={this.props.time}
              isEdited={this.props.isEdited}
              readCount={this.props.readCount}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const AdminMessage = props => {
  return (
    <TouchableWithoutFeedback onLongPress={this._onMessagePressed}>
      <View
        style={[
          styles.messageViewStyle,
          {
            padding: 8,
            marginTop: 8,
            marginBottom: 8,
            marginLeft: 14,
            marginRight: 14,
            backgroundColor: '#e6e9f0'
          }
        ]}
      >
        <Text>{props.message}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  messageViewStyle: {
    transform: [{ scaleY: -1 }]
  }
};

const mapStateToProps = ({ chat }) => {
  const { selectedMessages } = chat;
  return { selectedMessages };
};

const connectedMessage = connect(
  mapStateToProps,
  {
    onUserMessagePress
  }
)(Message);

export { connectedMessage as Message, Message as TestMessage, AdminMessage };
