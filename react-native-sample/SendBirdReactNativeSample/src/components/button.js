import React, { Component } from 'react';
import { TouchableHighlight, Text } from 'react-native';

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.style = this.props.style;
  }
  render() {
    return (
      <TouchableHighlight
        disabled={this.props.disabled}
        style={this._buttonStyle()}
        underlayColor={this.style.underlayColor}
        onPress={this.props.onPress}
        >
        <Text style={this._textStyle()}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }

  _buttonStyle() {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 4,
      borderColor: this.props.disabled ? this.style.disabledColor : this.style.borderColor,
      padding: 10,
      marginTop: 10,
      backgroundColor: this.props.disabled ? this.style.disabledColor : this.style.backgroundColor
    }
  }

  _textStyle() {
    return {
      width: 230,      
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
      color: this.style.textColor
    }
  }
}
