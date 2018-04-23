import React, { Component } from 'react';
import { View, Text, Image, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { initLogin, sendbirdLogin } from '../actions'
import { NavigationActions } from 'react-navigation'
import { Input, Button, Spinner } from '../components';

class Login extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            userId: '',
            nickname: ''
        }
    }

    componentDidMount() {
        this.props.initLogin();
    }

    componentWillReceiveProps(props) {
        let { user, error } = props;
        if (user) {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Menu' })
                ]
            })
            this.setState({ userId: '', nickname: '', isLoading: false }, () => {
                this.props.navigation.dispatch(resetAction);
            })
        }

        if (error) {
            this.setState({ isLoading: false });
        }
    }

    _onUserIdChanged = (userId) => {
        this.setState({ userId });
    }

    _onNicknameChanged = (nickname) => {
        this.setState({ nickname });
    }

    _onButtonPress = () => {
        const { userId, nickname } = this.state;
        this.setState({ isLoading: true }, () => {
            this.props.sendbirdLogin({ userId, nickname });
        });
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <Spinner visible={this.state.isLoading} />
                <View style={styles.logoViewStyle}>
                    <Image 
                        style={{width: 150, height: 150}}
                        source={require('../img/icon_sb_512.png')}
                    />
                    <Text style={styles.logoTextTitle}>SendBird</Text>
                    <Text style={styles.logoTextSubTitle}>React Native</Text>
                </View>

                <View style={styles.inputViewStyle}>
                    <Input 
                        label='User ID'
                        value={this.state.userId}
                        maxLength={12}
                        onChangeText={this._onUserIdChanged}
                    />
                </View>

                <View style={styles.inputViewStyle}>
                    <Input 
                        label='Nickname'
                        value={this.state.nickname}
                        maxLength={12}
                        onChangeText={this._onNicknameChanged}
                    />
                </View>

                <View style={styles.buttonStyle}>
                    <Button
                        title='CONNECT'
                        buttonStyle={{backgroundColor: '#6e5baa'}}
                        onPress={this._onButtonPress}
                        disabled={this.state.isLoading}
                    />
                </View>
                
                <Text style={styles.errorTextStyle}>{this.props.error}</Text>

                <View style={[styles.inputViewStyle, styles.footerViewStyle]}>
                    <Text style={styles.footerTextStyle}>Sample UI v2.1.1 / SDK v.3.0.55</Text>
                </View>
            </View>
        );
    }
}

function mapStateToProps({ login }) {
    const { error, user } = login;
    return { error, user };
};

export default connect(mapStateToProps, { initLogin, sendbirdLogin })(Login);

const styles = {
    containerStyle: {
        backgroundColor: '#fff', 
        flex: 1
    },
    logoViewStyle: {
        marginTop: 80, 
        alignItems: 'center'
    },
    logoTextTitle: {
        color: '#7d62d9', 
        fontSize: 30, 
        fontWeight: '600'
    },
    logoTextSubTitle: {
        color: '#7d62d9', 
        fontSize: 13, 
        fontWeight: '500'
    },
    inputViewStyle: {
        paddingLeft: 28,
        paddingRight: 28
    },
    buttonStyle: {
        paddingLeft: 12, 
        paddingRight: 12, 
        marginTop: 50
    },
    errorTextStyle: {
        alignSelf: 'center', 
        fontSize: 12, 
        color: '#e03131'
    },
    footerViewStyle: {
        marginTop: 15, 
        flexDirection: 'column'   
    },
    footerTextStyle: {
        alignSelf: 'center', 
        fontSize: 12, 
        color: '#8e8e8e'
    }
}
