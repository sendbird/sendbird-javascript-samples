import React, { Component } from 'react';
import SpinnerComponent from 'react-native-loading-spinner-overlay';

class Spinner extends Component {
  render() {
    return <SpinnerComponent visible={this.props.visible} textStyle={{ color: '#fff' }} />;
  }
}

export { Spinner };
