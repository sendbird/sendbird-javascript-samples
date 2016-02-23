var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet
} = React;

var ImageButton = require('./imageButton');

var backIcon = require('../../img/btn-back.png');
var infoIcon = require('../../img/btn-info.png');
var memberIcon = require('../../img/btn-member.png');
var leaveIcon = require('../../img/btn-leave.png');
var startMessagingIcon = require('../../img/btn-start-message.png');
var inviteIcon = require('../../img/btn-invite.png');

module.exports = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.leftButton}>
          <ImageButton
            underlayColor={'#4e4273'}
            onPress={this.props.onBackPress}
            imageStyle={styles.imageButton}
            image={backIcon}
          />
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <Text style={styles.titleLabel}>{this.props.title}</Text>
        </View>

        <View style={styles.rightButton}>
          {this.renderButton()}
        </View>
      </View>
    );
  },
  renderButton: function() {
    if (this.props.onInfoPress) {
      return (
        <ImageButton
          underlayColor={'#4e4273'}
          onPress={this.props.onInfoPress}
          imageStyle={styles.imageButton}
          image={infoIcon}
        />
      );
    } else if (this.props.openChat) {
      return (
        <View style={styles.multiButtonContainer}>
          <ImageButton
            underlayColor={'#4e4273'}
            onPress={this.props.openChat.onMemberListPress}
            buttonStyle={styles.multiButtonItem}
            imageStyle={styles.imageButton}
            image={memberIcon}
          />

          <ImageButton
            underlayColor={'#4e4273'}
            onPress={this.props.openChat.onLeaveChannelPress}
            imageStyle={styles.imageButton}
            image={leaveIcon}
          />
        </View>
      );
    } else if (this.props.onInvitePress) {
      return (
        <ImageButton
          underlayColor={'#4e4273'}
          onPress={this.props.onInvitePress}
          imageStyle={styles.imageButton}
          image={startMessagingIcon}
        />
      );
    } else if (this.props.messaging) {
      return (
        <View style={styles.multiButtonContainer}>
          <ImageButton
            underlayColor={'#4e4273'}
            onPress={this.props.messaging.onMemberInvitePress}
            buttonStyle={styles.multiButtonItem}
            imageStyle={styles.imageButton}
            image={inviteIcon}
          />

          <ImageButton
            underlayColor={'#4e4273'}
            onPress={this.props.messaging.onMemberListPress}
            buttonStyle={styles.multiButtonItem}
            imageStyle={styles.imageButton}
            image={memberIcon}
          />

          <ImageButton
            underlayColor={'#4e4273'}
            onPress={this.props.messaging.onLeaveChannelPress}
            imageStyle={styles.imageButton}
            image={leaveIcon}
          />
        </View>
      );
    } else {
      return <Text></Text>;
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#4e4273',
    paddingTop: 20,
  },
  titleLabel: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 18
  },
  leftButton: {
    justifyContent: 'flex-start',
    paddingLeft: 5
  },
  rightButton: {
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  imageButton: {
    width: 30,
    height: 30
  },
  multiButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  multiButtonItem: {
    marginRight: 10
  }
});
