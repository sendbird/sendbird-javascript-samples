import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import {
  initOpenChannel,
  getOpenChannelList,
  onOpenChannelPress,
  clearCreatedOpenChannel,
  clearSelectedOpenChannel,
  openChannelProgress
} from '../actions';
import { Button, ListItem, Avatar, Spinner } from '../components';
import { sbCreateOpenChannelListQuery } from '../sendbirdActions';
import appStateChangeHandler from '../appStateChangeHandler';

class OpenChannel extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: 'Open Channel',
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
          iconRight={{
            name: 'plus',
            type: 'font-awesome',
            color: '#7d62d9',
            size: 18
          }}
          backgroundColor="transparent"
          onPress={() => {
            navigation.navigate('OpenChannelCreate');
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      enterChannel: false,
      openChannelListQuery: null,
      list: []
    };
  }

  componentDidMount() {
    this.willFocusSubsription = this.props.navigation.addListener('willFocus', () => {
      this._initOpenChannelList();
    });
    this.appStateHandler = appStateChangeHandler.getInstance().addCallback('OPEN_CHANNEL', () => {
      this._initOpenChannelList();
    });
  }

  componentWillUnmount() {
    this.appStateHandler();
    this.willFocusSubsription.remove();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { list, channel, createdChannel } = this.props;

    if (createdChannel && createdChannel !== prevProps.createdChannel) {
      const newList = [...[createdChannel], ...list];
      this.setState({ list: newList }, () => {
        this.props.clearCreatedOpenChannel();
      });
    }
    if (channel && channel !== prevProps.channel) {
      this.props.clearSelectedOpenChannel();
      this.props.navigation.navigate('Chat', {
        channelUrl: channel.url,
        newTitle: channel.name,
        memberCount: channel.participantCount,
        isOpenChannel: channel.isOpenChannel(),
        _initListState: this._initEnterState
      });
    }
  }

  _initEnterState = () => {
    this.setState({ enterChannel: false });
  };

  _initOpenChannelList = () => {
    this.props.initOpenChannel();
    this._getOpenChannelList(true);
  };

  _getOpenChannelList = init => {
    this.props.openChannelProgress(true);
    if (init) {
      const openChannelListQuery = sbCreateOpenChannelListQuery();
      this.setState({ openChannelListQuery }, () => {
        this.props.getOpenChannelList(this.state.openChannelListQuery);
      });
    } else {
      this.props.getOpenChannelList(this.state.openChannelListQuery);
    }
  };

  _onListItemPress = channelUrl => {
    if (!this.state.enterChannel) {
      this.setState({ enterChannel: true }, () => {
        this.props.onOpenChannelPress(channelUrl);
      });
    }
  };

  _handleScroll = e => {
    if (e.nativeEvent.contentOffset.y < -100 && !this.props.isLoading) {
      this._initOpenChannelList();
    }
  };

  _renderList = rowData => {
    const channel = rowData.item;
    return (
      <ListItem
        component={TouchableHighlight}
        containerStyle={{ backgroundColor: '#fff' }}
        key={channel.url}
        avatar={<Avatar source={channel.coverUrl ? { uri: channel.coverUrl } : require('../img/icon_sb_68.png')} />}
        title={channel.name.length > 30 ? channel.name.substring(0, 26) + '...' : channel.name}
        titleStyle={{ fontWeight: '500', fontSize: 16 }}
        subtitle={channel.participantCount + ' Participant'}
        subtitleStyle={{ fontWeight: '300', fontSize: 11 }}
        onPress={() => this._onListItemPress(channel.url)}
      />
    );
  };

  render() {
    return (
      <View>
        <Spinner visible={this.props.isLoading} />
        <FlatList
          renderItem={this._renderList}
          data={this.props.list}
          extraData={this.state}
          inverted={false}
          keyExtractor={(item, index) => item.url}
          onEndReached={() => this._getOpenChannelList(false)}
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  }
}

const styles = {};

function mapStateToProps({ openChannel }) {
  const { isLoading, list, createdChannel, channel } = openChannel;
  return { isLoading, list, createdChannel, channel };
}

export default connect(
  mapStateToProps,
  {
    initOpenChannel,
    getOpenChannelList,
    onOpenChannelPress,
    clearCreatedOpenChannel,
    clearSelectedOpenChannel,
    openChannelProgress
  }
)(OpenChannel);
