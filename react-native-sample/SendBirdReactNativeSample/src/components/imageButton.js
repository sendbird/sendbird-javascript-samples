import React, { Component } from 'react';
import { TouchableHighlight, Image } from 'react-native';

export default class ImageButton extends Component {
  constructor(props) {
    super(props);
    this.style = this.props.style;
  }
  render() {
    return (
      <TouchableHighlight
        style={this.props.buttonStyle}
        underlayColor={this.props.underlayColor}
        onPress={this.props.onPress}
        >
        <Image style={this.props.imageStyle} source={this.props.image} />
      </TouchableHighlight>
    );
  }  
}
