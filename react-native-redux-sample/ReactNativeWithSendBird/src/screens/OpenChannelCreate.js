import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import {
  createOpenChannel,
  initOpenChannelCreate,
  addOpenChannelItem,
  openChannelProgress,
  onOpenChannelPress
} from '../actions';
import { Button, Input, Spinner, FormValidationMessage } from '../components';
import SendBird from 'sendbird';

class OpenChannelCreate extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: 'Open Channel Create',
      headerLeft: (
        <Button
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          buttonStyle={{ paddingLeft: 14 }}
          icon={{
            name: 'chevron-left',
            type: 'font-awesome',
            color: '#7d62d9',
            size: 18
          }}
          backgroundColor="transparent"
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: (
        <Button
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          buttonStyle={{ paddingRight: 14 }}
          color={'#7d62d9'}
          title="create"
          backgroundColor="transparent"
          onPress={() => {
            params.handleHeaderRight();
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      channelName: ''
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleHeaderRight: this._onCreateButtonPress
    });
    this.props.initOpenChannelCreate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { channel, error } = this.props;

    if (channel && this.props.channel !== prevProps.channel) {
      this.props.openChannelProgress(true);
      this.setState({ isLoading: false }, () => {
        this.props.addOpenChannelItem(channel);
        this.props.navigation.goBack();
        this.props.onOpenChannelPress(channel.url);
      });
    }

    if (error) {
      this.setState({ isLoading: false });
    }
  }

  _onOpenChannelNameChanged = channelName => {
    this.setState({ channelName });
  };

  _onCreateButtonPress = () => {
    const { channelName } = this.state;
    this.setState({ isLoading: true }, () => {
      this.props.createOpenChannel(channelName);
    });
  };

  render() {
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <Spinner visible={this.state.isLoading} />
        <View style={{ margin: 14, marginTop: 100 }}>
          <ScrollView style={styles.inputViewStyle}>
            <TextInput
              textFocusColor={'#7d62d9'}
              textBlurColor={'#000'}
              highlightColor={'#7d62d9'}
              borderColor={'#d9d9d9'}
              style={styles.inputStyle}
              keyboardType={'default'}
              autoCapitalize="none"
              duration={100}
              autoCorrect={false}
              placeholder="Channel Name"
              value={this.state.channelName}
              maxLength={12}
              onChangeText={this._onOpenChannelNameChanged}
            />
          </ScrollView>
        </View>
        <FormValidationMessage labelStyle={{ marginLeft: 14 }}>{this.props.error}</FormValidationMessage>
      </View>
    );
  }
}

function mapStateToProps({ openChannelCreate }) {
  const { error, channel } = openChannelCreate;
  return { error, channel };
}

export default connect(
  mapStateToProps,
  {
    createOpenChannel,
    initOpenChannelCreate,
    addOpenChannelItem,
    openChannelProgress,
    onOpenChannelPress
  }
)(OpenChannelCreate);

const styles = {
  inputViewStyle: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 28,
    marginRight: 28,
    marginTop: 8
  },
  inputStyle: {
    fontSize: 13,
    backgroundColor: '#fff'
  }
};
