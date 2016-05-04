var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet
} = React;

var ImageButton = require('../common/imageButton');

var icon = require('../../img/logo-sendbird-info.png');
var exitIcon = require('../../img/btn-exit.png');

module.exports = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.exitContainer}>
          <ImageButton
            underlayColor={'#ffffff'}
            onPress={this.onPress}
            imageStyle={styles.exitIcon}
            image={exitIcon}
          />
        </View>
        <View style={styles.infoContainer}>
          <Image style={styles.sendbirdLogo} source={icon} />
          <Text style={styles.label}>Web SDK version 2.4.8</Text>
        </View>
      </View>
    );
  },
  onPress: function() {
    this.props.navigator.pop();
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  exitContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 30
  },
  infoContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50
  },
  label: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: '600',
    color: '#6E5BAA',
  },
  exitIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  sendbirdLogo: {
    width: 200,
    height: 191
  }
});
