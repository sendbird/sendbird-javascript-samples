import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { sendbirdLogout, initMenu } from '../actions';
import {
    sbUnregisterPushToken
  } from '../sendbirdActions';
import { NavigationActions } from 'react-navigation'
import { Button, HR, Spinner } from '../components';

class Menu extends Component {
    static navigationOptions = {
        title: 'Sendbird'
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentDidMount() {
        this.props.initMenu();
    }

    componentWillReceiveProps(props) {
        AsyncStorage.getItem("user", (err, result) => {
            if(!result) {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Login' })
                    ]
                })
                this.props.navigation.dispatch(resetAction);
            }
        });
    }

    _onProfileButtonPress = () => {
        this.props.navigation.navigate('Profile');
    }

    _onOpenChannelPress = () => {
        this.props.navigation.navigate('OpenChannel');
    }

    _onGroupChannelPress = () => {
        this.props.navigation.navigate('GroupChannel');
    }

    _onDisconnectButtonPress = () => {
        this.setState({ isLoading: true }, () => {
            sbUnregisterPushToken()
                .then(res => {
                    this.props.sendbirdLogout();
                })
                .catch(err => {});
        });
    }

    render() {
        return (
            <View style={styles.containerViewStyle}>
                <Spinner visible={this.state.isLoading} />
                <Button
                    containerViewStyle={styles.menuViewStyle}
                    buttonStyle={styles.buttonStyle}
                    backgroundColor='#fff'
                    color='#6e5baa'
                    icon={{name: 'user', type: 'font-awesome' , color: '#6e5baa', size: 16}}
                    title='Profile'
                    onPress={this._onProfileButtonPress}
                />
                <HR />
                <Button
                    containerViewStyle={styles.menuViewStyle}
                    buttonStyle={styles.buttonStyle}
                    backgroundColor='#fff'
                    color='#6e5baa'
                    icon={{name: 'slack', type: 'font-awesome' , color: '#6e5baa', size: 16}}
                    title='Open Channel' 
                    onPress={this._onOpenChannelPress}
                />
                <HR />
                <Button
                    containerViewStyle={styles.menuViewStyle}
                    buttonStyle={styles.buttonStyle}
                    backgroundColor='#fff'
                    color='#6e5baa'
                    icon={{name: 'users', type: 'font-awesome' , color: '#6e5baa', size: 16}}
                    title='Group Channel' 
                    onPress={this._onGroupChannelPress}
                />
                <HR />
                <Button
                    containerViewStyle={styles.menuViewStyle}
                    buttonStyle={styles.buttonStyle}
                    backgroundColor='#fff'
                    color='#7d62d9'
                    color='#6e5baa'
                    icon={{name: 'sign-out', type: 'font-awesome' , color: '#6e5baa', size: 16}}
                    title='Disconnect' 
                    onPress={this._onDisconnectButtonPress}
                />
                <HR />
            </View>
        )
    }
}

function mapStateToProps({ menu }) {
    const { isDisconnected } = menu;
    return { isDisconnected };
};

export default connect(mapStateToProps, { sendbirdLogout, initMenu })(Menu);

const styles = {
    containerViewStyle: {
        backgroundColor: '#fff', 
        flex: 1
    },
    menuViewStyle: {
        marginLeft: 0,
        marginRight: 0
    },
    buttonStyle: {
        justifyContent: 'flex-start',
        paddingLeft: 14
    }
};
