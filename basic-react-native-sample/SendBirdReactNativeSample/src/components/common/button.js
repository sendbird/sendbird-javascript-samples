var React = require('react-native');
var {
  Text,
  TouchableHighlight
} = React;

module.exports = React.createClass({
  render: function() {
    return (
      <TouchableHighlight
        style={this.buttonStyle()}
        underlayColor={this.buttonUnderlayColor()}
        onPress={this.props.onPress}
        >
        <Text style={ this.textStyle() }>{this.props.text}</Text>
      </TouchableHighlight>
    );
  },
  buttonStyle: function() {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: this.props.borderColor,
      padding: 10,
      marginTop: 10,
      backgroundColor: this.props.backgroundColor
    }
  },
  buttonUnderlayColor: function() {
    return this.props.underlayColor
  },
  textStyle: function() {
    return {
      width: 230,
      flex: 1,
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
      color: this.props.textColor
    }
  }
});
