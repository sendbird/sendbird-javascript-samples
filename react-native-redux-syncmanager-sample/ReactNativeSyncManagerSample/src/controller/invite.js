
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

import { style } from '../style/invite';
import Action from '../action/invite';
import UserView from '../view/user';
import { toast } from '../utils';

let _selectedUserIds = [];

class InviteController extends React.Component {
	static navigationOptions = ({ navigation }) => {
		const channel = navigation.getParam('channel', null);
    return {
			title: !channel ? 'Create new channel' : 'Invite',
			headerRight: (
        <View style={{ flexDirection: "row" }}>
          <Button
            containerStyle={style.headerInviteContainer}
            buttonStyle={style.headerInvite}
            icon={<Icon name="md-add" color="#7d62d9" size={28}></Icon>}
            onPress={() => {
							if(!channel) {
								if(_selectedUserIds.length > 0) {
									const sb = SendBird.getInstance();
									const params = new sb.GroupChannelParams();
									params.addUserIds(_selectedUserIds);
									sb.GroupChannel.createChannel(params, (channel, err) => {
										if(!err) {
											navigation.replace('Chat', { channel });
										} else {
											toast('Failed to create channel.');
										}
									});
								} else {
									toast('Choose at least 1 user to invite.');
								}
							} else {
								channel.inviteWithUserIds(_selectedUserIds, (res, err) => {
									if(!err) {
										navigation.pop();
									} else {
										toast('Failed to invite users.');
									}
									isLoading = false;
								});
							}
            }}
          />
        </View>
      )
		};
	}
	constructor(props) {
		super(props);
		const sb = SendBird.getInstance();
    this.query = sb.createUserListQuery();
		this.channel = this.props.navigation.getParam('channel', null);
		this.state = {
			users: []
		};
	}
	static getDerivedStateFromProps(props, state) {
    state.users = props.users;
    return state;
	}
	componentDidMount() {
		this.next();
	}
	componentWillUnmount() {
    _selectedUserIds = [];
  }
	toggle(selected, user) {
		if(selected) {
			if(_selectedUserIds.indexOf(user.userId) < 0) {
				_selectedUserIds.push(user.userId);
			}
		} else {
			const index = _selectedUserIds.indexOf(user.userId);
			if(index >= 0) {
				_selectedUserIds.splice(index, 1);
			}
		}
	}
	next() {
		if(this.query.hasNext) {
      this.query.next((users, err) => {
        if(!err) {
          let filteredUsers = [];
          if(this.channel) {
            for(let i in users) {
              if(this.channel.members.map(m => m.userId)
                .indexOf(users[i].userId) < 0) {
                filteredUsers.push(users[i]);
              }
            }
          } else {
            filteredUsers = users;
          }
          if(filteredUsers.length < this.query.limit && this.query.hasNext) {
						setTimeout(() => this.next(), 200);
          } else {
            this.props.fetchUsers(filteredUsers);
          }
        }
      });
    }
	}
	render() {
		return (
			<View>
				<FlatList
					data={this.state.users}
					keyExtractor={user => user.userId + ''}
					onEndReached={this.next.bind(this)}
					renderItem={bundle => <UserView
							user={bundle.item}
							selectable={true}
							selected={_selectedUserIds.indexOf(bundle.item.userId) >= 0}
							onPress={this.toggle.bind(this)}
						/>}
				/>
			</View>
		);
	}
}

export default connect(previousState => {
	const { invite } = previousState;
	return { ...invite };
},
Action)(InviteController);