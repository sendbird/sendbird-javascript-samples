var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image
} = React;

var Button = require('../common/button');
var sendbird = require('sendbird');

var icon = require('../../img/logo-sendbird.png');
var appId = 'A7A2672C-AD11-11E4-8DAA-0A18B21C2D82';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      errorMessage: ''
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={icon}
          />
        </View>
        <View style={styles.signinContainer}>
          <TextInput
            style={styles.input}
            value={this.state.username}
            onChangeText={(text) => this.setState({username: text})}
            placeholder={'Enter User Nickname'}
            maxLength={12}
            multiline={false}
            />

          <Button
            text={'DONE'}
            backgroundColor={'#32c5e6'}
            underlayColor={'#328FE6'}
            borderColor={'#328FE6'}
            textColor={'#ffffff'}
            onPress={this.onPress}
          />
          <Text style={styles.errorLabel}>{this.state.errorMessage}</Text>
        </View>

      </View>
    );
  },
  onPress: function() {
    if (this.state.username.trim().length == 0) {
      this.setState({
        username: '',
        errorMessage: 'Please enter user nickname'
      });
      return;
    }

    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    if (regExp.test(this.state.username)) {
      this.setState({
        username: '',
        errorMessage: 'Please only alphanumeric characters.'
      });
      return;
    }

    sendbird.init({
      app_id: appId,
      guest_id: this.state.username,
      user_name: this.state.username,
      image_url: "",
      access_token: "",
      successFunc: (data) => {
        this.props.navigator.immediatelyResetRouteStack([{ name: 'index' }]);
      },
      errorFunc: (status, error) => {
        this.setState({
          username: '',
          errorMessage: error
        });
        return;
      }
    });
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6E5BAA'
  },
  iconContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  signinContainer: {
    flex: 3
  },
  input: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#32C5E6',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  errorLabel: {
    color: '#c7b0ff',
    fontSize: 15,
    marginTop: 10,
    width: 250
  },
  icon: {
    width: 200,
    height: 53
  }
});
