
import React from 'react';
import {
	ActivityIndicator,
	AsyncStorage,
  Image,
  Text,
  View
} from 'react-native';
import {
	Button,
  Input
} from 'react-native-elements';
import { connect } from 'react-redux';

import SendBird from 'sendbird';
import SendBirdSyncManager from 'sendbird-syncmanager';

import { style } from '../style/signin';
import Action from '../action/signin';

class SigninController extends React.Component {
	static navigationOptions = {
    header: null
  };
	constructor(props) {
		super(props);
		this.state = {
			authenticating: false,
			user: null,
			err: null,
			typedUserId: '',
			typedNickname: ''
		};
	}
	static getDerivedStateFromProps(props, state) {
    state.authenticating = props.authenticating;
    return state;
	}
	componentDidMount() {
		new SendBirdSyncManager().clearCache();
	}
	connect() {
		const userId = this.state.typedUserId;
		const nickname = this.state.typedNickname;
		if(userId && nickname) {
			const sb = SendBird.getInstance();
			if(sb) {
				this.props.authenticate();
				sb.connect(userId, (_, err) => {
					if(!err) {
						sb.updateCurrentUserInfo(nickname, null, (user, err) => {
							if(!err) {
								AsyncStorage.setItem('currentUser', JSON.stringify(user), () => {
									this.props.succeed(user);
									this.props.navigation.replace('Main', { user: user });
								});
							} else {
								this.props.fail(err.message);
							}
						});
					} else {
						this.props.fail(err.message);
					}
				});
			}
		} else {
			this.props.fail('Insert user ID and nickname');
		}
	}
	render() {
		return (
			<View style={style.container}>
        <View style={style.logo}>
          <Image 
            style={style.logoImage}
            source={require('../img/icon_sb_512.png')}
          />
          <Text style={style.logoTitleText}>SendBird</Text>
          <Text style={style.logoSubtitleText}>React Native</Text>
        </View>

        <Input
					placeholder='User ID'
          inputContainerStyle={style.inputContainer}
          inputStyle={style.input}
          autoCorrect={false}
          autoCapitalize='none'
					maxLength={16}
					value={this.state.typedUserId}
					onChangeText={text => this.setState({ typedUserId: text })}
          underlineColorAndroid='transparent'
          />

        <Input
					placeholder='Nickname'
          inputContainerStyle={style.inputContainer}
          inputStyle={style.input}
          autoCorrect={false}
          autoCapitalize='none'
					maxLength={16}
					value={this.state.typedNickname}
					onChangeText={text => this.setState({ typedNickname: text })}
          underlineColorAndroid='transparent'
          />

        <View style={style.buttonContainer}>
          <Button
            title='Connect'
            buttonStyle={style.button}
            onPress={this.connect.bind(this)}
            disabled={this.state.authenticating}
          />
        </View>
        <Text style={style.errorText}>{this.props.err || ''}</Text>

        {this.state.authenticating &&
          <ActivityIndicator
            size="large"
            color="#6e5baa"
          />
        }
      </View>
    );
	}
}

export default connect(previousState => {
	const { signin } = previousState;
	return { ...signin };
},
Action)(SigninController);