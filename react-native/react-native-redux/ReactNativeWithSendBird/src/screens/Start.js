import React, { Component } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation';
import { sbConnect } from '../sendbirdActions';
import { Spinner } from '../components';

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user', (err, result) => {
      if (result) {
        this.setState({ isLoading: true }, () => {
          const user = JSON.parse(result);
          sbConnect(user.userId, user.nickname)
            .then(() => {
              this.setState({ isLoading: false }, () => {
                this.redirectTo('Menu');
              });
            })
            .catch(err => {
              this.setState({ isLoading: false }, () => {
                this.redirectTo('Login');
              });
            });
        });
      } else this.redirectTo('Login');
    });
  }
  redirectTo(page, params) {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: page, params: params })]
      })
    );
  }
  render() {
    return (
      <View style={styles.containerStyle}>
        <Spinner visible={this.state.isLoading} />
      </View>
    );
  }
}

function mapStateToProps({ login }) {
  const { error, user } = login;
  return { error, user };
}

export default connect(
  mapStateToProps,
  {}
)(Start);

const styles = {
  containerStyle: {
    backgroundColor: '#fff',
    flex: 1
  }
};
