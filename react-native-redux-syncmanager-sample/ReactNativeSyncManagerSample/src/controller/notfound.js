
import React from 'react';
import {
  Text,
  View
} from 'react-native';

import SendBird from 'sendbird';

import { style } from '../style/notfound';

export default class NotFoundController extends React.Component {
	static navigationOptions = ({ navigation }) => {
    return {
      title: 'Channel Not Found'
    };
  }
	constructor(props) {
		super(props);
		this.channelUrl = this.props.navigation.getParam('channelUrl', null);
	}
	componentDidMount() {
		const sb = SendBird.getInstance();
    const channelHandler = new sb.ChannelHandler();
    channelHandler.onUserJoined = (channel, user) => {
      if(channel.url === this.channelUrl && sb.currentUser.userId === user.userId) {
        this.props.navigation.replace('Chat', { channel });
      }
		};
    sb.addChannelHandler(`notfound-${this.channelUrl}`, channelHandler);
	}
	render() {
		return (
			<View style={style.container}>
        <Text style={style.message}>The channel does not exist or you are not a member of this channel.</Text>
      </View>
		);
	}
}