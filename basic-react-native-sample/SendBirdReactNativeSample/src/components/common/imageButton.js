var React = require('react-native');
var {
  Image,
  TouchableHighlight
} = React;

module.exports = React.createClass({
  render: function() {
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
});
