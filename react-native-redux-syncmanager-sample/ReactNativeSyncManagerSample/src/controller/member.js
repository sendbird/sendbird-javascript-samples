
import React from 'react';
import {
  View
} from 'react-native';
import {
	Button
} from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';

import SendBird from 'sendbird';

import { style } from '../style/member';
import Action from '../action/member';
import UserView from '../view/user';

class MemberController extends React.Component {
	static navigationOptions = ({ navigation }) => {
		const channel = navigation.getParam('channel', null);
    return {
			title: 'Members',
			headerRight: (
        <View style={{ flexDirection: "row" }}>
          <Button
            containerStyle={style.headerInviteContainer}
            buttonStyle={style.headerInvite}
            icon={<Icon name="md-add" color="#7d62d9" size={28}></Icon>}
            onPress={() => {
              navigation.push('Invite', { channel });
            }}
          />
        </View>
      )
		};
	}
	constructor(props) {
		super(props);
		this.channel = this.props.navigation.getParam('channel', null);
		this.state = {
			members: []
		};
	}
	static getDerivedStateFromProps(props, state) {
    state.members = props.members;
    return state;
  }
	componentDidMount() {
    const sb = SendBird.getInstance();
    const channelHandler = new sb.ChannelHandler();
		channelHandler.onUserJoined = (channel, user) => {
			this.updateChannel(channel);
		};
		channelHandler.onUserLeft = (channel, user) => {
			this.updateChannel(channel);
		};
		sb.addChannelHandler('member', channelHandler);
		this.props.initMembers(this.channel.members);
	}
	updateChannel(channel) {
    this.channel = channel;
    this.props.updateMembers(this.channel.members);
  }
	render() {
		return (
			<View>
				<FlatList
					data={this.state.members}
					keyExtractor={member => member.userId + ''}
					renderItem={bundle => <UserView user={bundle.item} selectable={false} />}
				/>
			</View>
		);
	}
}

export default connect(previousState => {
	const { member } = previousState;
	return { ...member };
},
Action)(MemberController);